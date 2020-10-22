import React from 'react';

import styles from '../styles';
import apiprefix from '../apiprefix';
import useDataApi from '../apihook';
import axios from 'axios';

import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import AddQuestionForm from './forms/addquestionform';

let EditQuestionTab = ({ match, classes }) => {
  let qid = match.params.qid;
  let { data, isLoading, request } = useDataApi(
    { method: 'GET', url: `${apiprefix}/question/${qid}` },
    { choices: [] }
  );
  async function updateQuestion(data) {
    try {
      // eslint-disable-next-line no-unused-vars
      let { data: resp } = await axios({
        method: 'PUT',
        url: `${apiprefix}/question/${qid}`,
        data: data
      });
      request({ method: 'GET', url: `${apiprefix}/question/${qid}` });
    } catch (err) {
      console.err(err);
    }
  }

  if (isLoading) return <LinearProgress variant="indeterminate" />;

  const newquestion = {
    question: data.question,
    description: data.description,
    type: data.type,
    choices: data.choices.map(c => c.description)
  };

  return (
    <Grid container>
      <Card className={classes.addQuestion}>
        <CardHeader
          title={<Typography variant="h4">Edit Question ${data.id}</Typography>}
        />
        <CardContent>
          <AddQuestionForm
            question={newquestion}
            onSubmit={v => updateQuestion(v)}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

EditQuestionTab = withStyles(styles)(EditQuestionTab);
export default EditQuestionTab;
