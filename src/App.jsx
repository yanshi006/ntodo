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
  //未完了のTodoリストが変化したかを監視する変数
  //これは何のために監視しているのか
  const [isChangedTodo, setIsChangedTodo] = useState(false);
  //完了済みのTodoリストが変化したかを監視する変数
  //これは何のために監視しているのか
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
    //dbに変更があればレンダーする。 dbとは何か。レンダリングしたらどうなるのか
  }, [db])

  useEffect(() => {
    //もし未完了リストが変化したら...
    if (isChangedTodo) {
      (async () => {
        // 通信をするのでLoadingをtrue
        setIsLoading(true);
        //この変数は、firebaseのtodoListコレクションの中のtodoドキュメントを指定している。取得はしていない。
        const docRef = await db.collection('todoList').doc('todo');
        //firebaseのtodoドキュメントのtasksデータに未完了リストのstateのtodoListを表示している
        //このようにfirebaseにupdateすることで、更新しても消えないようになっている。
        docRef.update({ tasks: todoList });
        //Loadingが終了したから、falseにしている
        setIsLoading(false);
      })()//<-最後のこれは何なのか
    }
    //これは、この3つのうちのどれかが変更したらレンダーするのか、それとも、この3つ全部が変更されたらなのか。レンダリングしたらどうなるのか
  }, [todoList, isChangedTodo, db])

  useEffect(() => {
    //もし完了済みリストが変化したら...
    if (isChangedFinished) {
      (async () => {
        // 通信をするのでLoadingをtrue
        setIsLoading(true);
        //この変数は、firebaseのtodoListコレクションの中のfinishedTodoドキュメントを指定している。取得はしていない。
        const docRef = await db.collection('todoList').doc('finishedTodo');
        //firebaseのfinishedTodoドキュメントのtasksデータに完了済みリストのstateのfinishedListを表示している
        //このようにfirebaseにupdateすることで、更新しても消えないようになっている。
        docRef.update({ tasks: finishedList });
        // Loadingが終了したから、falseにしている。
        setIsLoading(false);
      })()
    }
    //これは、この3つのうちのどれかが変更したらレンダーするのか、それとも、この3つ全部が変更されたらなのか。レンダリングしたらどうなるのか
  }, [db, finishedList, isChangedFinished])

  const addTodo = async () => {
    //初期のinputの値はfalsyの値だから、!!だったらfalseになるのではないのか
    //falseの条件式の時に{}の中は動くのか。
    //このif文が無くても正常に動く。
    if (!!input) {
      //Todo(未完了リスト)が変化したのでtrue
      setIsChangedTodo(true);
      setTodoList([...todoList, input]);
      setInput('');
    }
  }

  //この関数は、未完了リストで削除ボタンが押された時のリスト
  const deleteTodo = (index) => {
    //Todo(未完了リスト)が変化したのでtrue
    setIsChangedTodo(true);
    setTodoList(
      //この _ は何の意味があるのか。これがなかったら削除ボタンを押しても消えなかった。
      todoList.filter((_, idx) => idx !== index)
    )
  }

  //この関数は、完了済みリストで削除ボタンが押されたとき完了済みリストのリスト
  const deleteFinishTodo = (index) => {
    //完了済みTodo(完了済みリスト)が変化したのでtrue
    setIsChangedFinished(true);
    setFinishedList(
      //この _ は何の意味があるのか。
      finishedList.filter((_, idx) => idx !== index)
    )
  }

  //この関数は、未完了リストで完了済みにするボタンが押された時の完了済みリストのリスト
  const finishTodo = (index) => {
    //Todo(未完了リスト)、完了済み(完了済みリスト)Todoがともに変化したのでtrue
    setIsChangedTodo(true);
    setIsChangedFinished(true);
    deleteTodo(index);
    setFinishedList(
      [...finishedList, todoList.find((_, idx) => idx === index)]
    )
  }
  //この関数は、完了済みリストで戻るボタンが押された時の未完了リストのリスト
  const reopenTodo = (index) => {
    //Todo(未完了リスト)、完了済み(完了済みリスト)Todoがともに変化したのでtrue
    setIsChangedTodo(true);
    setIsChangedFinished(true);
    deleteFinishTodo(index);
    setTodoList(
      [...todoList, finishedList.find((_, idx) => idx === index)]
    )
  }

  return (
    <div className='App'>
      <Title>Todo App</Title>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => addTodo()}>追加</button>
      {/* 16行目のconst [isLoading, setIsLoading] = useState(true);というのは、この下の処理を書くために監視していた。 */}
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