import React, { useState } from 'react';

import styles from '../styles';
import apiprefix from '../apiprefix';
import useDataApi from '../apihook';
import UserForm from './forms/userinformation';

import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

let EditProfileTab = ({ classes, updateUser, currentUser }) => {
  let {
    data: userData,
    isLoading: userIsLoading,
    isOk: userIsOk,
    request: userRequest
  } = useDataApi(
    { method: 'GET', url: `${apiprefix}/users/${currentUser.id}` },
    {}
  );

  let {
    data: updateUserData,
    isLoading: updateUserIsLoading,
    isError: updateUserIsError,
    isOk: updateUserIsOk,
    request: updateUserRequest
  } = useDataApi(null, {});

  let [waitForUpdate, setWaitForUpdate] = useState(false);
  if (waitForUpdate) {
    if (updateUserIsOk || updateUserIsError) {
      setWaitForUpdate(false);
    }
    if (updateUserIsOk) {
      userRequest({
        method: 'GET',
        url: `${apiprefix}/users/${currentUser.id}`
      });
    }
  }

  const updateProfile = async values => {
    let val = {
      id: values.id,
      username: values.username,
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password
    };
    updateUserRequest({
      method: 'PUT',
      url: `${apiprefix}/users/${currentUser.id}`,
      data: val
    });
    setWaitForUpdate(true);
  };
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Edit Profile
      </Typography>
      {userIsLoading && <LinearProgress variant="indeterminate" />}
      <UserForm
        onSubmit={updateProfile}
        message={updateUserIsOk && updateUserData.message}
        inProgress={updateUserIsLoading}
        currentUser={userIsOk ? userData : {}}
      />
    </div>
  );
};

EditProfileTab = withStyles(styles)(EditProfileTab);
export default EditProfileTab;
