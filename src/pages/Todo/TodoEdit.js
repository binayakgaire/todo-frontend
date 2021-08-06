import axios from "axios";
import { React, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { getToken } from "../../utils/localStorage";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import { getAllUsers } from "../../repositories/users";
import { mapNamesToIds } from "../../utils/users";
import Loading from "../../assets/loading.gif"

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

export default function TodoEdit(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDeadline, setDeadline] = useState(new Date());
  const [selectedUsers, setSelectedUsers] = useState([]);
  const theme = useTheme();
  const [names, setNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const _id = props.match.params.id;

  useEffect(async () => {
    getTodo(_id);

    const users = await getAllUsers();
    const usersNames = users.map((user) => user.name);

    setNames(usersNames);

    setUsers(users);


  }, []);

  const getTodo = async (_id) => {
    try {
      setLoading(true)
      let response = await axios.get(`http://161.35.52.83:9000/api/todo/${_id}`, {
        headers: {
          "auth-token": getToken(),
        },
      });

      setName(response.data.name);
      setDeadline(response.data.deadline);
      setDescription(response.data.description);

      const selectedUsers = response.data.associated_users.map((user) => user.name);

      setSelectedUsers(selectedUsers);

    } catch (e) {
      toast.error(e.response.data);
    }finally{
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateTodo();
  };

  const updateTodo = async () => {
    try {


      let associated_users_id = mapNamesToIds(selectedUsers, users);

      let response = await axios.put(
        `http://161.35.52.83:9000/api/todo/${_id}`,
        {
          name,
          description,
          deadline: selectedDeadline,
          associated_users: associated_users_id,
        },
        {
          headers: {
            "auth-token": getToken(),
          },
        }
      );

      if (response.status === 200) toast.success("Sucessfully Updated");

      return props.history.push("/todo");
    } catch (e) {
      toast.error(e.response.message);
    }
  };

  return (
    <Container className={classes.container}>
      {
        loading ? (
          <img src={Loading} alt="Loading" height="100"/>
        ) : (
          <Card className={classes.card} variant="outlined">
            <header>
              <h1>Edit Todo ✏️</h1>

              <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className={classes.inputWrapper}>
                    <TextField
                      className={classes.input}
                      label="Name"
                      required
                      variant="outlined"
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
                        value={selectedDeadline}
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
                        value={selectedUsers}
                        onChange={(e) => setSelectedUsers(e.target.value)}
                        input={<Input />}
                        MenuProps={MenuProps}
                      >
                        {names.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, selectedUsers, theme)}
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
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </header>
          </Card>
        )
      }
      <ToastContainer />
    </Container>
  );
}
