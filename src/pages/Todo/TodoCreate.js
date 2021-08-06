import axios from "axios";
import { React, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { getToken } from "../../utils/localStorage";
import InputLabel from "@material-ui/core/InputLabel";
import { ToastContainer, toast } from "react-toastify";
import FormControl from "@material-ui/core/FormControl";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { mapNamesToIds } from "../../utils/users";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function TodoCreate(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [associated_users, setSelectedUsers] = useState([]);
  const theme = useTheme();
  const { history } = props;
  const [names, setNames] = useState([]);
  const [users, setUsers] = useState([]);

  const classes = useStyles();

  useEffect(async () => {
    const users = await getAllUsers();

    const usersNames = users.map((user) => user.name);

    setUsers(users);

    setNames(usersNames);
  }, []);

  const createTodo = async () => {
    try {
      console.log(associated_users);

      let associated_users_id = mapNamesToIds(associated_users, users);

      console.log(associated_users_id);

      let response = await axios.post(
        "http://161.35.52.83:9000/api/todo/",
        {
          name,
          description,
          deadline,
          associated_users: associated_users_id,
        },
        {
          headers: {
            "auth-token": getToken(),
          },
        }
      );

      if (response.status === 200) toast.success("Sucessfully Created");

      return history.push("/todo");
    } catch (e) {
      toast.error(e.response.message);
    }
  };

  const getAllUsers = async () => {
    try {
      let response = await axios.get("http://161.35.52.83:9000/api/user", {
        headers: {
          "auth-token": getToken(),
        },
      });

      console.log(response.data);
      return response.data;
    } catch (e) {
      toast.error(e.response.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit");

    createTodo();
  };

  return (
    <Container className={classes.container}>
      <Card className={classes.card} variant="outlined">
        <header>
          <h1>Create Todo 📝</h1>

          <div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Name"
                  variant="outlined"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={classes.inputWrapper}>
                <TextField
                  className={classes.input}
                  label="Description"
                  multiline
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                />
              </div>

              <div className={classes.inputWrapper}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    label="Deadline"
                    className={classes.input}
                    value={deadline}
                    variant="outlined"
                    required
                    onChange={setDeadline}
                  />
                </MuiPickersUtilsProvider>
              </div>

              <div className={classes.inputWrapper}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-mutiple-name-label">
                    Associated Users
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-name-label"
                    id="demo-mutiple-name"
                    className={classes.input}
                    multiple
                    value={associated_users}
                    onChange={(e) => setSelectedUsers(e.target.value)}
                    input={<Input />}
                    MenuProps={MenuProps}
                  >
                    {names.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, associated_users, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className={classes.inputWrapper}>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Create
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
