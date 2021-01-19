import React from "react";

const Todo = ({todoList, deleteTodo}) => {
  return (
    todoList.map((todo,idx) => (
      <div>
        {todo}
        <button onClick={() => deleteTodo(idx)}>削除</button>
      </div>
    ))
  )
}

export default Todo