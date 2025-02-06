
// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setLoggedinUser } from '../../redux/userSlice.js';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Settings, LogOut } from 'lucide-react';

// const Stats = () => {
//   const { loggedinUser } = useSelector(store => store.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

//   const logoutFunction = async () => {
//     try {
//       const res = await axios.get('http://localhost:9000/api/users/logout');
//       navigate("/");
//       toast.success(res.data.message);
//       dispatch(setLoggedinUser(null));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col justify-between p-4 bg-white border-r border-gray-300">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center">
//         <img
//           src={loggedinUser?.avatar}
//           alt="Profile Pic"
//           className="w-24 h-24 rounded-full mb-4"
//         />
//         <div className="text-center">
//           <h2 className="text-xl font-semibold">{loggedinUser?.fullName}</h2>
//           <p className="text-gray-600">@{loggedinUser?.userName}</p>
//           <p className="text-gray-500">{loggedinUser?.email}</p>
//           <div className="mt-2">
//             <p className="text-gray-500">Levels: {loggedinUser?.levels}</p>
//             <p className="text-gray-500">Coins: {loggedinUser?.coins}</p>
//           </div>
//         </div>
//       </div>

//       {/* Settings Icon at Bottom */}
//       <div className="relative">
//         <button
//           onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//           className="w-full p-2 text-gray-600 hover:text-gray-800 focus:outline-none flex items-center justify-center"
//         >
//           <Settings size={20} />
//         </button>
//         {isSettingsOpen && (
//           <div className="absolute bottom-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
//             <button
//               onClick={logoutFunction}
//               className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
//             >
//               <LogOut size={16} className="mr-2" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Stats;




import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Settings, LogOut } from 'lucide-react';

const Stats = () => {
  const { loggedinUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const logoutFunction = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/users/logout');
      navigate("/");
      toast.success(res.data.message);
      dispatch(setLoggedinUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white border-r border-gray-300 shadow-lg">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={loggedinUser?.avatar}
          alt="Profile Pic"
          className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md"
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">{loggedinUser?.fullName}</h2>
          <p className="text-gray-500 text-sm">@{loggedinUser?.userName}</p>
        </div>
        <div className="w-full flex flex-col space-y-2 px-6 py-4 bg-gray-100 rounded-lg shadow-inner">
          <p className="text-gray-600 font-medium">📧 Email: <span className="font-normal text-gray-700">{loggedinUser?.email}</span></p>
          <p className="text-gray-600 font-medium">🎮 Level: <span className="font-normal text-gray-700">{loggedinUser?.levels}</span></p>
          <p className="text-gray-600 font-medium">💰 Coins: <span className="font-normal text-gray-700">{loggedinUser?.coins}</span></p>
        </div>
      </div>

      {/* Settings Button */}

      <div className="relative mt-6">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-800 focus:outline-none relative"
        >
          <div className="flex items-center justify-center space-x-2 w-full py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </button>
        {isSettingsOpen && (
          <div className="absolute bottom-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <button
              onClick={logoutFunction}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>


    </div>
  );
};

export default Stats;
