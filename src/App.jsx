import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Login';
import ChatRoom from './ChatRoom';
import { Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Chat from './Chat';
import Protectedroute from './Protectedroute';
import ForgotPassword from './ForgotPassword';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <div className="App">
      {//user ? <Chat /> : <Login onLogin={() => {}} />}
}
    <Routes>
      <Route path='/' element={<Chat/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>} />
    </Routes>
    </div>

  );
}

export default App;
