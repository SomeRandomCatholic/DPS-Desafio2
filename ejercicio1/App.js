import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Registro from './components/Registro';
import Navigator from './components/Navigator';
import React, {useState} from 'react';

export default function App() {

  const [pantalla, setPantalla] = useState("Login");
  const [userID, setUserID] = useState(-1);
  
  if(pantalla == "Login")
    return( <Login setPantalla={setPantalla} setUserID={setUserID}/>)
  else if(pantalla == "Registro")
    return(<Registro setPantalla={setPantalla}/>)
  else if(pantalla == "Navigator")
    return(<Navigator setPantalla={setPantalla} userID={userID}/>)
}


