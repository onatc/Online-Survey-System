import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import UserForm from './forms/userinformation';
import styles from '../styles';
import useDataApi from '../apihook';
import apiprefix from '../apiprefix';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

let RegisterTab = ({ classes, updateUser }) => {
  // an user message to be displayed, if any
  let { data, isLoading, isOk, errorMessage, request } = useDataApi(
    null,
    {},
    data => data.token
  );
  // handle user registeration
  const addNewUser = async values => {
    request({ method: 'POST', url: `${apiprefix}/users`, data: values });
  };
  if (isOk) {
    updateUser(data.user);
    window.location.href = `${process.env.PUBLIC_URL}/`;
    return <Redirect to={'/'} />;
  }
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Register a new user
      </Typography>
      <UserForm
        onSubmit={addNewUser}
        message={isOk && data.message}
        errorMessage={errorMessage}
        inProgress={isLoading}
      />
    </div>
  );
};

RegisterTab.propTypes = {
  updateUser: PropTypes.func.isRequired
};

RegisterTab = withStyles(styles)(RegisterTab);

export default RegisterTab;
