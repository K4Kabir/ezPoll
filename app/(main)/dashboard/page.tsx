"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CreatePollModal from "@/components/common/CreatePollModal";
import { User } from "@/lib/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isPollActive } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = function () {
    const { isLoaded, user } = useUser();
    const { setUserId, userId } = useContext(User);
    const checkOrCreateUser = useMutation(api.user.CheckUser);
    const polls = useQuery(api.polls.getPolls, userId ? { userId } : "skip");
    const deletePollMutation = useMutation(api.polls.deletePolls);
    const router = useRouter()

    useEffect(() => {
        if (!isLoaded || !user) return;

        const handleCheckUser = async () => {
            try {
                const res = await checkOrCreateUser({
                    id: user.id,
                    userName: user.firstName!,
                });
                setUserId(res?.userId);
            } catch (error) {
                console.error("Error checking/creating user:", error);
            }
        };

        handleCheckUser();
    }, [isLoaded, user]);


    const DeletePost = function (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: Id<"polls">) {
        e.stopPropagation()
        deletePollMutation({ id })
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">My Polls</h1>
                <CreatePollModal />
            </div>

            {!polls ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="rounded-xl shadow-md p-6 animate-pulse">
                            <Skeleton className="w-2/3 h-6 mb-2 rounded" />
                            <Skeleton className="w-full h-4 mb-2 rounded" />
                            <Skeleton className="w-full h-16 rounded" />
                        </Card>
                    ))}
                </div>
            ) : polls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">🤷</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No polls yet!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first poll and see what people think.</p>
                    <CreatePollModal />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {polls.map((post) => {
                        const active = isPollActive(post._creationTime, post.validTill);
                        return (
                            <Card
                                key={post._id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all"
                                tabIndex={0}
                                aria-label={`Poll: ${post.title}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 dark:text-gray-50">{post.title}</CardTitle>
                                            <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.description}</CardDescription>
                                        </div>
                                        <span
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ml-2 ${active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                }`}
                                        >
                                            <span>{active ? "✅" : "❌"}</span>
                                            {active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-4 border-t pt-2 flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
                                    <p>Created On: {new Date(post._creationTime).toLocaleDateString()}</p>
                                    <div className="flex gap-2">
                                        <Button onClick={() => { router.push(`/dashboard/${post._id}`) }} variant={"outline"}>View</Button>
                                        <Button onClick={(e) => DeletePost(e, post._id)} className="cursor-pointer"><Trash2 /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Page;
