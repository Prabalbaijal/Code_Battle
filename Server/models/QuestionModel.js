// models/Question.js
import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
});

const executionTimeSchema=new mongoose.Schema({
  language_id: {
    type:Number,
    required:true
  },
  timeLimit:{
    type:Number,
    required:true
  }
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  constraints: [String],
  testCases: [testCaseSchema], // Array of test cases
  executionTimes:[executionTimeSchema]
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
