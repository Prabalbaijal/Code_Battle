import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedinUser } from '../../redux/userSlice';

export default function AddQuestion() {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    difficulty: '',
    constraints: '',
    examples: '',
    testCasesInput: '',
    testCasesExpectedOutput: '',
    longTestCase: '',
    longTestCaseExpectedOutput: '',
    longTestCaseTimeLimit: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const AddQuestionHandler = async (e) => {
    e.preventDefault();

    const testCases = [
      {
        input: formData.testCasesInput.trim(),
        expectedOutput: formData.testCasesExpectedOutput.trim(),
      },
      {
        input: formData.longTestCase.trim(),
        expectedOutput: formData.longTestCaseExpectedOutput.trim(),
      }
    ];

    const executionTimes = [
      { language_id: 52, timeLimit: parseFloat(formData.longTestCaseTimeLimit) },
      { language_id: 62, timeLimit: parseFloat(formData.longTestCaseTimeLimit) },
      { language_id: 71, timeLimit: parseFloat(formData.longTestCaseTimeLimit) },
      { language_id: 63, timeLimit: parseFloat(formData.longTestCaseTimeLimit) },
    ];

    const payload = {
      title: formData.title,
      description: formData.description,
      inputFormat: formData.inputFormat,
      outputFormat: formData.outputFormat,
      difficulty: formData.difficulty,
      constraints: formData.constraints.split("\n"),
      examples: JSON.parse(formData.examples || "[]"),
      testCases,
      executionTimes,
    };

    try {
      console.log("Payload to send:", payload);
      const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
      await axios.post( `${BACKEND_URL}/api/questions/add-question`, payload,{
        withCredentials:true
      });
      toast.success("Question added successfully!");
    } catch (err) {
      console.error("Error submitting question:", err);
      toast.error("Failed to add question. Check console for details.");
    }
  };
   const logoutFunction = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${BACKEND_URL}/api/auth/logout`,{withCredentials:true});
      dispatch(setLoggedinUser(null));
      navigate('/');
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
     
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-gray-100">
     
      <div className="relative z-10 w-full max-w-3xl px-6 py-10 border border-gray-800 shadow-xl bg-gray-900/80 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">Add New Question</h2>
        <button onClick={logoutFunction} className="w-full py-2 mt-4 mb-5 space-y-4 font-semibold text-white rounded bg-gradient-to-r from-blue-600 to-purple-600">Logout</button>
        
        <form onSubmit={AddQuestionHandler} className="space-y-4">
          <input type="text" name="title" placeholder="Title" className="w-full p-2 bg-gray-800 rounded" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" className="w-full p-2 bg-gray-800 rounded" rows={4} onChange={handleChange} required />
          <textarea name="inputFormat" placeholder="Input Format" className="w-full p-2 bg-gray-800 rounded" rows={2} onChange={handleChange} required />
          <textarea name="outputFormat" placeholder="Output Format" className="w-full p-2 bg-gray-800 rounded" rows={2} onChange={handleChange} required />
          <input type="text" name="difficulty" placeholder="Difficulty (Easy/Medium/Hard)" className="w-full p-2 bg-gray-800 rounded" onChange={handleChange} required />
          <textarea name="constraints" placeholder="Constraints (one per line)" className="w-full p-2 bg-gray-800 rounded" rows={3} onChange={handleChange} />

          <textarea name="examples" placeholder='Examples (JSON format: [{"input":"...", "output":"...", "explanation":""}])' className="w-full p-2 bg-gray-800 rounded" rows={4} onChange={handleChange} />

          <h3 className="mt-6 text-xl font-semibold">Test Cases (Normal Inputs)</h3>
          <textarea name="testCasesInput" placeholder="Enter all test case inputs (multiline, raw)" className="w-full p-2 bg-gray-800 rounded" rows={6} onChange={handleChange} />
          <textarea name="testCasesExpectedOutput" placeholder="Enter all expected outputs (multiline, raw)" className="w-full p-2 bg-gray-800 rounded" rows={6} onChange={handleChange} />

          <h3 className="mt-6 text-xl font-semibold">Single Long Test Case (Max constraints)</h3>
          <textarea name="longTestCase" placeholder="Long test case input (multiline allowed)" className="w-full p-2 bg-gray-800 rounded" rows={5} onChange={handleChange} />
          <textarea name="longTestCaseExpectedOutput" placeholder="Expected Output for long test case" className="w-full p-2 bg-gray-800 rounded" rows={3} onChange={handleChange} />

          <div className="text-sm text-gray-400">
            <strong>Time Limit Guidelines:</strong> <br />
            Length up to 1e5: 0.5s &nbsp; | &nbsp; Length up to 1e4: 0.4s
          </div>
          <input type="number" step="0.1" name="longTestCaseTimeLimit" placeholder="Time Limit in seconds" className="w-full p-2 bg-gray-800 rounded" onChange={handleChange} required />

          <button type="submit" className="w-full py-2 mt-4 font-semibold text-white rounded bg-gradient-to-r from-blue-600 to-purple-600">Add Question</button>
        </form>
      </div>
    </div>
    </>
  );
}
