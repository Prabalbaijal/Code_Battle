import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Friend({ user }) {
  const {onlineUsers}=useSelector(store=>store.user)
  const isOnline =onlineUsers?.includes(user?._id)
    const removeFriendHandler=async (username) => {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res=await axios.put(`${BACKEND_URL}/api/friends/remove`,{
            withCredentials:true
        })
        console.log(res)
        
    }
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
                <div>
                    <button onClick={removeFriendHandler}>
                        Remove Friend
                    </button>
                </div>
            <div className='h-[1px] py-0 my-0 divider bg-slate-500'></div>
    </div>
  )
}

export default Friend
