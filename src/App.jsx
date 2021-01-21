import React, { useEffect, useState } from "react";
import './App.css';
import Todo from "./pages/Todo";
import styled from "styled-components";
import firebase from "firebase";
import "firebase/firestore";

const App = () => {
  //input要素の入力値を管理している
  const [input, setInput] = useState('');
  //未完了のリストを管理している
  const [todoList, setTodoList] = useState([]);
  //完了済みのリストを管理している
  const [finishedList, setFinishedList] = useState([]);
  //Loading中かどうかを判定する変数
  const [isLoading, setIsLoading] = useState(true);
  //未完了のTodoが変化したかを監視する変数
  const [isChangedTodo, setIsChangedTodo] = useState(false);
  //完了済みのTodoが変化したかを監視する変数
  const [isChangedFinished, setIsChangedFinished] = useState(false);

  //これはデータベース
  const db = firebase.firestore();

  //firebaseからデータを取得してくるので、useEffectを使用する。
  // 一番最初にfirebaseからデータを取得してきて、stateに入れる。
  useEffect(() => {
    //この非同期処理はどういう意味なのか分からなかった
    (async () => {
      //この変数は、firebaseのtidoListコレクションの中のtodoドキュメントを取得している
      const resTodo = await db.collection('todoList').doc('todo').get();
      //tasksフィールドのデータをstateに入れている(未完了リスト)
      setTodoList(resTodo.data().tasks);
      //この変数は、firebaseのtodoListコレクションの中のfinishedTodoドキュメントを取得している
      const resFinishedTodo = await db.collection('todoList').doc('finishedTodo').get();
      //tasksフィールドのデータをstateに入れている(完了済みリスト)
      setFinishedList(resFinishedTodo.data().tasks);
      //Loadingが終了したから、falseにしている
      setIsLoading(false);
    })()//<-最後のこれは何なのか
    //dbに変更があればレンダーする。 dbとは何か
  }, [db])

  useEffect(() => {
    if (isChangedTodo) {
      (async () => {
        // 通信をするのでLoadingをtrue
        setIsLoading(true);
      //この変数は、firebaseのtodoListコレクションの中のtodoドキュメントを指定している。取得はしていない。
      const docRef = await db.collection('todoList').doc('todo');
        //firebaseのtasksデータにtodoListコレクションを表示している
        docRef.update({ tasks: todoList });
      //Loadingが終了したから、falseにしている
      setIsLoading(false);
      })()//<-最後のこれは何なのか
    }
    //これは、この3つのうちのどれかが変更したらレンダーするのか、それとも、この3つ全部が変更されたらなのか
  }, [todoList, isChangedTodo, db])

  useEffect(() => {
    if (isChangedFinished) {
      (async () => {
        // 通信をするのでLoadingをtrue
        //なんでtrueにするのか分からない
        setIsLoading(true);
        const docRef = await db.collection('todoList').doc('finishedTodo');
        docRef.update({ tasks: finishedList });
        // Loading終了
        setIsLoading(false);
      })()
    }
  }, [db, finishedList, isChangedFinished])

  const addTodo = async () => {
    //inputの値はfalsyだから、!!だったらfalseではないのか
    if (!!input) {
      //Todoが変化したのでtrue
      setIsChangedTodo(true);
      setTodoList([...todoList, input]);
      setInput('');
    }
  }

  //この関数は、未完了リストで削除ボタンが押した時のリスト
  const deleteTodo = (index) => {
    //Todoが変化したのでtrue
    setIsChangedTodo(true);
    setTodoList(
      // _ これはmapメッソドのkeyに何か関係があるのかもしれない。これがなかったら削除ボタンを押しても消えなかった。
      todoList.filter((_, idx) => idx !== index)
    )
  }
  //この関数は、完了済みリストで戻すボタンが押ししたときのリスト
  const deleteFinishTodo = (index) => {
    //完了済みTodoが変化したのでtrue
    setIsChangedFinished(true);
    setFinishedList(
      finishedList.filter((_, idx) => idx !== index)
    )
  }
  //この関数は、未完了リストで完了済みにするボタンを押した時の完了済みリストのリスト
  const finishTodo = (index) => {
    //Todo、完了済みTodoがともに変化したのでtrue
    setIsChangedTodo(true);
    setIsChangedFinished(true);
    deleteTodo(index);
    setFinishedList(
      //完了済みリストの新しいリスト
      [...finishedList, todoList.find((_, idx) => idx === index)]
    )
  }
  //この関数は、完了済みリストで戻るボタンを押した時の未完了リストのリスト
  const reopenTodo = (index) => {
    //Todo、完了済みTodoがともに変化したのでtrue
    setIsChangedTodo(true);
    setIsChangedFinished(true);
    deleteFinishTodo(index);
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
      {
        isLoading ?
          <Loading>loading</Loading>
          :
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
      }
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

const Loading = styled.div`
  margin: 40px auto;
`