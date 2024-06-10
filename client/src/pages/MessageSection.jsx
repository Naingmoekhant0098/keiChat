import { Avatar, FileInput, TextInput } from "flowbite-react";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { FaCircle, FaPhone, FaPhoneAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoMdVideocam } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { LuSticker } from "react-icons/lu";
import InputEmoji from "react-input-emoji";
import Message from "../Components/Message";
import { io } from "socket.io-client";
import { FaArrowLeft } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";
import { ImAttachment } from "react-icons/im";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Components/Firebase";
import Model from "../Components/Model";
const MessageSection = ({
  currentchat,
  setSendMessage,
  receiveMessage,
  onlineusers,
  setTyping,
  receiveType,
  setIsOpen,
  setIsProfile,
  isProfile,
  seenMessage,
  setSendDeleteMessage,
  deleteReceMessage,
  setGetLastMsg,
  setGetReaction,
  receiveReaction,
}) => {
  const [userData, setUserData] = useState({});
  const [messages, setMessages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadFileError, setUploadFileError] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const userId = currentchat?.members?.find((id) => id !== currentUser._id);
  const [isFile, setIsFile] = useState(false);
  const socket = useRef();
  const scroll = useRef();
  const clickImage = useRef();
  const audio = new Audio("/iphone_send_sms.mp3");
  const isOnline = onlineusers.find((user) => user.userId === userId);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://keichat-6.onrender.com/auth/getUser/${userId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        setUserData(res.data.user);
      }
    };
    fetchUser();
  }, [currentchat]);

  useEffect(() => {
    if (receiveReaction) {
      const test = messages[receiveReaction?.index]?.likes?.find(
        (id) => id.senderId === receiveReaction.senderId
      );

      if (test) {
        const updateReaction = messages[receiveReaction?.index]?.likes.map(
          (lkk) =>
            lkk.senderId == receiveReaction?.senderId
              ? {
                  ...lkk,
                  reaction: receiveReaction?.reaction,
                }
              : lkk
        );
        setMessages(
          messages.map((msg) =>
            msg._id === receiveReaction?.messageId
              ? {
                  ...msg,
                  likes: updateReaction,
                }
              : msg
          )
        );
      } else {
        const newEmo = [
          ...messages[receiveReaction?.index]?.likes,
          receiveReaction,
        ];

        setMessages(
          messages.map((msg) =>
            msg._id === receiveReaction.messageId
              ? {
                  ...msg,
                  likes: newEmo,
                }
              : msg
          )
        );
      }
    }
  }, [receiveReaction]);

  useEffect(() => {
    if (seenMessage) {
      const lastMsg = messages[messages.length - 1];
      setMessages(
        messages.map((msg) =>
          msg._id === lastMsg._id
            ? {
                ...msg,
                isReceived: true,
              }
            : msg
        )
      );
    }
  }, [seenMessage]);
  useEffect(() => {
    const fetchMessage = async () => {
      const res = await axios.get(
        `https://keichat-6.onrender.com/message/${currentchat?._id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        setMessages(res.data.message);
      }
    };
    fetchMessage();
  }, [currentchat]);

  useEffect(() => {
    if (
      deleteReceMessage != null &&
      deleteReceMessage?.chatId === currentchat._id
    ) {
      setMessages(messages.filter((mgs) => mgs._id !== deleteReceMessage?._id));
    }
  }, [deleteReceMessage]);
  useEffect(() => {
    if (receiveMessage != null && receiveMessage.chatId === currentchat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);
  const imageHandler = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // setImageFile(file);
      //setFileUrl(URL.createObjectURL(file));
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const TaskUpload = uploadBytesResumable(storageRef, file);
      TaskUpload.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgress(progress.toFixed(0));
        },
        (error) => {
          setUploadFileError("Image file will only have 2mb sorry");
          console.log(error);
        },
        () => {
          getDownloadURL(TaskUpload.snapshot.ref).then((downloadUrl) => {
            setFileUrl(downloadUrl);
            // storeImg(downloadUrl);
            setIsFile(true);
          });
        }
      );
    }
  };
  const storeImg = async (downloadUrl, text, setText) => {
    if (downloadUrl) {
      const sendedMessage = {
        senderId: currentUser?._id,
        chatId: currentchat?._id,
        image: downloadUrl,
        text: text,
      };
      try {
        const addMessage = await axios.post(
          `https://keichat-6.onrender.com/message`,
          sendedMessage,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (addMessage.status === 200) {
          setMessages([...messages, addMessage.data.message]);
          setIsFile(false);
          setText(" ");
          const receiverId = currentchat?.members.find(
            (id) => id !== currentUser._id
          );
          setSendMessage({ ...addMessage.data.message, receiverId });
          audio.play();
          fileUrl(null);
        }
      } catch (error) {}
    }
  };

  const sendMessage = async () => {
    if (message) {
      const sendedMessage = {
        senderId: currentUser?._id,
        chatId: currentchat?._id,
        text: message,
      };

      try {
        const addMessage = await axios.post(
          `https://keichat-6.onrender.com/message`,
          sendedMessage,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (addMessage.status === 200) {
          setMessages([...messages, addMessage.data.message]);
          const receiverId = currentchat?.members.find(
            (id) => id !== currentUser._id
          );
          setSendMessage({ ...addMessage.data.message, receiverId });
          audio.play();
          setMessage("");
          setTyping("");
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behaviour: "smooth" });
  });

  const handleDelete = async (id) => {
    try {
      const deleteMessage = await axios.get(
        `https://keichat-6.onrender.com/message/deleteMessage/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (deleteMessage.status === 200) {
        setGetLastMsg(deleteMessage.data.prevmsg);

        setMessages(messages.filter((mgs) => mgs._id !== id));
        const receiverId = currentchat?.members.find(
          (id) => id !== currentUser._id
        );
        setSendDeleteMessage({
          ...deleteMessage.data.ress,
          receiverId,
          lastMsg: deleteMessage.data.prevmsg.lastMessage,
        });
      }
    } catch (error) {}
  };
  const sentReaction = async (messageId, reacts, index) => {
    const sendLike = {
      reaction: reacts,
      messageId: messageId,
      senderId: currentUser._id,
      chatId: currentchat?._id,
    };

    try {
      const resReact = await axios.put(
        "https://keichat-6.onrender.com/message/likeMessage",
        sendLike,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (resReact.status === 200) {
        const receiverId = currentchat?.members?.find(
          (id) => id !== currentUser._id
        );
        setGetReaction({ ...sendLike, index, receiverId });
        const isExit = messages[index].likes.find(
          (id) => id.senderId === currentUser._id
        );
        if (isExit) {
          const updateReaction = messages[index].likes.map((lkk) =>
            lkk.senderId == currentUser._id
              ? {
                  ...lkk,
                  reaction: reacts,
                }
              : lkk
          );
          setMessages(
            messages.map((msg) =>
              msg._id === messageId
                ? {
                    ...msg,
                    likes: updateReaction,
                  }
                : msg
            )
          );
        } else {
          const newEmo = [...messages[index].likes, sendLike];

          setMessages(
            messages.map((msg) =>
              msg._id === messageId
                ? {
                    ...msg,
                    likes: newEmo,
                  }
                : msg
            )
          );
        }
      }
    } catch (error) {}
  };

  return (
    <div className="  h-full flex flex-col gap-3 border-r border-l border-gray-700    relative  no-scrollbar overflow-x-hidden ">
      <Model
        fileUrl={fileUrl}
        storeImg={storeImg}
        isFile={isFile}
        setIsFile={setIsFile}
      />
      <div className="w-full relative z-30">
        <div className="w-full flex justify-between py-2   fixed md:relative  top-0 z-[300] bg-[#1a1a1a]   px-2 border-b border-gray-700">
          <div className=" flex gap-2 items-center">
            <FaArrowLeft
              className="block md:hidden text-xl cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
            <Avatar
              img={userData?.profile}
              rounded
              className=" cursor-pointer"
              onClick={() => setIsProfile(!isProfile)}
            />
            <div>
              <h1>{userData?.username}</h1>
              {receiveType ? (
                <span className=" text-xs   text-cyan-600">
                  <BeatLoader
                    color="rgb(8 145 178)"
                    size={6}
                    speedMultiplier={1}
                  />
                  Typing
                </span>
              ) : isOnline ? (
                <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <FaCircle style={{ fontSize: "10px" }} />{" "}
                  <span>Active Now</span>
                </span>
              ) : (
                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <FaCircle style={{ fontSize: "10px" }} />{" "}
                  <span>Last Seen Recently</span>
                </span>
              )}
            </div>
          </div>

          <div className=" flex items-center gap-5 text-3xl">
            <IoMdVideocam className=" hover:border p-1 rounded-full cursor-pointer" />
            <FaPhoneAlt className=" hover:border p-1 rounded-full cursor-pointer" />
            <IoEllipsisVerticalSharp className=" text-2xl cursor-pointer" />
          </div>
        </div>
      </div>

      <div className=" flex flex-1 py-12 md:py-0  p-2 rounded-lg flex-col gap-4 overflow-y-auto no-scrollbar ">
        {messages &&
          messages.map((message, index) => {
            return (
              <div key={index} ref={scroll}>
                <Message
                  data={message}
                  index={index}
                  handleDelete={handleDelete}
                  currentchat={currentchat}
                  sentReaction={sentReaction}
                />
              </div>
            );
          })}
      </div>

      <div className="flex items-center w-full gap-1 px-3 py-3  fixed md:relative  bottom-0 bg-[#1a1a1a]">
        <div className=" text-xl cursor-pointer hover:text-purple-500">
          <ImAttachment onClick={() => clickImage.current.click()} />
          <input
            id="image"
            type="file"
            hidden
            ref={clickImage}
            onChange={imageHandler}
          />
        </div>
        <div className=" flex flex-1">
          <InputEmoji
            value={message || ""}
            cleanOnEnter
            onChange={(e) => {
              setMessage(e), setTyping(e);
            }}
            onFocus={() => setIsFile(false)}
            onEnter={sendMessage}
            placeholder="Type a message"
            borderRadius={false}
            theme="auto"
            disabled={isFile ? false : true}
          />
          {/* <TextInput placeholder="Send a message...." className=" w-full" /> */}
        </div>
        <div>
          <IoMdSend
            className=" text-2xl cursor-pointer text-purple-500   "
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageSection;
