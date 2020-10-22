import React, { useState, useEffect } from 'react';
import { parse as qsParse } from 'querystring';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DoneIcon from '@material-ui/icons/Done';

import styles from '../styles';
import useDataApi from '../apihook';
import apiprefix from '../apiprefix';
import RequireAuthentication from '../ui/RequireAuthentication';

let ListUsersTab = ({ classes, location, history }) => {
  let [page, setPage] = useState(() => {
    let query = qsParse(location.search.substring(1));
    return Number(query.page) || 0;
  });

  let { data, isLoading, isOk, request } = useDataApi(
    { method: 'GET', url: `${apiprefix}/users?page=${page}` },
    { users: [] }
  );

  useEffect(() => {
    let query = qsParse(location.search.substring(1));
    setPage(Number(query.page) || 0);
    request({ method: 'GET', url: `${apiprefix}/users?page=${page}` });
  }, [location]);

  let prevPage = page !== 0;
  let nextPage = data.has_more;
  const users = isOk ? data.users : [];

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
  if (isLoading) return <LinearProgress />;

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h5" gutterBottom>
        Currently Registered Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadItem>ID</TableHeadItem>
            <TableHeadItem>Username</TableHeadItem>
            <TableHeadItem>First Name</TableHeadItem>
            <TableHeadItem>Last Name</TableHeadItem>
            <TableHeadItem>Email</TableHeadItem>
            <TableHeadItem>Admin</TableHeadItem>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>
                <Typography variant="body1">{u.id}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{u.username}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{u.firstname}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{u.lastname}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{u.email}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {u.admin === 1 && <DoneIcon />}
                </Typography>
              </TableCell>
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
          </TableRow>
        </TableHead>
      </Table>
    </div>
  );
};

ListUsersTab = withStyles(styles)(RequireAuthentication(ListUsersTab));

export default ListUsersTab;
