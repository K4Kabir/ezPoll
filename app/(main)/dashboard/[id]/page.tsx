"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { isPollActive } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
    params: {
        id: string;
    };
}

interface options {
    title: string
    totalVotes: number
}

interface poll {
    createdBy: string
    description: string
    options: options[]
    title: string
    validTill: number
    _creationTime: number
    _id: string
    voted?: string[]
}


const getAnonymousId = () => {
    let anonymousId = localStorage.getItem("anonymousId");
    if (!anonymousId) {
        anonymousId = crypto.randomUUID();
        localStorage.setItem("anonymousId", anonymousId);
    }
    return anonymousId;
};

export default function Page({ params }: PageProps) {
    const { id } = React.use(params) as { id: string };
    const poll: poll = useQuery(api.polls.getPollById, { id: id as any });
    const totalVotes = poll?.options.reduce((sum, option) => sum + option?.totalVotes, 0)
    const { user } = useUser();
    const [selectedOption, setSelectedOption] = React.useState<string>("");
    const voteOnPoll = useMutation(api.polls.voteOnPoll);
    const [hasVoted, setHasVoted] = React.useState(false);
    const isLoading = poll === undefined;


    React.useEffect(() => {
        if (poll) {
            const voterId = user?.id ?? getAnonymousId();
            const voted = poll.voted?.includes(voterId) ?? localStorage.getItem(poll._id) === "voted";
            setHasVoted(voted);
        }
    }, [poll, user]);

    const handleVote = () => {
        if (selectedOption) {
            const voterId = user?.id ?? getAnonymousId();
            voteOnPoll({
                pollId: poll._id as any,
                optionTitle: selectedOption,
                userId: voterId,
            });
            localStorage.setItem(poll._id, "voted");
            setHasVoted(true);
        }
    };


    if (isLoading) {
        return (
            <main className="max-w-3xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-1/4" />
                        <div className="py-5 flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                        <Skeleton className="h-10 w-1/4" />
                        <Skeleton className="h-6 w-1/4" />
                    </CardFooter>
                </Card>
            </main>
        )
    }

    if (!poll) {
        return (
            <main className="max-w-3xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Poll not found</h1>
                        </div>
                    </CardHeader>
                </Card>
            </main>
        )
    }


    return (
        <main className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{poll?.title}</h1>
                    </div>                    <h1>{poll?.description}</h1>
                    <RadioGroup onValueChange={setSelectedOption} className="py-5 flex flex-col gap-5">
                        {
                            poll?.options?.map((option: options, index: number) => {
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <RadioGroupItem value={option?.title} id={index + option.title} />
                                        <Label className="text-xl" htmlFor={index + option?.title}>{option?.title}</Label>
                                        <Progress value={totalVotes ? (option.totalVotes / totalVotes) * 100 : 0} />
                                        {option?.totalVotes}
                                    </div>

                                )
                            })
                        }
                    </RadioGroup>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <Button onClick={handleVote} disabled={!selectedOption || !isPollActive(poll?._creationTime, poll?.validTill) || hasVoted}>Submit Vote</Button>
                    <h1>{isPollActive(poll?._creationTime, poll?.validTill) ? "Active ✅" : "Inactive ❌"}</h1>
                </CardFooter>
            </Card>
        </main>
    );
}
