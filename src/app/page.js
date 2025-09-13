"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      } else {
        router.push("/login");
      }
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          router.push("/login");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (!user) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const handleCreate = () => {
    router.push("/create");
  };

  const handleJoin = () => {
    router.push("/join");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {user.email}
      </h1>
      <div className="space-x-4">
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Create Game
        </button>
        <button
          onClick={handleJoin}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
        >
          Join Game
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
      >
        Logout
      </button>
    </div>
  );
}
