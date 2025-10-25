import { createContext, useState } from "react";

export const ProfileContext = createContext(null)

export const ProfileProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [userLoading, setUserLoading] = useState(false)
    const [supervisors, setSupervisors] = useState([])

    const value = {
        user, setUser, userLoading, setUserLoading, supervisors, setSupervisors
    }

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

