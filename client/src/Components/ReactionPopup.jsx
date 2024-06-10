import React from 'react'
 
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LuCopy } from "react-icons/lu";

import { MdReportGmailerrorred } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
const ReactionPopup = ({currentUser,data,sentReaction,reaction ,setReaction,index}) => {
  return (
    <div className=' absolute top-0 h-full z-30 w-full  bg-[rgba(0,0,0,0.2)] flex items-center justify-center' onClick={()=>setReaction(false)}>
        
         
          <div
            className={`rounded-lg p-2  w-40 cursor-pointer   bg-slate-800  transition duration-300 
            }  `}
            
          >
            <div className=" mb-3 flex items-center w-full rounded text-sm  text-center ">
              <span
                className=" text-2xl transition duration-300 hover:text-3xl"
                onClick={() => sentReaction(data?._id, "😁", index)}
              >
                😁
              </span>
              <span
                className=" text-2xl transition duration-300 hover:text-3xl"
                onClick={() => sentReaction(data?._id, " 😒", index)}
              >
                😒
              </span>
              <span
                className=" text-2xl transition dreactionuration-300 hover:text-3xl"
                onClick={() => sentReaction(data?._id, "👍", index)}
              >
                👍
              </span>
              <span
                className=" text-2xl transition duration-300 hover:text-3xl"
                onClick={() => sentReaction(data?._id, "🥰", index)}
              >
                🥰
              </span>
              <span
                className=" text-2xl transition duration-300 hover:text-3xl"
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
  )
}

export default ReactionPopup