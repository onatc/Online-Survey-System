import React from 'react';

import { Link as RRLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import styles from '../styles';
import useDataApi from '../apihook';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../ui/RequireAuthentication';
import AddQuestionForm from './forms/addquestionform';

let AddQuestionTab = ({ classes }) => {
  let { data, isLoading, isOk, request } = useDataApi(null, {});

  function addQuestion(data) {
    request({
      method: 'POST',
      url: `${apiprefix}/question`,
      data: data
    });
  }

  let message;
  if (isOk) {
    message = <RRLink to={`/question/${data.id}`}>{data.message}</RRLink>;
  }

  return (
    <Grid container>
      <Card className={classes.addQuestion}>
        <CardHeader title="Add a New Question" />
        <CardContent>
          <AddQuestionForm
            question={{ question: '', description: '', type: 1, choices: [] }}
            onSubmit={v => addQuestion(v)}
            isLoading={isLoading}
            message={message}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

AddQuestionTab = withStyles(styles)(RequireAuthentication(AddQuestionTab));

export default AddQuestionTab;
