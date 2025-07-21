'use client'

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CreatePollModal from "@/components/common/CreatePollModal";
import { User } from "@/lib/contexts/UserContext";

const Page = function () {
    const { isLoaded, user } = useUser()
    const { setUserId } = useContext(User)
    const checkOrCreateUser = useMutation(api.user.CheckUser);
    const handleCheckUser = async () => {
        if (!user || !user.id || !user.firstName) return;
        try {
            const res = await checkOrCreateUser({
                id: user?.id,
                userName: user?.firstName
            });
            console.log(res)
            setUserId(res?.userId)
        } catch (error) {
            console.error("Error checking or creating user:", error);
        }
    };


    useEffect(() => {
        if (!isLoaded || !user) return
        handleCheckUser()
    }, [isLoaded, user])



    return (
        <div className="p-6">
            <CreatePollModal />
        </div>
    )
}

export default Page
