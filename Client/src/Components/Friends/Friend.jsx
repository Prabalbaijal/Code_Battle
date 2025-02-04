import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Friend({ user }) {
  const {onlineUsers}=useSelector(store=>store.user)
  const isOnline =onlineUsers?.includes(user?._id)

  return (
    <div>
      
                <div className={`avatar ${isOnline ? 'online' : '' }`}>
                    <div className='w-10 rounded-full'>
                        <img alt="userprofile" src={user?.avatar} />
                    </div>
                </div>
                <div className='flex flex-col '>
                    <div className='flex justify-center flex-1 gap-2'>
                        <p>{user?.fullname}</p>
                    </div>
                </div>
            <div className='h-[1px] py-0 my-0 divider bg-slate-500'></div>
    </div>
  )
}

export default Friend
