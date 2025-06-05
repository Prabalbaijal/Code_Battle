import Question from "../models/QuestionModel.js";
import { User } from "../models/Usermodel.js";
import axios from "axios";

export const getQuestion = async (user1, user2) => {
    try {
        // Fetch attempted questions by both users
        console.log(user1)
        console.log(user2)
        const user1Data = await User.findOne({ username: user1 }).select("questionsAttempted");
        const user2Data = await User.findOne({ username: user2 }).select("questionsAttempted");

        if (!user1Data || !user2Data) {
            throw new Error("One or both users not found");
        }

        const attemptedQuestions = [...user1Data.questionsAttempted, ...user2Data.questionsAttempted];
        console.log(attemptedQuestions)
        // Fetch a random question that has not been attempted
        const question = await Question.findOne({
            _id:{$nin : attemptedQuestions}
        });
        console.log(question.title)
        return  question;
    } catch (error) {
        console.error("Error fetching problem:", error);
        return null;
    }
};

export const submitQuestion = async (req, res) => {
    const { source_code, language_id, testCases, executionTimes } = req.body;
    const maxRetries = 5; // Number of retry attempts
    const retryDelay = 2000; // Delay between retries in ms

    try {
        const results = [];
        const timeLimit = executionTimes.find(et => et.language_id === language_id)?.timeLimit || 1; // Default to 1 sec if not specified

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const submissionResponse = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions',
                {
                    source_code,
                    language_id,
                    stdin: testCase.input
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
                    }
                }
            );

            const token = submissionResponse.data.token;
            let attempt = 0;
            let resultResponse;

            // Retry loop to check for final result
            while (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                
                resultResponse = await axios.get(
                    `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
                        }
                    }
                );

                const status = resultResponse.data.status.description;
                
                if (status !== 'Processing') {
                    break; // Exit loop if result is not in "Processing"
                }
                
                attempt++;
            }
            const { stdout, stderr, status, compile_output, time } = resultResponse.data;
            const actualOutput = stdout ? stdout.trim() : null;
            console.log(actualOutput)
            console.log(testCase.expectedOutput)
            const executionTime = time ? parseFloat(time) : 0;
            console.log(executionTime)
            results.push({
                expected: testCase.expectedOutput,
                actual: actualOutput,
                isCorrect: actualOutput === testCase.expectedOutput,
                status,
                time: executionTime,
                compile_output,
                error: stderr
            });

            // Check TLE only for the second test case(since it has larger test cases) (index 1)
            if (i === 1 && executionTime > timeLimit) {
                results[i].status = "Time Limit Exceeded";
                results[i].isCorrect = false;
            }
        }

        const allPassed = results.every(result => result.isCorrect);

        res.json({
            allPassed,
            results
        });
    } catch (error) {
        console.error('Error in code submission:', error);
        res.status(500).json({ error: 'Error submitting code for evaluation' });
    }
};
