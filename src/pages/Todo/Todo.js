import axios from "axios";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import AccordionActions from "@material-ui/core/AccordionActions";
import Divider from "@material-ui/core/Divider";
import { getToken } from "../../utils/localStorage";
import { formatDateTime } from "../../utils/date";
import AddIcon from "@material-ui/icons/Add";
import Loading from "../../assets/loading.gif";
import EmptyTodo from "../../assets/emptyTodo.svg"

const useStyles = makeStyles({
  root: {
    width: "80%",
    margin: "60px auto",
  }
});

export default function Todo(props) {
  const classes = useStyles();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyTodo, setEmptyTodo] = useState(false);

  const { history } = props;

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {

    try {
      setLoading(true);
      setEmptyTodo(false);
      let response = await axios.get("http://161.35.52.83:9000/api/todo/", {
        headers: {
          "auth-token": getToken(),
        },
      });

      if (response.data.length === 0) setEmptyTodo(true);
      setTodos(response.data);

    } catch (e) {
      toast.error(e.response.data);
    }
    finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      let response = await axios.delete(
        `http://161.35.52.83:9000/api/todo/delete/${id}`,
        {
          headers: {
            "auth-token": getToken(),
          },
        }
      );

      if (response.status === 200) toast.success("Successfully Deleted");
      getTodos();
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  const editTodoPage = (id) => {
    history.push({
      pathname: `/todo/edit/${id}`,
    });
  };

  const toggleComplete = async (id) => {
    try {

      let response = await axios.get(
        `http://161.35.52.83:9000/api/todo/toggle-complete/${id}`,
        {
          headers: {
            "auth-token": getToken(),
          },
        }
      );

      if (response.status === 200) toast.success("Sucessfully Changed");

      return true;
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  const accordion = (todo) => {
    return (
      <div key={todo._id}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
            <FormControlLabel
              aria-label="Acknowledge"
              onChange={(event) => toggleComplete(todo._id)}
              onFocus={(event) => event.stopPropagation()}
              control={<Checkbox />}
              checked={todo.completed}
              label={todo.name}
            />
          </AccordionSummary>
          <div style={{ textAlign: "left", padding: "8px 16px 16px" }}>
            <div>
              <b>Deadline: </b>
              {formatDateTime(todo.deadline)}
            </div>
            {todo.associated_users[0] ? (
              <div>
                <b>Associated Users: </b>
                {todo.associated_users.map((user) => user.name + " , ")}
              </div>
            ) : (
              ""
            )}
          </div>
          <AccordionDetails>
            <div>
              <Typography color="textSecondary">{todo.description}</Typography>
            </div>
          </AccordionDetails>
          <Divider />
          <AccordionActions>
            <Button
              size="small"
              onClick={() => {
                editTodoPage(todo._id);
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="secondary"
              onClick={() => {
                deleteTodo(todo._id);
              }}
            >
              DELETE
            </Button>
          </AccordionActions>
        </Accordion>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={() => {
            history.push("/todo/create");
          }}
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Todo
        </Button>
      </div>
      {emptyTodo ? (
        <div className="empty-todo"style={{ marginTop: "50px" }} >
          <img src={EmptyTodo} height="200" alt="Loading" />
          <p style={{color:"#999"}}>You have not added any todos. :(</p>
        </div>
      ) : (
        <>
          {
            loading ? (
              <img src={Loading} alt="Loading" height="100" />
            ) : (
              <div className={classes.root}>
                {todos.map((todo) => accordion(todo))}
                <ToastContainer />
              </div>
            )

          }
        </>
      )
      }
    </div >
  );
}
