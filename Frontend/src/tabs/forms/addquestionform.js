import React from 'react';
import { withFormik, Form, Field } from 'formik';
import { Link as RRLink } from 'react-router-dom';

import styles from '../../styles';
import { MuiFormikTextField } from './mui2formik';
import MultiEntryField from './MultiEntryField';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

/* Form used for adding new questions (admin) */
let AddQuestionForm = ({
  classes,
  isLoading,
  values,
  message,
  setFieldValue
}) => {
  return (
    <Form>
      <Field
        component={MuiFormikTextField}
        name="question"
        fullWidth
        label={'Question'}
      />
      <Field
        component={MuiFormikTextField}
        name="description"
        fullWidth
        multiline
        rows={5}
        label={'Description'}
      />
      <MultiEntryField
        name="choices"
        value={values.choices}
        onChange={v => setFieldValue('choices', v)}
        entryLabel={idx => `#${idx + 1}`}
        addButtonLabel="Add a new choice"
        newEntryDefault="Enter Choice"
      />
      <Toolbar>
        <Button type="submit" className={classes.grow}>
          Save
        </Button>
        <Button component={RRLink} to={`/`} className={classes.grow}>
          Close
        </Button>
      </Toolbar>
      {message && (
        <Typography color="error" variant="body1" gutterBottom>
          {message}
        </Typography>
      )}
    </Form>
  );
};

export default withStyles(styles)(
  withFormik({
    isInitialValid: true,
    enableReinitialize: true,
    mapPropsToValues: ({ question }) => ({ ...question }),
    handleSubmit: (values, { setSubmitting, props }) => {
      props.onSubmit(values);
      setSubmitting(false);
    },
    displayName: 'AddQuestionForm'
  })(AddQuestionForm)
);
