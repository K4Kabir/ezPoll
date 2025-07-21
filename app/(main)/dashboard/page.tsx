'use client'

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CreatePollModal from "@/components/common/CreatePollModal";
import { User } from "@/lib/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Page = function () {
    const { isLoaded, user } = useUser()
    const { setUserId, userId } = useContext(User)
    const checkOrCreateUser = useMutation(api.user.CheckUser);
    const getPolls = useMutation(api.polls.getPolls);
    const [polls, setPolls] = useState([]);

    const handleCheckUser = async () => {
        if (!user || !user.id || !user.firstName) return;
        try {
            const res = await checkOrCreateUser({
                id: user?.id,
                userName: user?.firstName
            });
            setUserId(res?.userId)
        } catch (error) {
            console.error("Error checking or creating user:", error);
        }
    };

    const getMyPolls = async () => {
        if (!userId) return
        try {
            console.log(userId)
            const res = await getPolls({
                userId
            });
            setPolls(res)
        } catch (error) {
            console.error("Error checking or creating user:", error);
        }
    }


    useEffect(() => {
        if (!isLoaded || !user) return
        handleCheckUser()
        getMyPolls()
    }, [isLoaded, user, userId])


    return (
        <div className="p-6 space-y-6">
            <CreatePollModal />

            <h2 className="text-2xl font-semibold tracking-tight">📋 Polls</h2>

            {/* Show loading state if posts is undefined */}
            {!polls ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="p-4 space-y-3">
                            <Skeleton className="w-full h-6" />
                            <Skeleton className="w-3/4 h-4" />
                            <Skeleton className="w-full h-20" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {polls.map((post: any) => (
                        <Card key={post._id} className="hover:shadow-md transition duration-200">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <CardTitle>{post.title}</CardTitle>
                                        <CardDescription>{post.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-600 pt-2">
                                {post.content?.slice(0, 100)}...
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};


export default Page
