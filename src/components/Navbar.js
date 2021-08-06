import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { logOut } from "../utils/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar(props) {
  const classes = useStyles();


  const signOut = () => {
    logOut();

    window.location.reload(false);
  };


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            To Do
          </Typography>
          {props.loggedIn ? (
            <Button color="inherit" onClick={() => signOut()}>
              Log Out
            </Button>
          ) : (
            <>
              <Link href="/login" color="inherit">
                LOGIN
              </Link>
              <p>&nbsp;/&nbsp; </p>
              <Link href="/register" color="inherit">
                REGISTER
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
