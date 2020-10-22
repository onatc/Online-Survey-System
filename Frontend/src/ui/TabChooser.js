import React, { useState, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { withRouter, Switch as RRSwitch } from 'react-router';
import { Link as RRLink } from 'react-router-dom';
import styles from '../styles';

const TabChooser = ({
  classes,
  user,
  children,
  changeTheme,
  location,
  history
}) => {
  let tabs = children.filter(tab => tab && !tab.props.hideIf);

  function findCurrentTabBasedOnPath(location) {
    const selectedTab = tabs.findIndex(
      tab => tab.props.path === location.pathname
    );
    return selectedTab === -1 ? 0 : selectedTab;
  }
  const [currentTab, selectTab] = useState(() =>
    findCurrentTabBasedOnPath(location)
  );
  useEffect(() => {
    // returns unlisten function which is called as cleanup on unmount
    return history.listen(location => {
      selectTab(findCurrentTabBasedOnPath(location));
    });
  }, []);
  let [drawerOpen, setDrawerOpen] = useState(false);

  let drawerContent = (
    <div className="classes.mainMenuList">
      <MenuList>
        {tabs.map(tab => (
          <MenuItem
            component={RRLink}
            key={tab.props.path}
            to={tab.props.path}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemText inset={false} primary={tab.props.label} />
          </MenuItem>
        ))}
      </MenuList>
    </div>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.mainMenuButton}
            color="inherit"
            aria-label="Menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Tabs
            value={currentTab}
            onChange={(_event, value) => selectTab(value)}
          >
            {tabs.map((tab, i) => (
              <Tab
                key={tab.props.label}
                label={tab.props.label}
                component={RRLink}
                to={tab.props.path}
              />
            ))}
          </Tabs>
          <Typography align="right" color="inherit" style={{ flexGrow: 1 }} />

          {user.authenticated ? (
            <Tooltip title={`Edit Profile`}>
              <IconButton
                component={RRLink}
                to={`/profile/edit/${user.id}`}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          ) : null}
          {user.authenticated ? (
            <Tooltip title={<p>Logged on as {user.username}</p>}>
              <Button component={RRLink} to={'/logout'} color="inherit">
                Logout
              </Button>
            </Tooltip>
          ) : (
            <Button component={RRLink} to={'/login'} color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {drawerContent}
        </Drawer>
      </AppBar>
      <RRSwitch>{children}</RRSwitch>
    </>
  );
};

export default withStyles(styles)(withRouter(TabChooser));
