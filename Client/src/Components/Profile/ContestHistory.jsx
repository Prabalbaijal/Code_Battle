import React from 'react';
import "./ContestHistory.css"; // Importing the CSS file

const ContestHistory = ({ contests }) => {
  return (
    <div className="contest-history">
      <h2 className="contest-history-title">Recent Contest History</h2>
      <table className="contest-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Opponent</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest, index) => {
            const formattedDate = new Date(contest.date).toLocaleDateString("en-GB");
            let resultClass = '';
            let resultText = '';
            
            if (contest.result === 'win') {
              resultClass = 'win';
              resultText = `+50`;
            } else if (contest.result === 'lose') {
              resultClass = 'lose';
              resultText = `-50`;
            } else if (contest.result === 'draw') {
              resultClass = 'draw';
              resultText = 'Draw';
            }

            return (
              <tr key={index} className="contest-row">
                <td>{formattedDate}</td>
                <td>{contest.opponent || "Unknown"}</td>
                <td className={resultClass}>{resultText}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ContestHistory;
