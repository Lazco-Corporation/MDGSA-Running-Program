"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import type { ProfileResponse } from "@/app/api/user/profile/types";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setIsLoading(false);
  }, [status]);

  const fetchUserProfile = useCallback(async () => {
    if (!session?.user?.email) {
      return;
    }

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || `Error: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Failed to load profile",
      );
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserProfile();
    }
  }, [session, fetchUserProfile]);

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
      <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
        <div className="p-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-md">
          <h1 className="text-xl font-bold mb-4">
            Welcome {session.user?.name}
          </h1>

          {isLoadingProfile && (
            <div className="animate-pulse p-3 bg-gray-100 rounded mb-4">
              <p className="text-gray-500">Loading profile data...</p>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              <p>Error: {profileError}</p>
              <button
                type="button"
                onClick={fetchUserProfile}
                className="mt-2 text-sm underline"
              >
                Try again
              </button>
            </div>
          )}

          {profileData && !isLoadingProfile && (
            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded">
                {profileData.userData && (
                  <div className="space-y-2">
                    {Object.entries(profileData.userData).map(
                      ([key, value]) => (
                        <p key={key}>
                          <span className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>{" "}
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-150 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="text-center">
          <h1 className="text-xl font-medium text-black mb-4">
            Welcome to Mingdao Running Program
          </h1>
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-150 ease-in-out"
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
}
