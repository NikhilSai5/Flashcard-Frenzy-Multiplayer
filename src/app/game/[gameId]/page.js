"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useRouter, useParams } from "next/navigation";

const questions = [
  {
    q: "What is 2+2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    q: "Capital of France?",
    options: ["London", "Berlin", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    q: "Largest planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Jupiter",
  },
];

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [user, setUser] = useState(null);
  const [playerId, setPlayerId] = useState(null); // Store players.id

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return router.push("/login");
      setUser(data.user);

      // Insert into players if not exists
      const { data: existingPlayer, error: fetchError } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId)
        .eq("user_id", data.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.log("Player fetch error:", fetchError);
        return;
      }

      if (existingPlayer) {
        setPlayerId(existingPlayer.id);
      } else {
        // Insert new player
        const { data: newPlayer, error: insertError } = await supabase
          .from("players")
          .insert({ game_id: gameId, user_id: data.user.id, score: 0 })
          .select()
          .single();

        if (insertError) {
          console.log("Insert player error:", insertError);
          return;
        }

        setPlayerId(newPlayer.id);
      }
    };

    fetchUser();
  }, [gameId, router]);

  // Real-time leaderboard subscription
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel("realtime-answers")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "answers",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const { player_id } = payload.new;
          setScores((prev) => ({
            ...prev,
            [player_id]: (prev[player_id] || 0) + 1,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  // Submit answer
  // Submit answer
  const submitAnswer = async (selectedOption) => {
    if (!user || !playerId) return;

    const isCorrect =
      selectedOption.trim().toLowerCase() ===
      questions[currentQuestion].answer.toLowerCase();

    // Save only correct answers
    if (isCorrect) {
      const { data, error } = await supabase.from("answers").insert({
        game_id: gameId,
        player_id: playerId, // ✅ Correctly referencing players.id
        question_no: currentQuestion + 1,
        answer: selectedOption,
      });

      if (error) {
        console.log("Insert Answer Error:", error);
        alert("Failed to record answer. Check console.");
      } else {
        console.log("Answer recorded:", data);
      }
    }

    // Move to next question regardless of correctness
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push(`/leaderboard/${gameId}`);
    }
  };

  if (!user || !playerId) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6 text-black">
      <h1 className="text-xl font-bold">{questions[currentQuestion].q}</h1>
      <div className="flex flex-col space-y-2">
        {questions[currentQuestion].options.map((option) => (
          <button
            key={option}
            onClick={() => submitAnswer(option)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 w-60 bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Leaderboard</h2>
        {Object.entries(scores).length === 0 && <p>No scores yet.</p>}
        {Object.entries(scores).map(([player, score]) => (
          <p key={player}>
            {player}: {score} pts
          </p>
        ))}
      </div>
    </div>
  );
}
