"use client";

import { useState } from "react";
import Flashcard from "./Flashcard";
import { QUESTIONS } from "../utils/constants";
import Announcements from "./Announcements";

export default function Game() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const handleAnswer = (answer) => {
    const correct = answer === QUESTIONS[currentIndex].correctAnswer;
    if (correct) {
      setAnnouncement("Correct answer!");
    } else {
      setAnnouncement("Wrong answer.");
    }
    setTimeout(() => setAnnouncement(""), 1000);
    setCurrentIndex((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Flashcard Frenzy</h1>
      <Flashcard
        question={QUESTIONS[currentIndex].question}
        onAnswer={handleAnswer}
      />
      <Announcements message={announcement} />
    </div>
  );
}
