import React from 'react';
import Profile from './forms/profileinformation';
import Typography from '@material-ui/core/Typography';
import styles from '../styles';
import { withStyles } from '@material-ui/core/styles';
import apiprefix from '../apiprefix';
import useDataApi from '../apihook';
let ProfileTab = ({ classes, currentUser }) => {
  let { data: userData } = useDataApi(
    { method: 'GET', url: `${apiprefix}/users/${currentUser.id}` },
    {}
  );
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Current User Profile
      </Typography>
      <Profile currentUser={userData} />
    </div>
  );
};

ProfileTab = withStyles(styles)(ProfileTab);
export default ProfileTab;
