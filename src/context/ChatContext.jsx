import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);

  const [chats, setChats] = useState([]);

  const [selected, setSelected] = useState(null);

  async function fetchResponse() {
    if (prompt === "") return toast.error("Write prompt");

    setNewRequestLoading(true);
    const savedPrompt = prompt; // store it before clearing
    setPrompt("");

    try {
      const response = await axios.post("http://localhost:5000/getans", { prompt: savedPrompt });

      console.log("Full response data:", response.data.response);

      let answer = "No answer";

      if(response?.data?.response) {
        answer = response.data.response || "No answer";
      }

      const message = {
        question: savedPrompt,
        answer: answer,
      };

      setMessages((prev) => [...prev, message]);
      
      // Save the message to the backend
      try {
        const {data} = await axios.post(`${server}/api/chat/${selected}`, {
          question: savedPrompt,
          answer: answer,
        }, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    } catch (error) {
      toast.error("Something went wrong");
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else {
        console.error("Error message:", error.message);
      }
    } finally {
      setNewRequestLoading(false);
    }
  }

  async function fetchChats(){
    try {
      const{data} = await axios.get(`${server}/api/chat/all`, {
        headers:{
          token: localStorage.getItem("token"),
        },
      });
      setChats(data);
      // Only set selected if there are chats and the first chat exists
      if (data && data.length > 0) {
        setSelected(data[0]._id);
      } else {
        setSelected(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [createLod, setCreateLod] = useState(false);
  async function createChat(){
    setCreateLod(true)
    try {
      const {data} = await axios.post(`${server}/api/chat/new`,
         {},
         {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    await fetchChats();
    setCreateLod(false);
    } catch (error) {
      toast.error("Something went wrong")
      setCreateLod(false)
    }
  }
  const [loading, setLoading] = useState(false)
  async function fetchMessages(){
    // Don't fetch messages if no chat is selected
    if (!selected) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const {data} = await axios.get(`${server}/api/chat/${selected}`, {
        headers:{
          token: localStorage.getItem("token"),
        }
      });
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function deleteChat(id) {
    try {
      const {data} = await axios.delete(`${server}/api/chat/${id}`,{
        headers: {
          token: localStorage.getItem("token"),
        }
      });
      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Something went wrong")
    }
  }

  useEffect(() => {
    fetchChats()
    }, [])

    useEffect(()=>{
      fetchMessages()
    },[selected]);
  return (
    <ChatContext.Provider
      value={{
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        fetchResponse,
        chats,
        createChat,
        createLod,
        selected, setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);