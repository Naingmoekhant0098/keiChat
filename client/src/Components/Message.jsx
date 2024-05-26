import { Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

import ReactionPopup from "./ReactionPopup";
import axios from "axios";
const Message = ({ data, handleDelete, currentchat, sentReaction, index }) => {
  const [userData, setUserData] = useState({});
  const [reaction, setReaction] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [copy, setCopy] = useState("");
  useEffect(() => {
    // window.addEventListener('click',()=>{
    //   docum
    // })
  }, []);

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
    <div className="">
      <div
        className={`flex gap-2  items-start ${
          currentUser?._id === data?.senderId && "flex flex-row-reverse"
        }`}
      >
        <Avatar img={userData?.profile} rounded size={"sm"} className=" mt-1" />
        <div className=" relative no-scrollbar" onClick={() => setReaction(!reaction)}>
          {data && (
            <div className="relative text-sm bg-slate-900 rounded-lg overflow-hidden border border-slate-800  cursor-pointer no-scrollbar">
              {data?.image && (
                <img src={data?.image} className=" w-64" alt="notfound" />
              )}
              {data?.text && <div className=" p-2 mt-1 pb-1"> {data?.text}</div>}

              <div className="  text-xs  my-1 ml-2  flex gap-1">
                {data?.likes &&
                  data?.likes.map((like, ie) => {
                    return (
                      <span
                        key={ie}
                        className={`   px-0.5 rounded text-xs ${
                          like.senderId === currentUser._id
                            ? "bg-cyan-500"
                            : "bg-slate-400 disabled"
                        }`}
                      >
                        {like?.reaction}
                      </span>
                    );
                  })}
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
        
        </div>
        
      </div>
      {
            reaction && <ReactionPopup index={index}  currentUser={currentUser} data={data} reaction={reaction} sentReaction={sentReaction} setReaction={setReaction} handleDelete={handleDelete} />
          }
      
    </div>
  );
};

export default Message;
