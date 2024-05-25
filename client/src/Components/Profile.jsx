import { Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { ImBlocked } from "react-icons/im";
import { FaBell } from "react-icons/fa6";
import { IoMdVideocam } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";

import { FaPhoneAlt } from "react-icons/fa";
import ScrollToTop from "../pages/ScrollToTop";
const Profile = ({ currentchat, onlineusers,setIsProfile }) => {
  const [userData, setUserData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [messages , setMessages] =useState(null)
  const userId = currentchat?.members?.find((id) => id !== currentUser._id);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:4000/auth/getUser/${userId}`,
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
    const fetchMessage = async () => {
      const res = await axios.get(
        `http://localhost:4000/message/${currentchat?._id}`,
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
  const isOnline = onlineusers.find((user) => user.userId === userId);

  return (
    <div className=" flex flex-col gap-8 ">
  
     <div className=" flex items-center gap-3"> <FaArrowLeft className="block md:hidden text-xl cursor-pointer" onClick={()=>setIsProfile(false)}/>
      <h1 className=" text-lg">Profile</h1></div>
      <div className=" text-center">
        <div className=" relative w-20 mx-auto">
        <Avatar img={userData?.profile} size={"lg"} rounded />
        {
        isOnline && (
          <FaCircle className=" text-green-500 absolute bottom-0  right-0 rounded-full bg-slate-900 p-1" style={{ fontSize: "20px" }} />
        )
      }
        </div>
        <h1 className=" mt-3">{userData?.username}</h1>
        <span className=" text-xs text-gray-400">{userData?.email}</span>
      </div>
      <div>
        <div className=" w-full justify-center flex items-center gap-5 text-3xl">
          <IoMdVideocam className=" hover:border p-1 rounded-full cursor-pointer" />
          <FaPhoneAlt className=" hover:border p-1 rounded-full cursor-pointer" />
          <FaBell className=" hover:border p-1 rounded-full cursor-pointer" />
          <ImBlocked className=" hover:border p-1 rounded-full cursor-pointer" />
        </div>
      </div>

      <div className="w-full p-4" >
        <h1>Medias</h1>
        <div className=" h-full  md:h-64 flex flex-wrap gap-4 md:gap-2 mt-4 overflow-y-auto no-scrollbar ">
          {
            messages && messages.map((message,index)=>{
             return  message?.image && (
              <img src={message?.image} key={index} className=" w-[47%] h-32 md:h-20  object-cover  rounded-lg cursor-pointer"/>
            )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
