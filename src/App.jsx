import React, { useState } from "react";
import './App.css';
import Todo from "./pages/Todo";

const App = () => {

  const [input, setInput] = useState('');
  const [todoList, setTodoList] = useState([]);

  const addTodo = () => {
    setTodoList([...todoList, input]);
  }

  const deleteTodo = (index) => {
    setTodoList(
      // _ これはmapメッソドのkeyに何か関係があるのかもしれない。これがなかったら削除ボタンを押しても消えなかった。
      todoList.filter((_,idx) => idx !== index)
    )
  }

  return (
    <div className='App'>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => addTodo()}>追加</button>
      <Todo todoList={todoList} deleteTodo={deleteTodo} />
    </div>
  )
}

export default App;
