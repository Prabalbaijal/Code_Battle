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
      {
        "input": "16\n" +
            "2\n1 2\n3\n" +                            // Test Case 1
            "4\n-3 4 3 90\n0\n" +                      // Test Case 2
            "4\n1000000000 -1000000000 3 4\n0\n" +     // Test Case 3
            "4\n3 3 4 4\n6\n" +                        // Test Case 4
            "4\n2 7 11 2\n4\n" +                       // Test Case 5
            "10000\n" + Array.from({ length: 10000 }, (_, i) => i + 1).join(" ") + "\n19999\n" + // Test Case 6
            "4\n0 4 3 0\n0\n" +                        // Test Case 7
            "4\n-5 -10 15 20\n-15\n" +                 // Test Case 8
            "5\n-10 15 7 -3 8\n5\n" +                  // Test Case 9
            "4\n100000000 100000001 100000002 999999999\n200000001\n" + // Test Case 10
            "4\n-1000000000 -100000000 100000000 1000000000\n0\n" +     // Test Case 11
            "4\n1000000000 999999999 999999998 100000000\n1999999997\n" + // Test Case 12
            "4\n-999999999 1000000000 -100000000 999999999\n0\n" +      // Test Case 13
            "4\n-100000000 -99999999 -1000000000 -999999998\n-200000000\n" + // Test Case 14
            "4\n1000000000 1000000000 -1000000000 -999999999\n0\n" +    // Test Case 15
            "3\n1000000000 -1000000000 1000000000\n-1\n",               // Test Case 16
    
        "expectedOutput": 
            "0 1\n" +   // Test Case 1: Sum 1 + 2 = 3
            "0 2\n" +   // Test Case 2: Sum -3 + 3 = 0
            "0 1\n" +   // Test Case 3: Sum 10^9 + (-10^9) = 0
            "0 1\n" +   // Test Case 4: Sum 3 + 3 = 6 (or 2 3 is also valid)
            "0 3\n" +   // Test Case 5: Sum 2 + 2 = 4
            "9998 9999\n" + // Test Case 6: Sum 9999 + 10000 = 19999
            "0 3\n" +   // Test Case 7: Sum 0 + 0 = 0
            "0 1\n" +   // Test Case 8: Sum -5 + (-10) = -15
            "0 1\n" +   // Test Case 9: Sum 15 + (-10) = 5
            "0 1\n" +   // Test Case 10: Sum 100000000 + 100000001 = 200000001
            "0 3\n" +   // Test Case 11: Sum -100000000 + 100000000 = 0
            "1 2\n" +   // Test Case 12: Sum 1000000000 + 999999998 = 1999999997
            "0 3\n" +   // Test Case 13: Sum -999999999 + 1000000000 = 0
            "-1 -1\n" + // Test Case 14: No valid pair exists
            "0 2\n" +   // Test Case 15: Sum 1000000000 + (-1000000000) = 0
            "-1 -1"     // Test Case 16: No pair sums to -1
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
