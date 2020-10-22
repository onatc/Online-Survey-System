import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import { withFormik, Form, Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { MuiFormikTextField } from './mui2formik';
import styles from '../../styles';

/* Form used for user login. */
let LoginForm = ({ classes, inProgress, message }) => {
  return (
    <Card className={classes.centered}>
      <Form>
        <CardContent>
          <Field
            component={MuiFormikTextField}
            name="username"
            label="Username"
            className={classes.textField}
          />
          <Field
            component={MuiFormikTextField}
            type="password"
            name="password"
            label="Password"
            className={classes.textField}
          />
          {/* According to
          https://material.io/design/components/progress-indicators.html#linear-progress-indicators
          progress indicators should appear where text will appear.
          */
          inProgress && <LinearProgress />}
          {message && (
            <Typography color="error" variant="body1">
              {message}
            </Typography>
          )}
        </CardContent>
        <CardActions className={classes.centerChildren}>
          <Button type="submit">Submit!</Button>
          <Button component={RRLink} to={'/'}>
            Close
          </Button>
        </CardActions>
      </Form>
    </Card>
  );
};

export default withStyles(styles)(
  withFormik({
    mapPropsToValues: props => ({
      username: '',
      password: ''
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
      props.onSubmit(values);
      setSubmitting(false);
    },
    displayName: 'LoginForm'
  })(LoginForm)
);
