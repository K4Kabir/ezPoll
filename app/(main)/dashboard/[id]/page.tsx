"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Label } from "@/components/ui/label";

interface PageProps {
    params: {
        id: string;
    };
}


const isPollActive = (validTill: string) => {
    const now = new Date();
    return new Date(validTill) > now;
};

export default function Page({ params }: PageProps) {
    const { id } = React.use(params);
    const poll = useQuery(api.polls.getPollById, { id });
    console.log(poll)


    return (
        <main className="max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{poll?.title}</h1>
                    </div>
                    <h1>{poll?.description}</h1>
                    <RadioGroup className="py-5 flex flex-col gap-5">
                        {
                            poll?.options?.map((option, index) => {
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <RadioGroupItem value={option?.title} id={index} />
                                        <Label className="text-xl" htmlFor={index}>{option?.title}</Label>
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
