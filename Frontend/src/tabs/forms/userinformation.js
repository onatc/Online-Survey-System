import React from 'react';
import PropTypes from 'prop-types';
import { withFormik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Link as RRLink } from 'react-router-dom';

import styles from '../../styles';
import { MuiFormikTextField } from './mui2formik';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

/* Form used for register new users. */
let UserForm = ({ classes, inProgress, message, errorMessage }) => {
  return (
    <Card className={classes.centered}>
      <Form autoComplete="off">
        <CardContent>
          <Field
            component={MuiFormikTextField}
            name="username"
            label="Username"
            className={classes.textField}
          />
          {/* According to
          https://material.io/design/components/progress-indicators.html#linear-progress-indicators
          progress indicators should appear where text will appear.
          */
          inProgress && <LinearProgress />}
          {errorMessage && (
            <Typography color="error" variant="body1" gutterBottom>
              {errorMessage}
            </Typography>
          )}
          {message && (
            <Typography color="error" variant="body1">
              {message}
            </Typography>
          )}

          <Field
            component={MuiFormikTextField}
            type="password"
            name="password"
            label="Password"
            className={classes.textField}
          />
          <Field
            component={MuiFormikTextField}
            type="password"
            name="password2"
            label="Confirm Password"
            className={classes.textField}
          />
          <Field
            component={MuiFormikTextField}
            type="text"
            name="firstname"
            label="First Name"
            className={classes.textField}
          />
          <Field
            component={MuiFormikTextField}
            type="text"
            name="lastname"
            label="Last Name"
            className={classes.textField}
          />
          <Field
            component={MuiFormikTextField}
            type="text"
            name="email"
            label="Email"
            className={classes.textField}
          />
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

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
  inProgress: PropTypes.bool
};

UserForm = withStyles(styles)(UserForm);

export default withStyles(styles)(
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => ({
      username: '',
      password: '',
      password2: '',
      firstname: '',
      lastname: '',
      email: '',
      ...props.currentUser
    }),
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
      password: yup
        .mixed()
        .required('Password is required')
        .test('match', 'Password do not match', function(password2) {
          return password2 === this.options.parent.password2;
        }),
      username: yup.string().required('Username is required')
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
      props.onSubmit(values);
      setSubmitting(false);
    },
    displayName: 'UserForm'
  })(UserForm)
);
