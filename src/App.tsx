import { useState, useEffect } from "react";
import "./App.css";
import QuestionComponent from "./components/QuestionComponent";

export interface TriviaQuestion {
  category: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export type QuestionType = "multiple" | "boolean";
export type QuestionDifficulty = "easy" | "medium" | "hard";

interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

function App() {
  const [score, setScore] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [qindex, setqindex] = useState(0);

  const handleStartQuiz = () => {
    setShowQuestion(true);
  };

  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5");

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data: TriviaResponse = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  function checkanswer(answer: string) {
    if (answer === questions[qindex].correct_answer) {
      setScore(score + 1);
    }
    handleNext();
  }

  function handleNext() {
    if (questions.length <= qindex + 1) {
      setqindex(0);
      setScore(0);
    } else {
      setqindex(qindex + 1);
    }
  }

  return (
    <>
      {console.log(questions)}
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 items-center justify-center ">
        {showQuestion ? (
          <QuestionComponent
            score={score}
            qnum={qindex + 1}
            totalq={questions.length}
            data={questions[qindex]}
            handlenext={checkanswer}
          />
        ) : (
          <div className="flex items-center justify-center">
            <div className="grid place-items-center max-w-lg w-full h-full bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
                Welcome to REact Front End Quiz
              </h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center"
                onClick={handleStartQuiz}
              >
                Click to Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
