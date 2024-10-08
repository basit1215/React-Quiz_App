import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("https://the-trivia-api.com/v2/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to fetch questions. Please check your internet connection or try again later.");
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (!selectedAnswer) {
      alert("Please select an option");
      return;
    }

    if (selectedAnswer === questions[currentQuestionIndex]?.correctAnswer) {
      setScore(score + 1);
    }
    
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const startQuiz = () => setQuizStarted(true);

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setQuizEnded(false);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex px-4 md:px-[100px] lg:px-[200px] xl:px-[350px] pt-[100px] lg:pt-[200px] items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-600">
        <div className="bg-white opacity-90 p-6 sm:p-8 md:p-12 rounded-xl shadow-xl text-center max-w-xl md:max-w-2xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-brown-800">
             Quiz App
          </h1> 
          <button
            onClick={startQuiz}
            className="bg-orange-700 text-white p-3 sm:p-4 rounded-lg text-lg sm:text-2xl font-semibold shadow-md hover:bg-orange-800 transition duration-300"  >
            Get Started
          </button>
        </div>
     </div>
    );
  }

  if (quizEnded) {
    const passedMessage = score > questions.length / 2 ? "You Passed!" : "Try Again!";

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-orange-400 to-yellow-600">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-xl text-center max-w-lg md:max-w-xl w-full opacity-90">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
            Quiz Finished!
          </h2>
          <p className="text-xl sm:text-2xl mb-2 sm:mb-4 text-gray-700">
            Your score: {score} / {questions.length}
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
            {passedMessage}
          </h3>
          <button
            onClick={resetQuiz}
            className="bg-orange-700 text-white p-3 sm:p-4 rounded-lg text-lg font-semibold shadow-md hover:bg-orange-800 transition duration-300"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const { question, correctAnswer, incorrectAnswers = [] } = questions[currentQuestionIndex] || {};
  const answers = [correctAnswer, ...incorrectAnswers].map((answer) => ({
    text: answer,
    value: answer
  }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-orange-400 to-yellow-600">
      <div className="bg-white opacity-90 p-6 sm:p-8 md:p-12 rounded-xl shadow-xl max-w-lg md:max-w-3xl w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-brown-800">
          Question {currentQuestionIndex + 1} / {questions.length}
        </h2>
        <h3 className="text-md sm:text-lg md:text-xl mb-4 sm:mb-6 text-black">
          {question?.text}
        </h3>

        <div>
          {answers.map((answer, index) => (
            <label key={index} className="block text-black mb-2 sm:mb-4">
              <input
                type="radio"
                name="answer"
                value={answer.value}
                checked={selectedAnswer === answer.value}
                onChange={() => handleAnswer(answer.value)}
                className="mr-2"
              />
              {answer.text}
            </label>
          ))}
        </div>

        <button
          onClick={nextQuestion}
          className="mt-4 sm:mt-6 bg-orange-700 text-white p-3 sm:p-4 rounded-lg w-full text-lg font-semibold shadow-md hover:bg-orange-800 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;