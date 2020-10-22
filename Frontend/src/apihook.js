import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';

/*
 * Implementation of a generic API hook using useReducer().
 * This approach follows ideas published in https://www.robinwieruch.de/react-hooks-fetch-data/
 * which in turn are based on the general reducer pattern introduced in redux.
 *
 * The purpose of this hook is to handle the scenario that can occur during an API
 * request: after an API request is started, it takes time to complete (and may be delayed),
 * and it may not complete, but rather return an error.  The hook provides state variables
 * that captures these user interface states, allowing the user of the hook to provide
 * matching visual feedback to the user.
 */

/* Why a reducer function?
 * One core principle is that state should be immutable, and updates to the state
 * should be localized.  Using the reducer pattern, there's only one place where
 * state is updated: in the reducer function.
 * And since state is immutable under this pattern, "updating" means to produce
 * an entirely new version of the state object that reflects the update.
 *
 * Updates are called "actions" that are being "dispatched" via dispatch.
 */
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT': // request is about to start
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMessage: undefined,
        isOk: false
      };
    case 'FETCH_SUCCESS': // request succeeded with a 200 code
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: undefined,
        isOk: true,
        data: action.payload
      };
    case 'FETCH_FAILURE': // request failed, either due to network error or non-200.
      return {
        ...state,
        isLoading: false,
        isError: true,
        isOk: false,
        ...action.payload
      };
    default:
      throw new Error(`unknown dispatch action ${action.type}`);
  }
};

// seed authorization default headers on application boot
if (localStorage.token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${
    localStorage.token
  }`;

// axios config as per: https://www.npmjs.com/package/axios#axiosconfig
const useDataApi = (
  initialAxiosConfig = null,
  initialData = {},
  tokenExtractor = null
) => {
  // keep track of current HTTP request (think: method GET/POST + url + parameters)
  // whenever it changes, we must rerun the request.
  const [axiosConfig, setAxiosConfig] = useState(initialAxiosConfig);

  const [state, dispatch] = useReducer(
    dataFetchReducer,
    /* initial state= */ {
      isLoading: false,
      isError: false,
      // place the arbitrary initial data under 'data'
      // to avoid name clashes at the top level
      data: initialData
    }
  );

  useEffect(() => {
    let didCancel = false; // see long comment below

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' }); // update state to set 'isLoading'

      try {
        const result = await axios(axiosConfig);

        // If a tokenExtractor was provided, extract the token, store it in
        // localStorage, and set axios's default headers to include it.
        // This will allow you to call axios() elsewhere and the token will
        // be included.
        if (tokenExtractor) {
          const extractedToken = tokenExtractor(result.data);
          if (extractedToken) {
            localStorage.token = extractedToken;
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${extractedToken}`;
          }
        }
        if (!didCancel) {
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: result.data
          });
        }
      } catch (error) {
        // Generic error handling.
        // Step 1:
        // remove token if expired. This logic is specific to using the
        // passport-jwt package and its JwtStrategy on the server
        try {
          if (
            error.response.status === 401 &&
            error.response.data.message === 'jwt expired'
          )
            localStorage.removeItem('token');
        } catch {} // ignore any other reasons for errors

        if (!didCancel) {
          // Attempt at generic error handling.
          // Our goal is, for each error, to dispatch an error message suitable
          // for display to the user.
          let payload = { }
          if (error.response) {
            // Case 1: we can't reach the API server and instead obtain an error
            // response from an intermediate server (e.g. CRA development server)
            // Case 2: we did reach the API server, but got a non-200x.
            // In this case, we interpret the body ('data') as an error message
            // If it's JSON and contains a "message" field, prefer this as this is
            // the convention for our API.
            let { data, status, statusText } = error.response;
            let errorMessage = data;
            if (typeof data !== 'string' && 'message' in data)
              errorMessage = data.message;
            payload = { status, statusText, errorMessage };
          } else {
            // no response, for instance, in the case of a network error.
            // axios usually puts a message on the error, such as "Network Error"
            payload = { errorMessage: error.message || "unknown error"}
          }
          dispatch({
            type: 'FETCH_FAILURE',
            payload
          });
        }
      }
    };

    // fetch initial data if an initial request was given
    if (axiosConfig) fetchData();

    // the following cleanup function will be run by React when the component
    // that uses this hook is "unmounted," that is, it's removed from the DOM,
    // the user will not see it any longer.  This can happen at any time since
    // the user's actions can occursconcurrently with network requests that are
    // in progress, for instance if the user clicks on a different tab.
    // After React notifies us that the component is no longer on the screen,
    // we must take note and avoid any further calls that update React state.
    // Specifically, we must not call dispatch() anymore.
    return () => {
      didCancel = true;
    };
  }, [axiosConfig]); // rerun whenever axiosConfig is different.

  return {
    ...state,
    // return a setter for the axios configuration.  Calling request() with a new
    // axios configuration represents an update of our 'axiosConfig' state, which
    // will trigger a rerender.  When that happens, the 'useEffect' hook will
    // fire again since it's watching the axiosConfig
    //
    // Note that this comparison is not a deepEqual, so calling
    // request({ url: 'abc' }) twice will be considered 2 updates, resulting in
    // 'abc' to be refetched.
    request: axconf => {
      setAxiosConfig(axconf);
    }
  };
};

export default useDataApi;
