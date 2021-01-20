import React from "react";
import styled from "styled-components";

const Todo = ({todoList, deleteTodo, changeTodoStatus, type}) => {
  return (
    todoList.map((todo,idx) => (
      <Container>
        {todo}
        <button onClick={() => deleteTodo(idx)}>削除</button>
        <button onClick={() => changeTodoStatus(idx)}>{type === 'todo' ? '完了済みにする' : '戻す'}</button>
      </Container>
    ))
  )
}

export default Todo

const Container = styled.div`
  color: #5c5c5c;
  letter-spacing: 1.8px;
`