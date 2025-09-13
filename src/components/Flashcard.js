"use client";

export default function Flashcard({ question, onAnswer }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
      <h2 className="text-xl font-semibold text-gray-700">{question}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {["A", "B", "C", "D"].map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
