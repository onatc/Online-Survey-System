import React from 'react';
import { Link as RRLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import styles from '../styles';

let WelcomeTab = ({ classes }) => (
  <div className={classes.root}>
    <Typography align="center" variant="h5" gutterBottom>
      Welcome
    </Typography>
    <Typography component="p">
      Users can click to see
      <RRLink to={'/register'}> available surveys.</RRLink>
    </Typography>
  </div>
);

WelcomeTab = withStyles(styles)(WelcomeTab);

export default WelcomeTab;
