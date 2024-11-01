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
    description: "Given an array of integers nums and an integer target...",
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
  };

  // Insert the question into the database
  await Question.create(questionData);
  console.log('Two Sum question added to the database');

  // Disconnect after inserting
  mongoose.disconnect();
})
.catch((error) => console.error('Error:', error));
