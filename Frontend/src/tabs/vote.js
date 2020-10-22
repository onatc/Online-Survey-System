import React, { useState } from 'react';
import axios from 'axios';

import VoteForm from './forms/voteinformation';
import styles from '../styles';
import useDataApi from '../apihook';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../ui/RequireAuthentication';

import Typography from '@material-ui/core/Typography';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import BarChart from '../ui/BarChart';
import MyChart from '../ui/BarChart';

let VoteTab = ({ classes, match, currentUser }) => {
  let questionid = match.params.qid;
  let { data, isOk, isLoading, isError } = useDataApi(
    { method: 'GET', url: `${apiprefix}/question/${questionid}` },
    { choices: [] }
  );

  let {
    data: vote,
    isError: isErrorVote,
    errorMessage: errorMessageVote,
    request: requestVote
  } = useDataApi(
    {
      method: 'GET',
      url: `${apiprefix}/question/${questionid}/vote?user=${currentUser.id}`
    },
    { votes: [-1] }
  );

  let currentVote = -1;
  if (!isErrorVote) currentVote = vote && vote.votes[0];

  let {
    data: votes,
    isLoading: isLoadingVotes,
    errorMessage: errorMessageVotes,
    request: requestVotes
  } = useDataApi(
    {
      method: 'GET',
      url: `${apiprefix}/question/${questionid}/vote`
    },
    { totals: [] }
  );

  let chartData = [];
  if (isOk) {
    chartData = data.choices.map(choice => {
      const count = votes.totals.filter(v => v.choice === choice.id);
      return {
        description: choice.description,
        votecount: count.length > 0 ? count[0].count : 0
      };
    });
  }

  let [voting, setVoting] = useState(false);
  async function voteForQuestion({ vote }) {
    try {
      setVoting(true);
      // eslint-disable-next-line no-unused-vars
      let { data: resp } = await axios({
        method: 'POST',
        url: `${apiprefix}/question/${questionid}/vote`,
        data: { choice: vote }
      });
      setVoting(false);
    } catch (err) {
      console.log(err.message);
    }
    requestVote({
      method: 'GET',
      url: `${apiprefix}/question/${questionid}/vote?user=${currentUser.id}`
    });
    requestVotes({
      method: 'GET',
      url: `${apiprefix}/question/${questionid}/vote`
    });
  }

  const showVote =
    vote && vote.votes && vote.votes.length > 0 && vote.votes[0] !== -1;
  return (
    <>
      <Grid container spacing={8}>
        {/* According to
          https://material.io/design/components/progress-indicators.html#linear-progress-indicators
          progress indicators should appear where text will appear.
          */
        isLoading && <LinearProgress />}
        <Grid item xs={6}>
          {!isError && (
            <VoteForm
              question={data}
              values={{ vote: String(currentVote) }}
              onSubmit={vote => voteForQuestion(vote)}
              inProgress={voting || isLoadingVotes}
            />
          )}
        </Grid>
        <Grid item xs={6} className={classes.hundredHeight}>
          <Paper className={classes.leftSide}>
            {errorMessageVote}
            {errorMessageVotes}
            {showVote && (
              <MyChart
                data={chartData}
                categoryKey="description"
                barKey="votecount"
              />
            )}
            {!showVote && (
              <Typography variant="subtitle1">
                You must vote first before you can see the results!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default withTheme()(withStyles(styles)(RequireAuthentication(VoteTab)));
