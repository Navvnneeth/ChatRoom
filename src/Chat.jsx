import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!auth.currentUser){
      navigate('/login');
    }
    const q = query(collection(db, "messages"), orderBy("timestamp"), limit(40));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMsgs(newMsgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await addDoc(collection(db, "messages"), {
        text,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        timestamp: serverTimestamp()
      });
      setText('');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans overflow-hidden">
      {/* Top Navbar */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 p-4 flex justify-between items-center shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            ChatRoom
          </h1>
        </div>
        <button
          onClick={() => {
            signOut(auth);
            navigate('/login');
          }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-1 shadow-lg hover:shadow-xl"
        >
          <span>Sign Out</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {msgs.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-4 rounded-xl shadow-lg max-w-xs md:max-w-md lg:max-w-lg transition-all duration-300 transform hover:scale-[1.02] relative ${
              msg.uid === auth.currentUser?.uid 
                ? 'ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-br-none'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 rounded-bl-none'
            }`}
          >
            <p className={`text-xs font-semibold ${
              msg.uid === auth.currentUser?.uid ? 'text-blue-200' : 'text-pink-300'
            }`}>
              {msg.email}
            </p>
            <p className="text-white mt-1">{msg.text}</p>
            <div className={`h-3 w-3 absolute -bottom-3 ${
              msg.uid === auth.currentUser?.uid ? '-right-3' : '-left-3'
            }`}>
              <div className={`h-full w-full ${
                msg.uid === auth.currentUser?.uid 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800'
              } clip-triangle`}></div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar - Fixed at bottom */}
      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 flex-shrink-0">
        <form
          onSubmit={onSubmit}
          className="flex items-center space-x-2"
        >
          <div className="flex-1 relative">
            <input
              className="w-full px-5 py-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-600 transition-all duration-300 placeholder-gray-400 pr-12"
              placeholder="Type your message..."
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button type="button" className="text-gray-400 hover:text-pink-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button type="button" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className={`p-3 rounded-full ${
              text.trim() 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-110'
                : 'bg-gray-600 cursor-not-allowed'
            } transition-all duration-300 shadow-lg`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .clip-triangle {
          clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Chat;