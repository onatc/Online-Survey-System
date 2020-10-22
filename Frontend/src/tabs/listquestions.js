import React, { useState, useEffect } from 'react';
import { parse as qsParse } from 'querystring';

import { Link as RRLink } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Fab } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import styles from '../styles';
import useDataApi from '../apihook';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../ui/RequireAuthentication';
import { dialog, Confirm } from '../ui/ConfirmDialog';
import axios from 'axios';

let ListQuestionsTab = ({ classes, location, history, currentUser }) => {
  let [page, setPage] = useState(() => {
    let query = qsParse(location.search.substring(1));
    return Number(query.page) || 0;
  });

  let { data, isLoading, isOk, request } = useDataApi(
    { method: 'GET', url: `${apiprefix}/question?page=${page}` },
    { users: [] }
  );

  useEffect(() => {
    let query = qsParse(location.search.substring(1));
    setPage(Number(query.page) || 0);
    request({ method: 'GET', url: `${apiprefix}/question?page=${page}` });
  }, [location]);

  let prevPage = page !== 0;
  let nextPage = data.has_more;
  const questions = isOk ? data.questions : [];
  const isAdmin = Boolean(Number(currentUser.admin));

  const goToPage = page => {
    let pathname = history.location.pathname;
    history.push({
      pathname,
      search: `?page=${page}`
    });
    setPage(page);
  };

  const TableHeadItem = ({ children }) => (
    <TableCell>
      <Typography variant="subtitle1">{children}</Typography>
    </TableCell>
  );

  const remove = async qid => {
    const dialog1 = await dialog(
      <Confirm title="Are you sure?">
        <Typography variant="body2">
          Are you sure you want to delete question #{qid}?
        </Typography>
      </Confirm>
    );
    if (dialog1) {
      try {
        await axios({
          method: 'DELETE',
          url: `${apiprefix}/question/${qid}`
        });
        request({ method: 'GET', url: `${apiprefix}/question?page=${page}` });
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) return <LinearProgress />;

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Available Questions
      </Typography>
      <Table aria-labelledby="tableTitle">
        <TableHead>
          <TableRow>
            <TableHeadItem>ID</TableHeadItem>
            <TableHeadItem>Question</TableHeadItem>
            {isAdmin ? <TableHeadItem>Options</TableHeadItem> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map(q => (
            <TableRow key={q.id}>
              <TableCell>
                <Tooltip
                  title={
                    <Typography variant="body2" color="textPrimary">
                      Click to vote on question #{q.id}
                    </Typography>
                  }
                >
                  <Link component={RRLink} to={`/question/${q.id}`}>
                    <IconButton aria-label="Vote">
                      <FingerprintIcon />
                    </IconButton>
                  </Link>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography> {q.question} </Typography>
                <br />
                <Typography> {q.description} </Typography>
                <br />
              </TableCell>
              {isAdmin ? (
                <TableCell>
                  <IconButton aria-label="Delete" onClick={() => remove(q.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    component={RRLink}
                    to={`/question/edit/${q.id}`}
                    aria-label="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={6}>
              <IconButton
                aria-label="Previous Page"
                disabled={!prevPage}
                onClick={() => goToPage(page - 1)}
              >
                <KeyboardArrowLeft fontSize="large" />
              </IconButton>
              <IconButton
                aria-label="Next Page"
                disabled={!nextPage}
                onClick={() => goToPage(page + 1)}
              >
                <KeyboardArrowRight fontSize="large" />
              </IconButton>
            </TableCell>
            <TableCell>
              {isAdmin ? (
                <Tooltip title={'Add new question'}>
                  <Fab
                    color="primary"
                    aria-label="Add Question"
                    component={RRLink}
                    to={`/question/new`}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
              ) : null}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </div>
  );
};

ListQuestionsTab = withStyles(styles)(RequireAuthentication(ListQuestionsTab));

export default ListQuestionsTab;
