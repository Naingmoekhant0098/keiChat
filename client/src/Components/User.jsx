import { Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
const User = ({ data, currentchat, onlineusers, seenMessage }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState({});
  const userId = data?.members?.find((id) => id !== currentUser._id);
  const isOnline = onlineusers?.find((user) => user.userId === userId);
 
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
  }, [data]);
   

  return (
    <div
      className={` w-full flex items-center shadow  hover:bg-slate-700 gap-3 px-2 py-2 rounded-lg cursor-pointer ${
        currentchat?._id === data?._id && " bg-slate-700"
      }`}
    >
      <div className=" relative">
        <Avatar img={userData?.profile} rounded />
        {isOnline && (
          <FaCircle
            className=" text-green-500 absolute bottom-0 -right-1 rounded-full bg-slate-900 p-1"
            style={{ fontSize: "18px" }}
          />
        )}
      </div>
      <div className="flex-1">
        <div className=" flex justify-between gap-5 items-center">
          <h1 className=" text-sm">{userData?.username?.substring(0, 9)}</h1>
          <span className=" text-xs text-gray-400 block md:hidden">
            {moment(data?.updatedAt).format("LT")}
          </span>
        </div>
        <div className=" flex items-center justify-between">
          <span className=" text-xs text-gray-400">
            {data?.lastMessage?.substring(0, 10)}
            {data.lastMessage?.length > 10 ? "..." : ""}
          </span>
          
        </div>
      </div>
    </div>
  );
};

export default User;
