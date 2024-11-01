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
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
  
    testCases : [
      { input: "2\n1 2\n3", expectedOutput: "0 1" },
      { input: "4\n-3 4 3 90\n0", expectedOutput: "0 2" },
      { input: "4\n1000000000 -1000000000 3 4\n0", expectedOutput: "0 1" },
      { input: "4\n3 3 4 4\n6", expectedOutput: "0 1" }, // or {2, 3}
      { input: "4\n2 7 11 2\n4", expectedOutput: "0 3" },
      { input: "10000\n" + Array.from({ length: 10000 }, (_, i) => i + 1).join(" ") + "\n19999", expectedOutput: "9998 9999" },
      { input: "4\n0 4 3 0\n0", expectedOutput: "0 3" },
      { input: "4\n-5 -10 15 20\n-15", expectedOutput: "0 1" },
      { input: "5\n-10 15 7 -3 8\n5", expectedOutput: "1 3" },
      { input: "4\n100000000 100000001 100000002 999999999\n200000001", expectedOutput: "0 1" },
      { input: "4\n-1000000000 -100000000 -100000000 1000000000\n0", expectedOutput: "1 3" },
      { input: "4\n1000000000 999999999 999999998 100000000\n1999999997", expectedOutput: "0 2" },
      { input: "4\n-999999999 +1000000000 -100000000 +999999999\n0", expectedOutput: "0 1" },
      { input: "4\n-100000000 -99999999 -1000000000 -999999998\n-200000000", expectedOutput: "0 1" },
      { input: "4\n1000000000 1000000000 -1000000000 -999999999\n0", expectedOutput: "0 2" },
      { input: "3\n1000000000 -1000000000 1000000000\n-1", expectedOutput: "0 1" },
  ]
  
  };
  
  
  // Insert the question into the database
  await Question.create(questionData);
  console.log('Two Sum question added to the database');

  // Disconnect after inserting
  mongoose.disconnect();
})
.catch((error) => console.error('Error:', error));
