import React, { useState, useEffect } from "react";

function ProgressBar({ current = 20, max = 100 }) {
  // 1. Calculate percentage and clamp it between 0 and 100
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  // 2. Format as a string for the style attribute
  const progress = `${percentage}%`;
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Label showing the values */}
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span className="text-1xl font-bold mb-4 text-center text-gray-800">
          Progress
        </span>
        <span className="text-1xl font-bold mb-4 text-center text-gray-800">
          {Math.round(percentage)}% ({current}/{max})
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-white border border-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
        {/* Progress Fill */}
        <div
          className="bg-red-500 h-5 rounded-full transition-all duration-300 ease-out"
          style={{ width: progress }}
        ></div>
      </div>
    </div>
  );
}

interface Question {
  type: "boolean" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuestionProps {
  data: Question;
}

function decodeHTML(html: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}
function QuestionComponent({
  score,
  totalq,
  handlenext,
  data,
  qnum,
}: QuestionProps) {
  const [progress, setprogress] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 1. Capture the item clicked by the user
  const handleSelectOption = (choice: string) => {
    setSelectedAnswer(choice);
  };

  useEffect(() => {
    setSelectedAnswer(null);
  }, [data]);

  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-lg w-full h-full bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div>
            <ProgressBar current={3} max={5} />
          </div>
          <div>
            <h1 className="mb-4 text-gray-800 text-2xl font-bold">
              Score {score}/ {totalq}
            </h1>
            <h1 className="mb-4 text-gray-800 text-2xl font-bold">Q#{qnum}</h1>
          </div>
          <div className="text-3xl font-bold mb-4 text-center text-gray-800">
            <p>{decodeHTML(data.question)}</p>
          </div>
          <div className=" grid grid-cols-2 gap-4 max-w-md mx-auto text-2xl font-bold mb-4 text-center text-gray-800">
            {[...data.incorrect_answers, data.correct_answer].map(
              (answer, index) => (
                <label key={index} className="m-1">
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswer === answer}
                    onChange={(e) => handleSelectOption(e.target.value)}
                    value={answer}
                    className="mr-2"
                  />
                  {answer}
                </label>
              ),
            )}
          </div>
          <div className="flex align-center justify-center">
            <button
              onClick={() => handlenext(selectedAnswer)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionComponent;
