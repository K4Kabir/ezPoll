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
        <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-indigo-900 flex items-center gap-2">
                    📋 My Polls
                </h2>
                <CreatePollModal />
            </div>

            {!polls ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="rounded-xl shadow p-6 animate-pulse">
                            <Skeleton className="w-2/3 h-6 mb-2 rounded" />
                            <Skeleton className="w-full h-4 mb-2 rounded" />
                            <Skeleton className="w-full h-16 rounded" />
                        </Card>
                    ))}
                </div>
            ) : polls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    {/* You can swap for a local illustration or SVG */}
                    <svg className="w-32 h-32 mb-4 text-gray-200" fill="none" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="64" fill="currentColor" />
                        <text x="50%" y="55%" textAnchor="middle" fill="#A0AEC0" fontSize="32" dy=".3em">?</text>
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No polls yet!</h3>
                    <p className="text-gray-500 mb-4">Create your first poll for quick engagement.</p>
                    <CreatePollModal />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {polls.map((post) => {
                        const active = isPollActive(post._creationTime, post.validTill);
                        return (
                            <Card
                                onClick={() => { router.push(`/dashboard/${post._id}`) }}
                                key={post._id}
                                className="border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all"
                                tabIndex={0}
                                aria-label={`Poll: ${post.title}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-bold text-indigo-800 line-clamp-2">{post.title}</CardTitle>
                                            <CardDescription className="text-gray-500 mt-1 line-clamp-2">{post.description}</CardDescription>
                                        </div>
                                        <span
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ml-2 ${active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            <span>{active ? "✅" : "❌"}</span>
                                            {active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-4 border-t pt-2 flex justify-between items-center text-xs text-gray-400">
                                    <p>Created On: {new Date(post._creationTime).toLocaleDateString()}</p>
                                    <Button onClick={(e) => DeletePost(e, post._id)} className="cursor-pointer"><Trash2 /></Button>
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
