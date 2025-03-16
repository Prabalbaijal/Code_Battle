import mongoose from 'mongoose';
import Question from './models/QuestionModel.js'; // Adjust the path as needed
import connectDB from './config/database.js';

// Connect to your MongoDB database
connectDB()
.then(async () => {
  console.log('Connected to MongoDB');

  // Define the Two Sum question data
  const questionData = {
    title: "Two Sum",
    description: "Given an array of integers, return the indices of the two numbers such that they add up to a specific target.You may assume that each input would have exactly one solution, and you may not use the same element twice."
,
    difficulty: "Easy",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "Because nums[1] + nums[2] = 2 + 4 = 6, we return [1, 2]."
      }
    ],
    // Add any additional fields if needed
    constraints: ["2 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
  
    testCases: [
      {
        "input": "8\n" +
          "4\n2 7 11 15\n9\n"+   // Regular case
          "3\n3 5 4\n8\n"+       // Different numbers
          "4\n-3 8 1 90\n5\n"+   // Case with a negative number
          "5\n1 9 3 7 6\n13\n"+  // Larger list with different values
          "2\n1 10\n20\n"+       // No valid pair
          "6\n-10 -5 0 5 10 15\n0\n"+ // Numbers across negative and positive range
          "5\n2 4 6 8 10\n12\n"+ // Last pair (4+8=12)
          "5\n1 3 5 7 9\n4\n",   // First pair (1+3=4)
      
        "expectedOutput": 
          "0 1\n" +  // 2+7=9 (Regular case)
          "1 2\n"+   // 5+3=8
          "0 2\n"+   // -3+8=5
          "2 4\n"+   // 3+10=13
          "-1 -1\n"+ // No valid pair
          "1 3\n"+   // -5+5=0
          "1 3\n"+   // 4+8=12 (Last pair)
          "0 1\n"    // 1+3=4 (First pair)
      },
      {
        "input": "1\n"+
        "100000\n"+Array.from({ length: 100000 }, (_, i) => i + 1).join(" ") + "\n" + (2 * 100000 - 1) + "\n",
        "expectedOutput": 
        "99998 99999\n"
      }
    ]    
  ,    
    executionTimes:[
      {
        "language_id":52, //cpp
        "timeLimit":0.03
      },
      {
        "language_id":62, //Java
        "timeLimit":0.4
      },
      {
        "language_id":71, //python
        "timeLimit":0.04
      },
      {
        "language_id":63, //js
        "timeLimit":0.04
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