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
          "input": "1\n" +
            "100000\n"+Array.from({ length: 100000 }, (_, i) => i + 1).join(" ") + "\n" + (2 * 100000 - 1) + "\n",

            "expectedOutput": 
            "99998 99999\n",
            executionTime: {
                cpp: { type: Number, default: null }, // Execution time for C++
                java: { type: Number, default: null }, // Execution time for Java
                python: { type: Number, default: null }, // Execution time for Python
                js: { type: Number, default: null }, // Execution time for JavaScript
              },
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
