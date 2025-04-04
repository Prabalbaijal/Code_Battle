


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const PerformanceGraph = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [months, setMonths] = useState([]);
//   const [totalContests, setTotalContests] = useState(0);

//   useEffect(() => {
//     const fetchPerformanceData = async () => {
//       try {
//         const response = await axios.get("http://localhost:9000/api/users/updateprofile", {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         });

//         const result = response.data;
//         let currentCoins = result.coins; // Starts with 50
//         const contestMonths = new Set();
        
//         const formattedData = [];

//         // Ensure the graph always starts at 50 coins, even before matches
//         if (result.matchHistory.length > 0) {
//           const firstMatchDate = result.matchHistory[0].date.split("T")[0]; // First match date
//           formattedData.push({
//             date: firstMatchDate, // Date
//             coins: 50, // Initial coins
//             month: firstMatchDate.slice(0, 7), // Extract month (YYYY-MM)
//           });
//         }

//         result.matchHistory.forEach((match) => {
//           currentCoins += match.score;
//           const matchMonth = match.date.split("T")[0].slice(0, 7); // Extract month (YYYY-MM)
//           contestMonths.add(matchMonth);

//           formattedData.push({
//             date: match.date.split("T")[0], // Date formatted
//             coins: currentCoins, // Updated coin value
//             month: matchMonth, // Month in YYYY-MM format
//             result: match.result,
//             opponent: match.opponent?.username || "Unknown",
//           });
//         });

//         setData(formattedData);
//         setMonths([...contestMonths]);
//         setSelectedMonth(""); // Show all data by default
//         setTotalContests(result.matchHistory.length);
//       } catch (error) {
//         console.error("Error fetching performance data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPerformanceData();
//   }, []);

//   // Create an array for all months (January to December)
//   const allMonths = [
//     "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
//   ];

//   // Filter data by selected month (in YYYY-MM format) or show all data by default
//   const filteredData = selectedMonth
//     ? data.filter((entry) => entry.month === selectedMonth)
//     : data;

//   // Function to format month names from 'YYYY-MM' to 'Month Name'
//   const formatMonth = (month) => {
//     const date = new Date(`${month}-01`); // Use any date from the month
//     return date.toLocaleString("en-US", { month: "long" }); // Get full month name
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow sm:p-6 md:p-8">
//       <div className="flex items-center justify-between mb-4 sm:mb-6">
//         <div className="text-lg font-semibold">Total Contests: {totalContests}</div>
//         <select
//           className="w-full p-2 ml-2 border rounded-md sm:w-40" // Added w-full for small screens and sm:w-40 for larger ones
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//         >
//           <option value="">Months</option>
//           {allMonths.map((month) => (
//             <option key={month} value={`2025-${month}`}>
//               {formatMonth(`2025-${month}`)} {/* Format 'YYYY-MM' to full month name */}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="w-full h-60 sm:h-80 md:h-96">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : filteredData.length > 0 ? (
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={filteredData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="coins" stroke="#4F46E5" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <p className="text-center text-gray-500">No data available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PerformanceGraph;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PerformanceGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);
  const [totalContests, setTotalContests] = useState(0);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${BACKEND_URL}/api/users/updateprofile`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const result = response.data;
        let currentCoins = result.coins;
        const contestMonths = new Set();
        const formattedData = [];

        if (result.matchHistory.length > 0) {
          const firstMatchDate = result.matchHistory[0].date.split("T")[0];
          formattedData.push({
            date: firstMatchDate,
            coins: 50,
            month: firstMatchDate.slice(0, 7),
          });
        }

        result.matchHistory.forEach((match) => {
          currentCoins += match.score;
          const matchMonth = match.date.split("T")[0].slice(0, 7);
          contestMonths.add(matchMonth);

          formattedData.push({
            date: match.date.split("T")[0],
            coins: currentCoins,
            month: matchMonth,
            result: match.result,
            opponent: match.opponent?.username || "Unknown",
          });
        });

        setData(formattedData);
        setMonths([...contestMonths]);
        setSelectedMonth("");
        setTotalContests(result.matchHistory.length);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const allMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const filteredData = selectedMonth ? data.filter((entry) => entry.month === selectedMonth) : data;

  const formatMonth = (month) => {
    const date = new Date(`${month}-01`);
    return date.toLocaleString("en-US", { month: "long" });
  };

  return (
    <div className="p-6 text-white bg-gray-900 border border-gray-700 rounded-lg shadow-lg sm:p-8 md:p-10">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="text-lg font-semibold text-cyan-400">Total Contests: {totalContests}</div>
        <select
          className="w-full p-2 ml-2 text-white transition-all duration-300 bg-gray-800 border rounded-md border-cyan-400 sm:w-40 hover:bg-cyan-600"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Months</option>
          {allMonths.map((month) => (
            <option key={month} value={`2025-${month}`}>
              {formatMonth(`2025-${month}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-60 sm:h-80 md:h-96">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#ffffff" tick={{ fill: "#ffffff" }} />
              <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "5px" }} />
              <Line type="monotone" dataKey="coins" stroke="#00ffff" strokeWidth={3} dot={{ fill: "#00ffff" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400">No data available</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceGraph;