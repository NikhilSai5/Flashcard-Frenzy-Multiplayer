"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function JoinGame() {
  const [gameId, setGameId] = useState("");
  const router = useRouter();

  const joinGame = async () => {
    const user = supabase.auth.user();

    // Check if game exists
    const { data: game, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (error) return alert(error.message);
    if (game.status !== "waiting") return alert("Game already started");

    // Add player
    await supabase.from("players").insert({
      game_id: gameId,
      user_id: user.id,
      score: 0,
    });

    router.push(`/game/${gameId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <input
        type="text"
        placeholder="Enter Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        className="px-3 py-2 border rounded w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={joinGame}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Join Game
      </button>
    </div>
  );
}
