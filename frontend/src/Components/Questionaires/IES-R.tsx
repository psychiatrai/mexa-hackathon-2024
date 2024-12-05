import React, { useState } from "react";

const questions = [
  "Any reminder brought back feelings about it",
  "I had trouble staying asleep",
  "Other things kept making me think about it",
  "I felt irritable and angry",
  "I avoided letting myself get upset when I thought about it or was reminded of it",
  "I thought about it when I didn't mean to",
  "I felt as if it hadn't happened or wasn't real",
  "I stayed away from reminders about it",
  "Pictures about it popped into my mind",
  "I was jumpy and easily startled",
  "I tried not to think about it",
  "I was aware that I still had a lot of feelings about it, but I didn't deal with them",
  "My feelings about it were kind of numb",
  "I found myself acting or feeling as though I was back at that time",
  "I had trouble falling asleep",
  "I had waves of strong feelings about it",
  "I tried to remove it from my memory",
  "I had trouble concentrating",
  "Reminders of it caused me to have physical reactions, such as sweating, trouble breathing, nausea, or a pounding heart",
  "I had dreams about it",
  "I felt watchful or on-guard",
  "I tried not to talk about it",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "A little bit", value: 1 },
  { label: "Moderately", value: 2 },
  { label: "Quite a bit", value: 3 },
  { label: "Extremely", value: 4 },
];

const IESRForm: React.FC = () => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with answers:", answers);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100  px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-100 p-8 rounded-lg shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-black">
          IES-R Questionnaire
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
        <div className="flex justify-center mt-8">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default IESRForm;
