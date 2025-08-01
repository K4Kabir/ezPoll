"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <span className="text-blue-600">
            ezPoll
          </span>
        </h1>

        <p className="mt-3 text-2xl">
          Create and share polls with your friends
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
        <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
          <h3 className="text-2xl font-bold">Create Polls &rarr;</h3>
          <p className="mt-4 text-xl">
            Create polls with multiple options and share them with your friends.
          </p>
        </div>

        <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
          <h3 className="text-2xl font-bold">Vote on Polls &rarr;</h3>
          <p className="mt-4 text-xl">
            Vote on polls and see the results in real-time.
          </p>
        </div>

        <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
          <h3 className="text-2xl font-bold">Share Polls &rarr;</h3>
          <p className="mt-4 text-xl">
            Share polls with your friends and see what they think.
          </p>
        </div>
      </div>
      <div className="flex gap-4 mt-10">
        <SignedOut>
          <SignUpButton>
            <Button>Get Started</Button>
          </SignUpButton>
          <SignInButton>
            <Button variant={"outline"}>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </SignedIn>
      </div>
    </main>
  );
}
