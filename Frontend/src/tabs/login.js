import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, Redirect } from 'react-router';

import LoginForm from './forms/logininformation';
import styles from '../styles';
import useDataApi from '../apihook';
import apiprefix from '../apiprefix';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

let LoginTab = ({ classes, updateUser, location, currentUser }) => {
  const authenticated = currentUser.authenticated;
  if (authenticated) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  // eslint-disable-next-line
  let { data, isLoading, isError, isOk, errorMessage, request } = useDataApi(
    null,
    null,
    data => data.token
  );
  // eslint-disable-next-line
  const loginUser = async values => {
    request({ method: 'POST', url: `${apiprefix}/login`, data: values });
  };
  if (isOk) {
    updateUser(data.user);
    const { from } = location.state || { from: { pathname: '/' } };
    window.location.href = `${process.env.PUBLIC_URL}/`;
    return <Redirect to={from} />;
  }
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h4" gutterBottom>
        Login
      </Typography>
      <LoginForm
        onSubmit={values => loginUser(values)}
        message={errorMessage}
        inProgress={isLoading}
      />
      <Typography
        className={classes.topPadding}
        align="center"
        variant="body1"
        gutterBottom
      >
        Don't have an account? <Link to={'/register'}>Sign up</Link> for one.
      </Typography>
    </div>
  );
};

export default withStyles(styles)(withRouter(LoginTab));
