import React, { useEffect, useRef, useState } from 'react';
import Sidebar from "../components/SidebarTemp";
import Header from "../components/Header";
import { GiHamburgerMenu } from "react-icons/gi";
import { ChatData } from '../context/ChatContext';
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingSmall, LoadingBig } from "../components/loading";
import { IoMdSend } from "react-icons/io";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const {
    messages,
    prompt,
    setPrompt,
    newRequestLoading,
    fetchResponse,
    loading,
    chats,
  } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const messagecontainerRef = useRef()
  
  useEffect(() => {
    if(messagecontainerRef.current){
      // Only scroll to bottom if user is near the bottom (within 100px)
      const { scrollTop, scrollHeight, clientHeight } = messagecontainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      if(isNearBottom){
        messagecontainerRef.current.scrollTo({
          top: messagecontainerRef.current.scrollHeight, 
          behavior: "smooth",
        });
      }
    }
  },[messages]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Hamburger for Mobile */}
        <div className="md:hidden p-4 bg-gray-800 text-2xl">
          <button onClick={toggleSidebar}>
            <GiHamburgerMenu />
          </button>
        </div>

        {/* Header */}
        <Header />

        {/* Chat Messages Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingBig />
            </div>
          ) : (
            <>
              {/* Scrollable messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 thin-scrollbar"
                ref={messagecontainerRef}>
                {messages && messages.length > 0 ? (
                  messages.map((e, i) => (
                    <div key={i}>
                      {/* User message */}
                      <div className="flex items-start space-x-2 mb-2">
                        <div className="bg-white text-black p-2 rounded-full text-xl">
                          <CgProfile />
                        </div>
                        <div className="bg-blue-700 p-4 rounded text-white max-w-3xl">
                          {e.question}
                        </div>
                      </div>

                      {/* Bot message */}
                      <div className="flex items-start space-x-2 mb-4">
                        <div className="bg-white text-black p-2 rounded-full text-xl">
                          <FaRobot />
                        </div>
                        <div className="bg-gray-700 p-4 rounded text-white max-w-3xl">
                          <p dangerouslySetInnerHTML={{ __html: e.answer }}></p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No chat yet.. 😢</p>
                )}
              </div>
              
              {/* Loading Spinner */}
              {newRequestLoading && <LoadingSmall />}
            </>
          )}
          
          {/* Prompt Box (fixed at bottom) */}
          {
            chats && chats.length===0 ? ( 
              ""
            ) : (
              <div className="px-6 pb-4">
            <form onSubmit={submitHandler} className="flex">
              <input
                className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
                type="text"
                placeholder="Enter a prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
              <button className="p-4 bg-gray-700 rounded-r text-2xl text-white">
                <IoMdSend />
              </button>
            </form>
          </div>
            )

          }
        </div>
      </div>
    </div>
  );
};

export default Home;