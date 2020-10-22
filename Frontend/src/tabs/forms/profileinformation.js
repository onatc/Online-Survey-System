import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

import styles from '../../styles';

function createData(id, name, data) {
  return { id, name, data };
}

/* Form used for user login. */
let Profile = ({ classes, currentUser }) => {
  const rows = [
    createData(0, 'Id:', currentUser.id),
    createData(1, 'Username:', currentUser.username),
    createData(2, 'First Name:', currentUser.firstname),
    createData(3, 'Last Name:', currentUser.lastname),
    createData(4, 'Email:', currentUser.email)
  ];
  return (
    <form id="profileform">
      <Table className={classes.centered}>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </form>
  );
};

Profile = withStyles(styles)(Profile);

export default Profile;
