import React, {useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from './components/Navbar'
import "./App.css"
import {BrowserRouter, Router, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import MyPost from './components/screens/myPost'
import SubscribesUserPosts from './components/screens/SubscribesUserPosts'
import ResetPwd from './components/screens/ResetPassword'
import NewPassword from './components/screens/NewPassword'

export const UserContext = createContext()

const Routing = () =>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
      // history.push('/')
    }
    else{
      if(!history.location.pathname.startsWith('/resetpwd')){
        history.push('/signin')
      } 
    }
  },[])
  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribesUserPosts />
      </Route>
      <Route path="/mypost">
        <MyPost />
      </Route>
      <Route exact path="/resetpwd">
        <ResetPwd />
      </Route>
      <Route path="/resetpwd/:token">
        <NewPassword />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
