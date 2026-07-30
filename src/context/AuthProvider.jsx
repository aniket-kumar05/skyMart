import { useState, useEffect } from "react"
import { AuthStore } from "./AuthContext"

export const AuthProvider = ({ children }) => {

    const [registerUser, setRegisterUser] = useState(
        JSON.parse(localStorage.getItem("registeredUser")) || []
    );

    const [loggedIn, setLoggedIn] = useState(
        JSON.parse(localStorage.getItem("loggedInUser") || null)
    );

    /* ── Logout helper: clears both React state AND localStorage ── */
    const logout = () => {
        setLoggedIn(null);
        localStorage.removeItem("loggedInUser");
    };

    useEffect(() => {
        const syncFromStorage = () => {
            const stored = localStorage.getItem("loggedInUser");
            setLoggedIn(stored ? JSON.parse(stored) : null);
        };

        window.addEventListener("storage", syncFromStorage);

        document.addEventListener("visibilitychange", syncFromStorage);

        return () => {
            window.removeEventListener("storage", syncFromStorage);
            document.removeEventListener("visibilitychange", syncFromStorage);
        };
    }, []);

    return (
        <AuthStore.Provider value={{ registerUser, setRegisterUser, setLoggedIn, loggedIn, logout }}>
            {children}
        </AuthStore.Provider>
    );
}