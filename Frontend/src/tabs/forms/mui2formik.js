/* This file contains adapter components that link formik to Material-UI (mui)
 * They perform the task of making it such that a MuI component is rendered with the
 * appropriate properties reflecting the state of the form as it is managed by formik.
 *
 * Others have identified the need for such adapters as well, see
 * https://github.com/gerhat/material-ui-formik-components
 * and
 * https://github.com/stackworx/formik-material-ui
 *
 * However, rather than using one of those libraries, we duplicate the functionality here
 * to retain visibility and flexibility.
 * @author godmar Jan 2019
 */

import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import MuiRadioGroup from '@material-ui/core/RadioGroup';

/* Use like so:
 * <Field component={MuiFormikTextField} name= label= .... />
 */
const MuiFormikTextField = ({
  label,
  field,
  form: { dirty, errors },
  ...other
}) => {
  // adds form errors to helperText and sets error property
  const errorText = errors[field.name];
  const hasError = dirty && errorText !== undefined;

  return (
    <MuiTextField
      label={label}
      error={hasError}
      helperText={errorText || ''}
      {...field}
      {...other}
    />
  );
};

const MuiFormikRadioGroup = ({ field, form, ...other }) => {
  return <MuiRadioGroup {...field} {...other} />;
};

// For debugging.  Add <DisplayFormikState {...props} /> to your forms.// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a
const DisplayFormikState = props => (
  <div style={{ margin: '1rem 0', background: '#f6f8fa', padding: '.5rem' }}>
    {' '}
    <strong>Injected Formik props (the form's state)</strong>
    <div>
      <code>errors:</code> {JSON.stringify(props.errors, null, 2)}
    </div>
    <div>
      <code>values:</code>{' '}
      {Object.entries(props.values).map(([key, value]) => (
        <p key={key}>
          <code>&nbsp;{key}</code> {JSON.stringify(value, null, 2)}
        </p>
      ))}
    </div>
    <div>
      <code>isSubmitting:</code> {JSON.stringify(props.isSubmitting, null, 2)}
    </div>
    <div>
      <code>isValid:</code> {JSON.stringify(props.isValid, null, 2)}
    </div>
  </div>
);

export { MuiFormikTextField, MuiFormikRadioGroup, DisplayFormikState };
