import React, { useState } from "react";
import './App.css';

const App = () => {

  const [input, setInput] = useState('');
  const [todoList, setTodoList] = useState([]);

  const addTodo = () => {
    setTodoList([...todoList, input]);
  }

  const deleteTodo = (index) => {
    setTodoList(
      todoList.filter((idx) => idx !== index)
    )
  }

  return (
    <div className='App'>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button>追加</button>
      <Todo todoList={todoList} deleteTodo={deleteTodo} />
    </div>
  )
}

export default App;
