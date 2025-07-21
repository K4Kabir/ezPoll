'use client'

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

type UserContextType = {
    userId: string | null
    setUserId: Dispatch<SetStateAction<string | null>>
}

export const User = createContext<UserContextType>({
    userId: null,
    setUserId: () => { },
})
const UserContext = function ({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null)

    return <User.Provider value={{ userId, setUserId }}>{children}</User.Provider>
}

export default UserContext
