import axios from "axios";
import React, { useState } from "react";

import Card from "@material-ui/core/Card";
import { sendEmail } from "../../repositories/email";
import Button from "@material-ui/core/Button";
import "react-toastify/dist/ReactToastify.css";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  inputWrapper: {
    marginBottom: "30px",
  },
  card: {
    display: "inline-block",
    padding: "30px",
    width: "400px",
  },
  container: {
    marginTop: "40px",
  },
  input: {
    width: "100%",
  },
}));

export default function Register(props) {
  const classes = useStyles();

  const { history } = props;

  console.log("Props");
  console.log(props);

  const [name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const response = await axios.post(
        "http://161.35.52.83:9000/api/user/register",
        {
          name,
          email,
          password,
        }
      );

      const users = response.data;
      console.log(users);
      toast.success("Registered");

      const emailRepsonse = await sendEmail(
        name,
        email,
        "Sucessfully Registered",
        "Signned Up"
      );

      console.log(emailRepsonse);

      // Redirect to login
      history.push("/login");

      setUserName("");
      setEmail("");
      setPassword("");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <Container className={classes.container}>
      <Card className={classes.card} variant="outlined">
        <header>
          <h1>Register</h1>

          <div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Username"
                  required
                  variant="outlined"
                  value={name}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Email"
                  required
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Password"
                  required
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className={classes.inputWrapper}>
                <Button type="submit" variant="contained" color="primary">
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </header>
      </Card>
      <ToastContainer />
    </Container>
  );
}
