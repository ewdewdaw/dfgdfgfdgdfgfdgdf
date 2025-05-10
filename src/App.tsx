import React, { useState } from 'react';
import './index.css';
import HiddenChat from './components/HiddenChat';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);

  const handleMenuClick = () => {
    setClickCount(prev => {
      if (prev + 1 >= 3) {
        setShowChat(true);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="h-screen w-screen relative bg-[#f8f9fa]">
      <div className="w-full h-16 bg-white border-b border-[#dadce0] px-4 flex items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleMenuClick}
            className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <div className="h-0.5 w-full bg-[#5f6368]"></div>
              <div className="h-0.5 w-full bg-[#5f6368]"></div>
              <div className="h-0.5 w-full bg-[#5f6368]"></div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="https://www.gstatic.com/classroom/logo_square_48.svg" 
              alt="Classroom" 
              className="w-8 h-8"
            />
            <span className="text-[22px] text-[#5f6368]">Classroom</span>
          </div>
        </div>
        <div className="ml-auto">
          <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-medium">
            G
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-[#5f6368] text-xl mb-4">
            Error 500: Internal Server Error
          </div>
          <div className="text-[#3c4043] text-sm">
            The server encountered a temporary error and could not complete your request. Please try again in 30 seconds.
          </div>
          <button className="mt-6 px-6 py-2 bg-[#1a73e8] text-white rounded hover:bg-[#1557b0] transition-colors">
            Retry
          </button>
        </div>
      </div>
      
      {showChat && (
        <HiddenChat 
          authenticated={authenticated} 
          setAuthenticated={setAuthenticated} 
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default App;