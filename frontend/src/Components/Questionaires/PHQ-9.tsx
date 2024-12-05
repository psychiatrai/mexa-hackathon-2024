import React, { useState } from "react";

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const difficultyOptions = [
  { label: "Not difficult at all", value: "Not difficult at all" },
  { label: "Somewhat difficult", value: "Somewhat difficult" },
  { label: "Very difficult", value: "Very difficult" },
  { label: "Extremely difficult", value: "Extremely difficult" },
];

const PHQ9Form: React.FC = () => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [difficulty, setDifficulty] = useState<string>("");

  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with answers:", answers);
    console.log("Difficulty:", difficulty);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-100 p-8 rounded-lg shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-black">
          PHQ-9 Questionnaire
        </h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-8 p-4 border-b border-gray-200">
            <p className="text-lg font-semibold mb-4 text-black">
              {index + 1}. {question}
            </p>
            <div className="flex justify-center gap-4 rounded-xl">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange(index, option.value)}
                  className={`w-32 px-3 py-2 text-center rounded-md text-sm font-medium transition-all duration-200 ${
                    answers[index] === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="mb-8 p-4 border-b border-gray-200">
          <p className="text-lg font-semibold mb-4 text-black">
            If you checked off any problems, how difficult have these problems
            made it for you to do your work, take care of things at home, or get
            along with other people?
          </p>
          <div className="flex justify-center gap-4">
            {difficultyOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDifficultyChange(option.value)}
                className={`w-48 px-3 py-2 text-center rounded-md text-sm font-medium transition-all duration-200 ${
                  difficulty === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PHQ9Form;
