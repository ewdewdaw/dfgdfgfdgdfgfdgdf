import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onChildAdded, runTransaction } from 'firebase/database';
import { X } from 'lucide-react';

interface HiddenChatProps {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  onClose: () => void;
}

interface Message {
  name: string;
  text: string;
  timestamp: number;
}

interface Room {
  id: string;
  name: string;
  userCount: number;
}

const HiddenChat: React.FC<HiddenChatProps> = ({ 
  authenticated, 
  setAuthenticated,
  onClose
}) => {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [privateRoomCode, setPrivateRoomCode] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<{[key: string]: number}>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const firebaseConfig = {
    apiKey: "AIzaSyAvIcTg-fl-nCtt-itk9pnikxACwTB14oM",
    authDomain: "omebgle.firebaseapp.com",
    databaseURL: "https://omebgle-default-rtdb.firebaseio.com/",
    projectId: "omebgle",
    storageBucket: "omebgle.appspot.com",
    messagingSenderId: "128737467266",
    appId: "1:128737467266:web:901505ef15ec99e2074d9b",
    measurementId: "G-7229HP84V5"
  };

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    
    if (authenticated && currentRoom) {
      const messagesRef = ref(db, `rooms/${currentRoom}/messages`);
      const usersRef = ref(db, `rooms/${currentRoom}/users`);
      
      // Listen for messages
      const messageUnsubscribe = onChildAdded(messagesRef, (snapshot) => {
        const msg = snapshot.val() as Message;
        if (msg && typeof msg === 'object') {
          setMessages(prev => [...prev, {
            name: String(msg.name || ''),
            text: String(msg.text || ''),
            timestamp: Number(msg.timestamp || Date.now())
          }]);
        }
      });

      // Update user count using transaction
      runTransaction(usersRef, (currentCount) => {
        const newCount = (currentCount || 0) + 1;
        setOnlineUsers(prev => ({...prev, [currentRoom]: newCount}));
        return newCount;
      });

      return () => {
        // Cleanup message listener
        messageUnsubscribe();
        
        // Update user count on leave using transaction
        runTransaction(usersRef, (currentCount) => {
          return Math.max(0, (currentCount || 1) - 1);
        });
      };
    }
  }, [authenticated, currentRoom]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const checkPassword = () => {
    if (password === 'secret123') {
      setAuthenticated(true);
      setShowRoomSelection(true);
    } else {
      alert('Incorrect password!');
    }
  };

  const joinPublicChat = () => {
    setCurrentRoom('public');
    setMessages([]);
    setShowRoomSelection(false);
  };

  const joinPrivateChat = () => {
    if (privateRoomCode.trim()) {
      setCurrentRoom(privateRoomCode.toLowerCase());
      setMessages([]);
      setShowRoomSelection(false);
    } else {
      alert('Please enter a room code');
    }
  };

  const sendMessage = () => {
    if (name.trim() && message.trim() && currentRoom) {
      const db = getDatabase();
      const messagesRef = ref(db, `rooms/${currentRoom}/messages`);
      
      push(messagesRef, {
        name: name.trim(),
        text: message.trim(),
        timestamp: Date.now()
      });
      
      setMessage('');
    } else {
      alert('Please enter both name and message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!authenticated) {
        checkPassword();
      } else if (showRoomSelection && privateRoomCode) {
        joinPrivateChat();
      } else if (currentRoom) {
        sendMessage();
      }
    }
  };

  const leaveRoom = () => {
    setCurrentRoom('');
    setMessages([]);
    setShowRoomSelection(true);
  };

  return (
    <div className="hidden-chat-container">
      <div className="chat-header">
        <h1>Hidden Chat</h1>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      
      {!authenticated ? (
        <div className="password-gate">
          <p className="chat-slogan">Encrypted. Secure. Anonymous.</p>
          <input 
            type="password" 
            placeholder="Enter access password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={checkPassword}>Enter</button>
        </div>
      ) : showRoomSelection ? (
        <div className="room-selection">
          <div className="public-room">
            <h2>Public Chat</h2>
            <p>Users online: {onlineUsers['public'] || 0}</p>
            <button onClick={joinPublicChat}>Join Public Chat</button>
          </div>
          
          <div className="private-room">
            <h2>Private Room</h2>
            <p>Enter a secret code to create or join a private room</p>
            <input 
              type="text" 
              placeholder="Enter room code (e.g., skibidi)" 
              value={privateRoomCode}
              onChange={(e) => setPrivateRoomCode(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={joinPrivateChat}>Join Private Room</button>
          </div>
        </div>
      ) : (
        <div className="chat-interface">
          <div className="chat-room-header">
            <h2>{currentRoom === 'public' ? 'Public Chat' : 'Private Room: ' + currentRoom}</h2>
            <p>Users online: {onlineUsers[currentRoom] || 1}</p>
            <button onClick={leaveRoom}>Leave Room</button>
          </div>

          <input 
            type="text" 
            placeholder="Enter your name..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <div className="messages-container" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <span className="message-sender">{String(msg.name)}:</span> {String(msg.text)}
              </div>
            ))}
          </div>
          
          <div className="message-input-container">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiddenChat;