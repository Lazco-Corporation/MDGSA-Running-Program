"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [status]);

  const handleLogin = useCallback(() => {
    signIn("credentials");
  }, []);

  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <p>Welcome {session.user?.name}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-150 ease-in-out"
      >
        Login Here
      </button>
    </>
  );
}
