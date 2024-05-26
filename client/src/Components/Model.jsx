import { Button, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import {RxCross2} from 'react-icons/rx'
const Model = ({fileUrl,storeImg,isFile,setIsFile}) => {
    const [text,setText]=  useState('')
  return (
    <div className={`absolute bottom-24 left-10 w-80 h-auto bg-slate-700 z-50 rounded p-4 pt-3 ${isFile  ? 'block' : 'hidden'}`}>
        <div><RxCross2  className='text-2xl cursor-pointer' onClick={()=>setIsFile(false)}/></div>
        <div>
            <img src={fileUrl} alt="" className='w-full h-64 object-cover rounded mt-4' />
        </div>
        <div className='flex items-center mt-3 gap-2'>
            <TextInput className=' flex-1' value={text} onChange={(e)=>setText(e.target.value)} placeholder='Caption.... ' />
            <Button onClick={()=>storeImg(fileUrl,text,setText)}>Send</Button>
        </div>
    </div>
  )
}

export default Model