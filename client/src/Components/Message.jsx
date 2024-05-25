import { Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LuCopy } from "react-icons/lu";
import axios from "axios";
import { MdReportGmailerrorred } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";

const Message = ({ data, handleDelete, currentchat, sentReaction, index }) => {
  const [userData, setUserData] = useState({});
  const [reaction, setReaction] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [copy, setCopy] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://keichat-6.onrender.com/auth/getUser/${data.senderId}`,
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
    <div>
      <div
        className={`flex gap-2  items-start ${
          currentUser?._id === data?.senderId && "flex flex-row-reverse"
        }`}
      >
        <Avatar img={userData?.profile} rounded size={"sm"} className=" mt-1" />
        <div className=" relative" onClick={() => setReaction(!reaction)}>
          
          {data?.text ? (
            <div className="relative text-sm bg-slate-700 p-2 rounded-lg border border-slate-800  cursor-pointer">
              {data?.text}

              <div className="  text-xs  mt-1  flex gap-1">
             {
              data?.likes && data?.likes.map((like,ie)=>{
                return <span key={ie} className={`   px-0.5 rounded text-xs ${like.senderId === currentUser._id ? 'bg-cyan-500' : 'bg-slate-400 disabled'}`}>{like?.reaction}</span>
              })
                 
             }

          </div>
            </div>
          ) : (
            <div className="relative text-sm bg-slate-700 overflow-hidden   rounded-lg border border-slate-800  cursor-pointer">
              <img src={data?.image} className=" w-64" alt="notfound" />
               
              <div className={`  text-xs   flex gap-1 ${data.image && 'p-2'}`}>
             {
              data?.likes && data?.likes.map((like,ie)=>{
                return <span key={ie} className={`   px-0.5 rounded text-xs ${like.senderId === currentUser._id ? 'bg-cyan-500' : 'bg-slate-400 disabled'}`}>{like?.reaction}</span>
              })
                 
             }

          </div>
              
            </div>
            
            
          )}
          <div
            className={`text-xs mt-1 text-gray-400  flex justify-between flex-1 items-center ${
              currentUser._id === data.senderId && "text-end"
            }`}
          >
            <span>{moment(data?.updatedAt).format("LT")}</span>{" "}
            <span
              className={`${currentUser._id !== data.senderId && "hidden"}`}
            >
              {data.isReceived ? (
                <IoCheckmarkDone className=" text-blue-500" />
              ) : (
                <IoMdCheckmark />
              )}
            </span>
          </div>
          <div
            className={`rounded-lg p-2  w-36  cursor-pointer   bg-slate-800  absolute z-10 -top-8 transition duration-300 -right-40 ${
              currentUser?._id === data?.senderId && "-left-40"
            }  ${reaction && "block"}`}
            hidden
          >
            <div className=" mb-3 flex items-center rounded text-sm  text-center ">
              <span
                className=" text-lg transition duration-300 hover:text-xl"
                onClick={() => sentReaction(data?._id, "😁", index)}
              >
                😁
              </span>
              <span
                className=" text-lg transition duration-300 hover:text-xl"
                onClick={() => sentReaction(data?._id, " 😒", index)}
              >
                😒
              </span>
              <span
                className=" text-lg transition duration-300 hover:text-xl"
                onClick={() => sentReaction(data?._id, "👍", index)}
              >
                👍
              </span>
              <span
                className=" text-lg transition duration-300 hover:text-xl"
                onClick={() => sentReaction(data?._id, "🥰", index)}
              >
                🥰
              </span>
              <span
                className=" text-lg transition duration-300 hover:text-xl"
                onClick={() => sentReaction(data?._id, "😡", index)}
              >
                😡
              </span>
            </div>
            <CopyToClipboard text={data?.text}>
              <div className=" text-sm px-2 py-2   rounded   hover:bg-slate-500 flex items-center ">
                <LuCopy className="text-lg mr-3" /> <span>Copy</span>
              </div>
            </CopyToClipboard>
            <div
              className="  flex items-center rounded text-sm py-2  px-2 text-center hover:bg-slate-500"
              onClick={() => handleDelete(data._id)}
            >
              <IoTrashOutline className="text-lg mr-3" /> <span>Delete</span>
            </div>
            <div className=" text-sm px-2 py-2  rounded   hover:bg-slate-500 flex items-center ">
              <MdReportGmailerrorred className="text-lg mr-3" />{" "}
              <span>Report</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
