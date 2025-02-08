
// import React from 'react';

// const ContestHistory = ({ contests }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Recent Contest History</h2>
//       <ul className="space-y-2">
//         {contests.map((contest, index) => {
//           // Check the result of the contest and apply styles based on it
//           const resultClass = contest.result >= 0 ? 'text-green-500' : 'text-red-500';
//           const resultText = contest.result >= 0 ? `+${contest.result}` : contest.result;

//           return (
//             <li key={index} className="flex justify-between p-2 bg-gray-100 rounded">
//               <span>{contest.name}</span>
//               <span>{contest.date}</span>
//               <span>Opponent: {contest.opponent}</span>
//               <span className={resultClass}>Result: {resultText}</span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default ContestHistory;






import React from 'react';

const ContestHistory = ({ contests }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Contest History</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Opponent</th>
            <th className="px-4 py-2 text-left">Result</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest, index) => {
            // Format the date to day/month/year
            const formattedDate = new Date(contest.date).toLocaleDateString("en-GB");
            
            // Define styles based on result
            let resultClass = '';
            let resultText = '';
            
            if (contest.result === 'win') {
              resultClass = 'text-green-500'; // Win: Green
              resultText = `+50`; // You can replace with the actual result value
            } else if (contest.result === 'loss') {
              resultClass = 'text-red-500'; // Loss: Red
              resultText = `-50`; // You can replace with the actual result value
            } else if (contest.result === 'draw') {
              resultClass = 'text-gray-500'; // Draw: Gray
              resultText = 'Draw';
            }

            return (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{formattedDate}</td>
                <td className="px-4 py-2">{contest.opponent?.name || "Unknown"}</td> {/* Display opponent's name */}
                <td className={`px-4 py-2 ${resultClass}`}>{resultText}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ContestHistory;

