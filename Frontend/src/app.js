import React, { useState } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

import TabChooser from './ui/TabChooser';
import WelcomeTab from './tabs/welcome';
import RegisterTab from './tabs/register';
import LoginTab from './tabs/login';
import ProfileTab from './tabs/profile';
import ListUsersTab from './tabs/listusers';
import EditProfileTab from './tabs/editprofile';
import ListQuestionsTab from './tabs/listquestions';
import VoteTab from './tabs/vote';
import AddQuestionTab from './tabs/addquestion';
import EditQuestionTab from './tabs/editquestion';
import CssBaseline from '@material-ui/core/CssBaseline';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';

const darkTheme = createMuiTheme({
  palette: {
    primary: green,
    type: 'dark' // Switching the dark mode on is a single property value change.
  },
  typography: { useNextVariants: true } // avoids deprecated warning
});

const defaultTheme = createMuiTheme({
  typography: { useNextVariants: true } // avoids deprecated warning
});

const App = () => {
  // eslint-disable-next-line
  let [currentUser, updateUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const [, payload] = token.split(/\./);
      const decpayload = atob(payload);
      const finalpayload = JSON.parse(decpayload).payload;
      let id = finalpayload.id;
      let username = finalpayload.username;
      let admin = finalpayload.admin;
      let firstname = finalpayload.firstname;
      let lastname = finalpayload.lastname;
      let email = finalpayload.email;
      return {
        id,
        username,
        firstname,
        lastname,
        email,
        admin,
        authenticated: true
      };
    } catch {
      return { authenticated: false };
    }
  });
  let [isDark, switchThemeFunc] = useState(false);

  return (
    <MuiThemeProvider theme={isDark ? darkTheme : defaultTheme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route
            exact
            path="/logout"
            render={() => {
              localStorage.removeItem('token');
              window.location.href = `${process.env.PUBLIC_URL}/`;
              return <Typography variant="body2"> Logging out...</Typography>;
            }}
          />
          <Route
            exact
            path="/login"
            label="Login"
            render={() => (
              <LoginTab
                label="Login"
                updateUser={updateUser}
                currentUser={currentUser}
              />
            )}
          />
          <Route
            exact
            path="/register"
            label="Register"
            render={() => (
              <RegisterTab label="Register" updateUser={updateUser} />
            )}
          />
          {currentUser.authenticated && (
            <Route
              exact
              path={`/profile/edit/${currentUser.id}`}
              label="Edit Profile"
              render={() => (
                <EditProfileTab
                  label="Edit Profile"
                  updateUser={updateUser}
                  currentUser={currentUser}
                />
              )}
            />
          )}
          <Route>
            <TabChooser changeTheme={switchThemeFunc} user={currentUser}>
              <Route exact path="/" label="Welcome" component={WelcomeTab} />
              <Route
                exact
                path="/listusers"
                label="List Users"
                hideIf={!currentUser.admin}
                render={() => (
                  <ListUsersTab label="List Users" currentUser={currentUser} />
                )}
              />
              <Route
                exact
                path="/profile"
                label="Profile"
                hideIf={!currentUser.authenticated}
                render={() => (
                  <ProfileTab label="Profile" currentUser={currentUser} />
                )}
              />
              <Route
                exact
                path="/questions"
                label="Surveys"
                hideIf={!currentUser.authenticated}
                render={() => (
                  <ListQuestionsTab label="Surveys" currentUser={currentUser} />
                )}
              />
              <Route
                exact
                path="/question/new"
                label="Add New Question"
                hideIf={true}
                render={() => (
                  <AddQuestionTab
                    label="Add New Question"
                    currentUser={currentUser}
                  />
                )}
              />
              <Route
                exact
                path="/question/:qid"
                label="Vote for Question"
                hideIf={true}
                render={() => (
                  <VoteTab
                    label="Vote for Question"
                    currentUser={currentUser}
                  />
                )}
              />
              <Route
                exact
                path="/question/edit/:qid"
                label="Edit Question"
                hideIf={true}
                render={props => (
                  <EditQuestionTab
                    label="Edit Question"
                    currentUser={currentUser}
                    {...props}
                  />
                )}
              />
            </TabChooser>
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
