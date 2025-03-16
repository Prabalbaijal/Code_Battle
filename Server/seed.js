import mongoose from 'mongoose';
import Question from './models/QuestionModel.js'; // Adjust the path as needed
import connectDB from './config/database.js';

// Connect to your MongoDB database
connectDB()
.then(async () => {
  console.log('Connected to MongoDB');

  // Define the Two Sum question data
  const questionData = {
    title: "Hanuman Eating Bananas",
    description: "Hanuman loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.Hanuman can decide his bananas-per-hour eating speed of k. Each hour, he chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, he eats all of them instead and will not eat any more bananas during this hour.Hanuman likes to eat slowly but still wants to finish eating all the bananas before the guards return.Find the minimum integer k such that he can eat all the bananas within h hours.\n",
   inputFormat:"The first line contains a single integer t (1 ≤ t ≤ 10), the number of test cases.For each test case,The first line contains two integers n and h — the number of piles and the number of hours before the guards return.The second line contains n integers piles[i] — the number of bananas in each pile.",
   outputFormat:"Print a single integer — the minimum eating speed k (bananas per hour) required for Hanuman to eat all bananas.",
    difficulty: "Medium",
    examples: [
      {
        input: "piles = [3,6,7,11], h = 8",
        output: "4",
        explanation: ""
      },
      {
        input: "piles = [30,11,23,4,20], h = 5",
        output: "30",
        explanation: ""
      },
      {
        input:"piles = [30,11,23,4,20], h = 6",
        output:"23",
        explanation:""
      }
    ],
    // Add any additional fields if needed
    constraints: ["1 <= piles.length <= 10⁵", "piles.length <= h <= 10⁹", "1 <= piles[i] <= 10⁹"],
  
    testCases: [
      {
        "input": 
          "8\n" +
          "4 8\n3 6 7 11\n" +      // Regular case
          "5 5\n30 11 23 4 20\n" + // Case where speed needs to be max pile size
          "5 6\n30 11 23 4 20\n" + // Slightly relaxed case
          "6 10\n1 1 1 1 1 1\n" +  // Very slow eating scenario
          "6 6\n1000000000 999999999 999999998 999999997 999999996 999999995\n" + // Large pile values
          "10 15\n1 2 3 4 5 6 7 8 9 10\n" + // Increasing sequence
          "3 4\n10 5 8\n" +        // Case with uneven piles
          "7 10\n10 20 30 40 50 60 70\n", // Another large spread case
          
        "expectedOutput": 
          "4\n" +    // (3,6,7,11), h=8 -> k=4
          "30\n" +   // (30,11,23,4,20), h=5 -> k=30
          "23\n" +   // (30,11,23,4,20), h=6 -> k=23
          "1\n" +    // (1,1,1,1,1,1), h=10 -> k=1
          "1000000000\n" + // Large piles case
          "5\n" +    // (1,2,3,4,5,6,7,8,9,10), h=15 -> k=2
          "8\n" +    // (10,5,8), h=4 -> k=5
          "40"     // (10,20,30,40,50,60,70), h=10 -> k=14
      },
      {
        "input": 
          "1\n" +
          "100000 200000\n" +
          Array.from({ length: 100000 }, () => "1000000000").join(" ") + "\n",
        
        "expectedOutput": "500000000"
      }
    ]
    
    
  ,    
    executionTimes:[
      {
        "language_id":52, //cpp
        "timeLimit":0.5
      },
      {
        "language_id":62, //Java
        "timeLimit":0.5
      },
      {
        "language_id":71, //python
        "timeLimit":0.5
      },
      {
        "language_id":63, //js
        "timeLimit":0.5
      }
    ]
  
  };
  
  
  // Insert the question into the database
  await Question.create(questionData);
  console.log('Two Sum question added to the database');

  // Disconnect after inserting
  mongoose.disconnect();
})
.catch((error) => console.error('Error:', error));
