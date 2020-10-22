import React from 'react';
import { withFormik, Form, Field } from 'formik';
import { Link as RRLink } from 'react-router-dom';

import styles from '../../styles';
import { MuiFormikRadioGroup } from './mui2formik';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/* Form used for register new users. */
let VoteForm = ({ classes, inProgress, question, isValid, errors }) => {
  return (
    <Card className={classes.leftSide}>
      <Form>
        <CardHeader
          disableTypography={true}
          title={<Typography variant="h5">{question.question}</Typography>}
        />
        <CardContent>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="body2">{question.description}</Typography>
            </Grid>
            <Grid item className={classes.padLeft}>
              <Field component={MuiFormikRadioGroup} name="vote">
                {question.choices.map((choices, i) => (
                  <FormControlLabel
                    key={choices.id}
                    value={String(choices.id)}
                    label={choices.description}
                    control={<Radio />}
                  />
                ))}
              </Field>
              {errors.vote}
            </Grid>
          </Grid>
          {/* According to
          https://material.io/design/components/progress-indicators.html#linear-progress-indicators
          progress indicators should appear where text will appear.
          */
          inProgress && <LinearProgress />}
        </CardContent>
        <CardActions>
          <Button type="submit">Vote!</Button>
          <Button component={RRLink} to={'/'}>
            Cancel
          </Button>
        </CardActions>
      </Form>
    </Card>
  );
};

const check = values => {
  let errors = {};
  if (!values.vote || values.vote === '')
    errors.vote = 'Please choose an option';
  return errors;
};

export default withStyles(styles)(
  withFormik({
    isInitialValid: true,
    enableReinitialize: true,
    mapPropsToValues: props => {
      return { vote: props.values.vote };
    },
    check,
    handleSubmit: (values, { setSubmitting, props }) => {
      props.onSubmit(values);
      setSubmitting(false);
    },
    displayName: 'VoteForm'
  })(VoteForm)
);
