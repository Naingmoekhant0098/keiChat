import React, { useState } from "react";
import Button from "@mui/material/Button";


import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logInSuccess,logOutSuccess } from "./Slices/userSlice";
import { FaRocketchat } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSettingsInputSvideo } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa6";
import Avatar from "@mui/material/Avatar";
const Header = ({signInWithGoogle}) => {
    
  const [error, setError] = useState("");
  const [isDrop, setDrop] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  
  const handleProfile=()=>{
    setDrop(false)
  }
  const handleCheck =()=>{
    setDrop(false)
  }

  return (
    <div className=" flex relative  mx-auto items-center justify-between px-4 py-2 md:py-3 border-b border-gray-600">
      <div>
        <img src="/chat.png" alt="" className="  w-14" />
      </div>
      <div>
        {currentUser ? (
          <Avatar
            alt="Remy Sharp"
            src={`${currentUser.profile}`}
            className=" cursor-pointer"
            onClick={() => setDrop(!isDrop)}
          />
        ) : (
          <Button variant="outlined" className="">
            <span
              className="text-md text-white py-1 "
              onClick={signInWithGoogle}
            >
              sign in
            </span>
          </Button>
        )}
        <div
          className={` mt-4 absolute rounded-lg right-6 md:right-4  z-20  bg-zinc-800 w-48 p-4 py-2 border border-slate-800 cursor-pointer block ${
            !isDrop && "hidden"
          }`}
        >
          <div className=" hover:bg-zinc-700 px-4 py-2 flex items-center gap-2 rounded-lg my-1" onClick={handleProfile}>
            <FaUserAstronaut className=" text-xl" />
            <span style={{ fontSize: "15px" }}>Profile</span>
          </div>
          <Link to={'/chat'}>
          <div className=" hover:bg-zinc-700 px-4 py-2 flex items-center gap-2 rounded-lg my-1" onClick={handleCheck}>
          
           <FaRocketchat className=" text-xl" />
            <span style={{ fontSize: "15px" }}>Chat</span>
          
          </div>
          </Link>
          <div className=" hover:bg-zinc-700 px-4 py-2 flex items-center gap-2 rounded-lg my-1" onClick={()=>{
            dispatch(logOutSuccess()),
            setDrop(false)
          }}>
            <IoMdLogOut className=" text-xl" />
            <span style={{ fontSize: "15px" }}>LogOut</span>
          </div>
          
            
        </div>
      </div>
      
    </div>
  );
};

export default Header;
