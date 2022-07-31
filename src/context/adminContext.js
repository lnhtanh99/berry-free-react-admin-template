import { createContext, useState } from "react";

export const AdminContext = createContext();

function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);

    return (
        <AdminContext.Provider 
            value={{ 
                isAdmin,
                isUser,
                setIsAdmin,
                setIsUser
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export default AdminProvider
