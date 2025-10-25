import { createContext, useState } from "react";

export const ClientContext = createContext(null)

export const ClientProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [dept, setDept] = useState([])
    const [tasks, setTasks] = useState([])

    const value = {
        users, setUsers, dept, setDept, tasks, setTasks
    }

    return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
}

