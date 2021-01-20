import React, { useState } from "react";
import './App.css';
import Todo from "./pages/Todo";
import styled from "styled-components";

const App = () => {

  const [input, setInput] = useState('');
  const [todoList, setTodoList] = useState([]);
  //完了済みのリスト
  const [finishedList, setFinishedList] = useState([]);

  const addTodo = () => {
    if (!!input) {
      setTodoList([...todoList, input]);
      setInput('');
    }
  }
  //この関数は、未完了リストで削除ボタンが押した時のリスト
  const deleteTodo = (index) => {
    setTodoList(
      // _ これはmapメッソドのkeyに何か関係があるのかもしれない。これがなかったら削除ボタンを押しても消えなかった。
      todoList.filter((_, idx) => idx !== index)
    )
  }
  //この関数は、完了済みリストで戻すボタンが押ししたときのリスト
  const deleteFinishTodo = (index) => {
    setFinishedList(
      finishedList.filter((_, idx) => idx !== index)
    )
  }
  //この関数は、未完了リストで完了済みにするボタンを押した時の完了済みリストのリスト
  const finishTodo = (index) => {
    deleteTodo(index);
    setFinishedList(
      //完了済みリストの新しいリスト
      [...finishedList, todoList.find((_, idx) => idx === index)]
    )
  }
  //この関数は、完了済みリストで戻るボタンを押した時の未完了リストのリスト
  const reopenTodo = (index) => {
    deleteFinishTodo();
    setTodoList(
      //未完了リストの新しいリスト
      [...todoList, finishedList.find((_, idx) => idx === index)]
    )
  }

  return (
    <div className='App'>
      <Title>Todo App</Title>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => addTodo()}>追加</button>
      <TodoContainer>
        <SubContainer>
          <SubTitle>未完了</SubTitle>
          <Todo todoList={todoList} deleteTodo={deleteTodo} changeTodoStatus={finishTodo} type='todo' />
        </SubContainer>
        <SubContainer>
          <SubTitle>完了済み</SubTitle>
          <Todo todoList={finishedList} deleteTodo={deleteFinishTodo} changeTodoStatus={reopenTodo} type='done' />
        </SubContainer>
      </TodoContainer>
    </div>
  )
}

export default App;

const Title = styled.h1`
  font-size: 26px;
  color: #0097a7;
  letter-spacing: 2.8px;
  font-weight: 200;
`
const SubTitle = styled.p`
  font-size: 22px;
  color: #5c5c5c;
`
const SubContainer = styled.div`
  width: 400px;
`
const TodoContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 0 auto;
  justify-content: space-between;
`