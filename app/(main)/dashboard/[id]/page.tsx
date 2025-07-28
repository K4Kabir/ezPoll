"use client";

<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
>>>>>>> 24629380938fddfd4049c68820cc7f40393d6d6c
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
import { useUser } from "@clerk/nextjs";
=======
>>>>>>> 24629380938fddfd4049c68820cc7f40393d6d6c

interface PageProps {
    params: {
        id: string;
    };
}

<<<<<<< HEAD
interface options {
    title: string
    totalVotes: number
}

interface poll {
    createdBy: string
    description: string
    options: options[]
    title: string
    validTill: string
    _creationTime: string
    _id: string
}


=======

>>>>>>> 24629380938fddfd4049c68820cc7f40393d6d6c
const isPollActive = (validTill: string) => {
    const now = new Date();
    return new Date(validTill) > now;
};

export default function Page({ params }: PageProps) {
    const { id } = React.use(params);
<<<<<<< HEAD
    const poll: poll = useQuery(api.polls.getPollById, { id });
    const totalVotes = poll?.options.reduce((sum, option) => sum + option?.totalVotes, 0)
    const { isLoaded, user, isSignedIn } = useUser();


    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }


=======
    const poll = useQuery(api.polls.getPollById, { id });
    console.log(poll)

>>>>>>> 24629380938fddfd4049c68820cc7f40393d6d6c

    return (
        <main className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{poll?.title}</h1>
<<<<<<< HEAD
                    </div>                    <h1>{poll?.description}</h1>
                    <RadioGroup className="py-5 flex flex-col gap-5">
                        {
                            poll?.options?.map((option: options, index: number) => {
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <RadioGroupItem value={option?.title} id={index + option.title} />
                                        <Label className="text-xl" htmlFor={index + option?.title}>{option?.title}</Label>
                                        <Progress max={totalVotes} value={option?.totalVotes} />
                                        {option?.totalVotes}
=======
                    </div>
                    <h1>{poll?.description}</h1>
                    <RadioGroup className="py-5 flex flex-col gap-5">
                        {
                            poll?.options?.map((option, index) => {
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <RadioGroupItem value={option?.title} id={index} />
                                        <Label className="text-xl" htmlFor={index}>{option?.title}</Label>
>>>>>>> 24629380938fddfd4049c68820cc7f40393d6d6c
                                    </div>

                                )
                            })
                        }
                    </RadioGroup>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <Button>Submit Vote</Button>
                    <h1>{isPollActive(poll?.validTill) ? "Active ✅" : "Inactive ❌"}</h1>
                </CardFooter>
            </Card>
        </main>
    );
}
