// models/Question.js
import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  // executionTime: { type: Number, default: null },
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  constraints: [String],
  testCases: [testCaseSchema], // Array of test cases

});

const Question = mongoose.model('Question', questionSchema);
export default Question;
