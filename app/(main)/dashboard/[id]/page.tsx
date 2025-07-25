"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PageProps {
    params: {
        id: string;
    };
}

// Fake poll data
const fakePoll = {
    _id: "123",
    title: "Favorite Programming Language?",
    description: "Vote for the language you love the most.",
    creatorId: "user_abc",
    creatorName: "Alice",
    _creationTime: new Date().toISOString(),
    validTill: new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString(), // 1 day later
    options: ["JavaScript", "Python", "TypeScript", "Go", "Rust"],
    votes: {
        JavaScript: 10,
        Python: 5,
        TypeScript: 7,
        Go: 3,
        Rust: 2,
    },
};

const isPollActive = (createdAt: string, validTill: string) => {
    const now = new Date();
    return new Date(validTill) > now;
};

export default function Page({ params }: PageProps) {
    // Use fakePoll instead of fetching
    const poll = fakePoll;
    const user = { id: "user_xyz" }; // fake current user (not the creator)

    const isCreator = user.id === poll.creatorId;
    const active = isPollActive(poll._creationTime, poll.validTill);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [voteCounts, setVoteCounts] = useState<Record<string, number>>(poll.votes);

    const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

    // Voting is disabled for creator or if poll is inactive
    const votingDisabled = !active || isCreator;

    // Fake voting handler with local update and delay to simulate network request
    const handleVote = () => {
        if (!selectedOption) return;

        setIsVoting(true);

        setTimeout(() => {
            setVoteCounts((prev) => ({
                ...prev,
                [selectedOption]: (prev[selectedOption] || 0) + 1,
            }));
            setIsVoting(false);
            alert("Vote submitted!");
        }, 1500);
    };

    return (
        <main className="max-w-3xl mx-auto p-6">
            <Card className="rounded-xl shadow">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">{poll.title}</CardTitle>
                    <CardDescription>{poll.description}</CardDescription>
                    <p className="mt-2 text-sm text-gray-500">
                        Created by {poll.creatorName || "Unknown"} on{" "}
                        {new Date(poll._creationTime).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                        Status:{" "}
                        <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            {active ? "Active" : "Inactive"}
                        </span>
                    </p>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedOption || ""}
                        onValueChange={(v) => setSelectedOption(v)}
                        disabled={votingDisabled || isVoting}
                        className="space-y-4"
                    >
                        {poll.options.map((option) => {
                            const votes = voteCounts[option] ?? 0;
                            const percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

                            return (
                                <div key={option} className="space-y-1">
                                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                                        <RadioGroupItem
                                            value={option}
                                            id={`option-${option}`}
                                            className="ring-offset-background focus:ring-ring h-5 w-5 rounded-full border border-gray-300 text-indigo-600 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <span className="flex-1 text-white-900">{option}</span>
                                        {(isCreator || !active) && (
                                            <span className="text-sm font-semibold text-indigo-700 tabular-nums">
                                                {votes} vote{votes !== 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </label>
                                    {(isCreator || !active) && (
                                        <Progress value={percent} className="h-2 rounded-md" />
                                    )}
                                </div>
                            );
                        })}
                    </RadioGroup>

                    {!votingDisabled && (
                        <div className="mt-6 flex items-center space-x-4">
                            <Button
                                onClick={handleVote}
                                disabled={!selectedOption || isVoting}
                                className="px-6"
                            >
                                {isVoting ? "Submitting..." : "Vote"}
                            </Button>
                            {isVoting && (
                                <svg
                                    className="w-6 h-6 animate-spin text-indigo-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-label="Loading"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                        </div>
                    )}

                    {isCreator && active && (
                        <p className="mt-6 text-sm text-green-700 font-medium">
                            You are the poll creator. Voting is disabled, but you can see the ongoing votes above.
                        </p>
                    )}

                    {!active && (
                        <p className="mt-6 text-sm text-gray-600 font-medium">This poll has ended.</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
