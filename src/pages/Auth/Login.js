import axios from "axios";
import { React, useState } from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { storeToken } from "../../utils/localStorage";
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

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { history } = props;

  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();

    login();
  };

  const login = async () => {
    try {
      let response = await axios.post("http://161.35.52.83:9000/api/user/login", {
        email,
        password,
      });

      if (response.status === 200) storeToken(response.data);

      toast.success("Sucessfully Logged In");
      props.setLoggedIn(true);

      // Redirect to login
      history.push("/todo");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data);
    }
  };

  return (
    <Container className={classes.container}>
      <Card className={classes.card} variant="outlined">
        <header>
          <h1>Login</h1>
          <div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Email"
                  variant="outlined"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Password"
                  variant="outlined"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className={classes.inputWrapper}>
                <Button type="submit" variant="contained" color="primary">
                  Log In
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
