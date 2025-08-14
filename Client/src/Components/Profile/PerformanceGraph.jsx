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
        let currentCoins = 400;
        const contestMonths = new Set();
        const formattedData = [];
        const sortedHistory=[...result.matchHistory].reverse()

        sortedHistory.forEach((match) => {
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

setData([
  { date: sortedHistory[0]?.date.split("T")[0], coins: 400, month: sortedHistory[0]?.date.slice(0, 7) }, // Starting point
  ...formattedData
]);
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