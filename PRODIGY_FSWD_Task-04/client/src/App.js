import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  if (!user || !token) {
    return <AuthPage setUser={setUser} setToken={setToken} />;
  }

  return <ChatPage user={user} token={token} />;
}

export default App;
