import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCb095O0kMltNMnL--McgZ_mJXiDeA1aO8",
  authDomain: "todolist-3a584.firebaseapp.com",
  projectId: "todolist-3a584",
  storageBucket: "todolist-3a584.appspot.com",
  messagingSenderId: "182827246096",
  appId: "1:182827246096:web:975d8abcdc61b4a1e42095"
};
//firebaseの初期化
firebase.initializeApp(firebaseConfig);


ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// serviceWorker.unregister();