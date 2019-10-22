import React, { Component } from "react";
import "./App.css";

// Header
class Header extends Component {
  render() {
    return (
      <div style={headerStyle}>
        <h1>Todo List</h1>
      </div>
    );
  }
}

// Add new Todo
class AddTodo extends Component {
  state = { title: "" };

  handleSubmit = e => {
    e.preventDefault();
    this.props.addTodo(this.state.title);
    this.setState({ title: "" });
  };

  render() {
    return (
      <form
        style={{ display: "flex", padding: "3px" }}
        onSubmit={this.handleSubmit}
      >
        <input
          style={{ flex: "10" }}
          type="text"
          placeholder="Add Todo..."
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
        />
        <button type="submit" style={{ flex: "1" }}>
          Submit
        </button>
      </form>
    );
  }
}

//list of todos
class Todos extends Component {
  getStyle = () => {
    return {
      textDecoration: this.props.todo.completed ? "line-through" : "none",
      backgroundColor: "lightGray",
      padding: "1px",
      border: "1px darkgray dotted"
    };
  };

  render() {
    const { id, title, completed } = this.props.todo;
    return (
      <div style={this.getStyle()}>
        <p>
          <input
            type="checkbox"
            checked={completed}
            onChange={this.props.toggleCompleted.bind(this, id, completed)}
          />
          {title}
          <button
            style={delBtnStyle}
            onClick={this.props.delTodo.bind(this, id)}
          >
            X
          </button>
        </p>
      </div>
    );
  }
}

class App extends Component {
  state = { todos: [] };

  // get the 10 rows from the todo list
  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/todos/?_limit=10")
      .then(res => res.json())
      .then(data => this.setState({ todos: data }))
      .catch(err => console.log(err));
  }

  // function to toggle the completed todo item
  toggleCompleted = (id, completed) => {
    const newCompleted = completed ? false : true;
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed: newCompleted })
    })
      .then(res => res.json())
      .then(data =>
        this.setState({
          todos: this.state.todos.map(todo => {
            if (todo.id === data.id) {
              todo.completed = data.completed;
            }
            return todo;
          })
        })
      );
  };

  // function to delete todo
  delTodo = id => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res =>
        this.setState({
          todos: this.state.todos.filter(todo => todo.id !== id)
        })
      )
      .catch(err => console.log(err));
  };

  //function to add new todo to the existing list
  addTodo = title => {
    const newTodo = { title: title, completed: false };
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTodo)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ todos: [...this.state.todos, data] });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Header />
        <AddTodo addTodo={this.addTodo} />
        {this.state.todos.map(todo => (
          <Todos
            key={todo.id}
            todo={todo}
            toggleCompleted={this.toggleCompleted}
            delTodo={this.delTodo}
          />
        ))}
      </div>
    );
  }
}

const headerStyle = {
  textAlign: "center",
  backgroundColor: "darkslategrey",
  color: "white",
  padding: "5px",
  margin: "0"
};

const delBtnStyle = {
  color: "red",
  backgroundColor: "darkgray",
  border: "none",
  fontWeight: "bold",
  float: "right",
  marginRight: "5px",
  borderRadius: "50%",
  padding: "5px 9px"
};

export default App;
