"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter, useParams } from "next/navigation";

const questions = [
  { q: "What is 2+2?", answer: "4" },
  { q: "Capital of France?", answer: "Paris" },
  { q: "Largest planet?", answer: "Jupiter" },
  // Add 7 more questions
];

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState({});

  const user = supabase.auth.user();

  useEffect(() => {
    const subscription = supabase
      .from(`answers:game_id=eq.${gameId}`)
      .on("INSERT", (payload) => {
        const { player_id, question_no } = payload.new;

        // Update leaderboard
        setScores((prev) => ({
          ...prev,
          [player_id]: (prev[player_id] || 0) + 1,
        }));
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [gameId]);

  const submitAnswer = async () => {
    // Check correct
    if (
      answer.trim().toLowerCase() ===
      questions[currentQuestion].answer.toLowerCase()
    ) {
      // Save to Supabase
      await supabase.from("answers").insert({
        game_id: gameId,
        player_id: user.id,
        question_no: currentQuestion + 1,
        answer: answer.trim(),
      });

      setAnswer("");
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        alert("Game Over! Check leaderboard.");
        router.push(`/leaderboard/${gameId}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-xl font-bold">{questions[currentQuestion].q}</h1>
      <input
        type="text"
        placeholder="Your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="px-3 py-2 border rounded w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={submitAnswer}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>

      <div className="mt-6 w-60 bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Leaderboard</h2>
        {Object.entries(scores).map(([player, score]) => (
          <p key={player}>
            {player}: {score} pts
          </p>
        ))}
      </div>
    </div>
  );
}
