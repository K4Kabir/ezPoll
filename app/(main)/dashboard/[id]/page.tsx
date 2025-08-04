"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { isPollActive } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avatar from 'react-avatar'
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useParams } from "next/navigation";


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

export default function Page() {
    const { id } = useParams()
    const [input, setInput] = useState<string | null>(null)
    const poll: poll = useQuery(api.polls.getPollById, { id: id as any });
    const commentsForThisPoll = useQuery(api.comments.getComments, { id: id as any })
    const addComments = useMutation(api.comments.addComments)
    const totalVotes = poll?.options.reduce((sum, option) => sum + option?.totalVotes, 0)
    const { user, isSignedIn } = useUser();
    const [selectedOption, setSelectedOption] = React.useState<string>("");
    const voteOnPoll = useMutation(api.polls.voteOnPoll);
    const [hasVoted, setHasVoted] = React.useState(false);
    const isLoading = poll === undefined;
    const router = useRouter();
    const lastCommentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lastCommentRef.current) {
            lastCommentRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [commentsForThisPoll]);


    const handleSubmit = async () => {
        if (!input) return
        console.log({
            username: poll.createdBy,
            content: input,
            poll: id as string
        })
        try {
            await addComments({
                username: user?.fullName ?? "Anonymous",
                content: input,
                poll: id as string
            })
            setInput("")
        } catch (error) {
            toast("Something went wrong!!")
        }
    }


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
            <main className="max-w-7xl mx-auto p-6">
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
                                <Skeleton className="h-6 w-1/á" />
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
            <main className="max-w-7xl mx-auto p-6">
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
        <main className="max-w-7xl mx-auto p-6">
            <Button variant={"outline"} onClick={() => router.back()}>Go Back</Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{poll.title}</CardTitle>
                        <CardDescription>{poll.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant={"outline"} onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            toast.success("Link copied to clipboard")
                        }}>
                            <Share2 className="mr-2" />
                            Share
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Vote</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup onValueChange={setSelectedOption} className="py-5 flex flex-col gap-5">
                            {
                                poll?.options?.map((option: options, index: number) => {
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <RadioGroupItem value={option?.title} id={index + option.title} />
                                            <Label className="text-md" htmlFor={index + option?.title}>{option?.title}</Label>
                                            <Progress value={totalVotes ? (option.totalVotes / totalVotes) * 100 : 0} />
                                            {option?.totalVotes}
                                        </div>

                                    )
                                })
                            }
                        </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button onClick={handleVote} disabled={!selectedOption || !isPollActive(poll?._creationTime, poll?.validTill) || hasVoted}>Submit Vote</Button>
                        <h1>{isPollActive(poll?._creationTime, poll?.validTill) ? "Active ✅" : "Inactive ❌"}</h1>
                    </CardFooter>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Avatar name={user?.fullName ?? ""} round size="30" />
                        <Input value={input ?? ""} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit()
                            }
                        }} disabled={!isSignedIn} placeholder="Add a comment..." />
                        <Button onClick={handleSubmit} disabled={!isSignedIn}>Comment</Button>
                    </div>
                    {!isSignedIn && (
                        <p className="text-red-500 text-sm mt-1">Please sign in to add your comments</p>
                    )}
                    <div className="mt-6 space-y-4 overflow-auto h-[20vh]">
                        {
                            commentsForThisPoll?.length === 0 ? <h1 className="flex justify-center items-center">No Comments Yet on this poll</h1> : commentsForThisPoll?.map((comments, index) => {
                                const isLastComment = index === commentsForThisPoll.length - 1;
                                return (
                                    <div key={comments?._creationTime} ref={isLastComment ? lastCommentRef : null} className="flex items-start gap-4">
                                        <Avatar name={comments?.username} round size="30" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-md">{comments?.username}</p>
                                            <p className="text-sm">{comments?.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
