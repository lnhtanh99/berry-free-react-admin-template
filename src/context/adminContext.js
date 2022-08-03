import { createContext, useState } from "react";

export const AdminContext = createContext();

function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(true);
    const [isUser, setIsUser] = useState(false);
    const [isMod, setIsMod] = useState(false);

    return (
        <AdminContext.Provider 
            value={{ 
                isAdmin,
                isUser,
                isMod,
                setIsAdmin,
                setIsUser,
                setIsMod
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export default AdminProvider
