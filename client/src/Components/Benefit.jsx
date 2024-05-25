import React from 'react'

const Benefit = () => {
  return (
    <div className=' my-14'> 
    <h1 className=' text-center text-3xl font-semibold capitalize'>Why is the <span className=" text-yellow-400">best</span> Choice</h1>

    <div className='w-full flex mt-10 gap-4 flex-col md:flex-row p-6'>
        <div  className='w-full md:w-1/4    p-5 rounded-lg cursor-pointer shadow bg-zinc-800 border border-slate-900 hover:border-slate-500'>
            <h1 className=' text-lg  '>Sleek Design, Intuitive Interface</h1>
            <p className=' text-sm text-gray-400 mt-4 line-clamp-6'>
            Our sleek design and intuitive interface make chatting effortless. With smooth navigation and visually appealing layouts, [Chat App Name] ensures a delightful user experience every time.
            </p>
        </div>
        <div className='  w-full md:w-1/4 p-5 rounded-lg cursor-pointer shadow bg-zinc-800 border border-slate-900 hover:border-slate-500'>
            <h1 className=' text-lg  '>A Universe of The Interaction</h1>
            <p className=' text-sm text-gray-400 mt-4 '>
            From intimate one-on-ones to lively group discussions, [Chat App Name] empowers you with endless possibilities.
            </p>
        </div>
        <div className='  w-full md:w-1/4 p-5 rounded-lg cursor-pointer shadow bg-zinc-800 border border-slate-900 hover:border-slate-500'>
            <h1 className=' text-lg  '>Stay Organized, Stay Connected</h1>
            <p className=' text-sm text-gray-400 mt-4'>
            Stay organized with [Chat App Name]'s powerful features, including message search, chat archiving, and customizable notifications. 
            </p>
        </div>
        <div className='w-full md:w-1/4 p-5 rounded-lg cursor-pointer shadow bg-zinc-800 border border-slate-900 hover:border-slate-500'>
            <h1 className=' text-lg  '>Join The Conversation</h1>
            <p className=' text-sm text-gray-400 mt-4'>
            Join millions of users worldwide who trust [Chat App Name] for their everyday communication needs. Download the app today and start chatting in style!
            </p>
        </div>
         
    </div>
    
    </div>
  )
}

export default Benefit