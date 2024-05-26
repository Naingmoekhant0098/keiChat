import React, { useEffect, useRef, useState } from "react";
import MessageSection from "./MessageSection";
import { TextInput } from "flowbite-react";
import User from "../Components/User";
import Profile from "../Components/Profile";
import axios from "axios";
import { useSelector } from "react-redux";
import NoChat from "../Components/NoChat";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { Avatar } from "flowbite-react";

const Chat = () => {
  const [chats, setChats] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [currentchat, setCurrentChat] = useState(null);
  const [onlineusers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReveiveMessage] = useState(null);
  const [isTyping, setTyping] = useState("");
  const [receiveType, setReceiveType] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [isAddNew, setAddNew] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [seenMessage, setSeenMessage] = useState(null);
  const [sendDeleteMessage, setSendDeleteMessage] = useState(null);
  const [deleteReceMessage, setDeleteRecMessage] = useState(null);
  const [getLastMsg, setGetLastMsg] = useState(null);
  const [getReaction, setGetReaction] = useState(null);
  const [receiveReaction, setreceiveReaction] = useState(null);
  const [searchData, setSearchData] = useState("");
  const socket = useRef();

  const userId = currentchat?.members?.find((id) => id !== currentUser._id);
  useEffect(() => {
    const fetchChat = async () => {
      const res = await axios.get(
        `https://keichat-6.onrender.com/chat/${currentUser._id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        setChats(res.data.user);
      }
    };
    fetchChat();
  }, []);

  useEffect(() => {
    const fetchUers = async () => {
      try {
        const res = await axios.get("https://keichat-6.onrender.com/auth/getUsers", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (res.status === 200) {
          setContacts(
            res.data.users.filter((ct) => ct._id !== currentUser._id)
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUers();
  }, []);

  const audio = new Audio(
    "/16403_download_iphone_note_sms_ringtone_iphone_sms_ringtones (2).mp3"
  );

  useEffect(() => {
    socket.current = io("http://localhost:4000");
    socket.current.emit("new-user-add", currentUser?._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [currentUser]);
  //send message to sever
  useEffect(() => {
    if (sendMessage != null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);
  //send reaction
  useEffect(() => {
    if (getReaction != null) {
      socket.current.emit("send-react-message", getReaction);
    }
  }, [getReaction]);
  useEffect(() => {
    socket.current.on("sendReceiveReact", (data) => {
      setreceiveReaction(data);
    });
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://keichat-6.onrender.com/auth/getUsers?username=${searchData}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setContacts(res.data.users.filter((ct) => ct._id !== currentUser._id));
      } catch (error) {}
    };

    fetchUser();
  }, [searchData]);

  //send delete message
  useEffect(() => {
    if (sendDeleteMessage != null) {
      socket.current.emit("send-delete-message", sendDeleteMessage);

      setChats(
        chats.map((chat) =>
          chat._id === sendDeleteMessage.chatId
            ? {
                ...chat,
                lastMessage: getLastMsg?.lastMessage
                  ? getLastMsg?.lastMessage
                  : "photo",
              }
            : chat
        )
      );
    }
  }, [sendDeleteMessage]);
  //send typeing status
  useEffect(() => {
    if (isTyping !== "") {
      socket.current.emit("not-typing", { receiverId: userId, status: true });
    } else {
      socket.current.emit("typing", { receiverId: userId, status: false });
    }
  }, [isTyping]);
  //receive message from sever

  useEffect(() => {
    socket.current.on("Deletemessage", (data) => {
      setDeleteRecMessage(data);
    });
  });
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReveiveMessage(data);

      if (data.senderId !== currentUser._id) {
        audio.play();
      }
    });
  }, []);
  // console.log(chats)
  useEffect(() => {
    if (receiveMessage && currentchat) {
      socket.current.emit("markMessageSeen", receiveMessage);
    }
    socket.current.on("asSeen", (data) => {
      setSeenMessage(data);
      const updateSeen = async () => {
        if (data) {
          try {
            const updateSeen = await axios.put(
              "https://keichat-6.onrender.com/message/updateSeen",
              data,
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            // console.log(updateSeen)
          } catch (error) {}
        }
      };
      updateSeen();
    });
  }, [receiveMessage, currentchat, socket]);

  useEffect(() => {
    if (receiveMessage) {
      setChats(
        chats.map((chat) =>
          chat._id === receiveMessage.chatId
            ? {
                ...chat,
                lastMessage: receiveMessage?.text
                  ? receiveMessage?.text
                  : "photo",
                updatedAt: new Date(),
              }
            : chat
        )
      );
    }
  }, [receiveMessage]);

  useEffect(() => {
    if (deleteReceMessage) {
      setChats(
        chats.map((chat) =>
          chat._id === deleteReceMessage.chatId
            ? {
                ...chat,
                lastMessage: deleteReceMessage?.lastMsg
                  ? deleteReceMessage?.lastMsg
                  : "photo",
              }
            : chat
        )
      );
    }
  }, [deleteReceMessage]);

  useEffect(() => {
    if (sendMessage) {
      setChats(
        chats.map((chat) =>
          chat._id === sendMessage.chatId
            ? {
                ...chat,
                lastMessage: sendMessage?.text ? sendMessage?.text : "photo",
                updatedAt: new Date(),
              }
            : chat
        )
      );
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current.on("sendTyping", (data) => {
      setReceiveType(data.status);
    });
  }, []);
  useEffect(() => {
    socket.current.on("sendnotTyping", (data) => {
      setReceiveType(data.status);
    });
  }, []);

  const handleAddNew = async (id) => {
    try {
      const res = await axios.post("https://keichat-6.onrender.com/chat", {
        senderUId: currentUser?._id,
        receiverUId: id,
      });

      if (res.status === 200) {
        setCurrentChat(res.data.chat);
        const findChat = chats.find((chat) => chat._id === res.data.chat._id);

        if (!findChat) {
          setChats([...chats, res.data.chat]);
        }
      }
    } catch (error) {}
  };
 
  return (
    <div className=" w-full flex h-screen md:max-h-[650px] relative">
      <div className="w-full md:w-1/5  p-4 max-h-full  overflow-hidden bg-slate-800  rounded-lg rounded-tr-none">
        <div className=" w-full flex items-center justify-between">
          <h1 className=" text-xl">Chats</h1>
          <FaPlus
            className=" text-xl cursor-pointer"
            onClick={() => setAddNew(true)}
          />
        </div>
        <TextInput
          className=" mt-4"
          size={"sm"}
          placeholder="Search...."
          value={searchData}
          onChange={(e) => {
            setSearchData(e.target.value), setAddNew(true);
          }}
        />

        <div className=" flex flex-col gap-3 mt-4 h-full overflow-y-scroll no-scrollbar   ">
          {chats?.map((chat, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setCurrentChat(chat), setIsOpen(true);
                }}
              >
                <User
                  data={chat}
                  currentchat={currentchat}
                  onlineusers={onlineusers}
                  seenMessage={seenMessage}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`w-full md:w-1/5 absolute transition duration-300 p-4 h-full bg-slate-800  rounded-lg rounded-tr-none ${
          isAddNew ? "block" : "hidden"
        }  `}
      >
        <div className=" w-full flex items-center justify-between">
          <div className=" flex items-center gap-3">
            <FaArrowLeft
              className="text-xl cursor-pointer"
              onClick={() => setAddNew(false)}
            />
            <h1 className=" text-lg">Add New Chats</h1>
          </div>
        </div>
        <TextInput
          className=" mt-4"
          size={"sm"}
          placeholder="Search...."
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <div
          className={`flex flex-col gap-3 mt-4 h-full overflow-y-scroll no-scrollbar `}
        >
          {contacts?.length ? (
            contacts?.map((chat, index) => {
              return (
                <div key={index} onClick={() => setIsOpen(true)}>
                  <div
                    className={` w-full flex items-center shadow  hover:bg-slate-700 gap-3 px-2 py-2 rounded-lg cursor-pointer
                    `}
                    onClick={() => handleAddNew(chat?._id)}
                  >
                    <div className=" relative">
                      <Avatar img={chat?.profile} rounded />
                    </div>

                    <div>
                      <h1 className=" text-sm">
                        {chat?.username?.substring(0, 9)}
                      </h1>
                      <span className=" text-xs text-gray-400">
                        {chat?.email.substring(0, 10)}...
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h3>Search not found</h3>
          )}
        </div>
      </div>
      <div
        className={`w-full  md:flex-1 h-full  bg-[#1a1a1a]  md:block md:relative  absolute  left-0 ${
          isOpen ? "block" : "hidden"
        } `}
      >
        {currentchat ? (
          <MessageSection
            currentchat={currentchat}
            setSendMessage={setSendMessage}
            onlineusers={onlineusers}
            receiveMessage={receiveMessage}
            setTyping={setTyping}
            receiveType={receiveType}
            setIsOpen={setIsOpen}
            setIsProfile={setIsProfile}
            isProfile={isProfile}
            seenMessage={seenMessage}
            setSendDeleteMessage={setSendDeleteMessage}
            deleteReceMessage={deleteReceMessage}
            setGetLastMsg={setGetLastMsg}
            setGetReaction={setGetReaction}
            receiveReaction={receiveReaction}
          />
        ) : (
          <NoChat />
        )}
      </div>
      <div
        className={`w-full border-r border-gray-700 ${
          isProfile ? "md:block" : "md:hidden"
        } h-full md:w-1/5   p-4 px-2 ${
          currentchat === null ? "md:hidden" : "md:block"
        }  bg-[#1a1a1a]  md:relative  absolute z-10 left-0 ${
          isProfile ? "block" : "hidden"
        }`}
      >
        <Profile
          currentchat={currentchat}
          onlineusers={onlineusers}
          setIsProfile={setIsProfile}
        />
      </div>
    </div>
  );
};

export default Chat;
