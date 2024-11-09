import { getFromStorage } from "helpers";
import { useEffect } from "react";
import { useState } from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authService } from "services";

export const PublicRoutes = ({ children }) => {
    const [user, setUser] = useState(() => getFromStorage("tradeAlly-user"));
    // const { ffProfile } = useSelector((state) => state.auth);
    // const { updateBusinessProfile } = useSelector((state) => state.app);

    // const hasOnboarded =
    //     Boolean(ffProfile?.result?.profile?.businessName) &&
    //     Boolean(ffProfile?.result?.profile?.businessNumber) &&
    //     Boolean(ffProfile?.result?.profile?.businessType) &&
    //     ffProfile?.result?.profile?.mode?.length > 0;

    const handleStorageChange = () => {
        setUser(getFromStorage("tradeAlly-user"));
    };

    useEffect(() => {
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    if (user?.active && authService.loggedIn()) {
        return <Navigate to={"/dashboard"} replace />;
    }
    return children;
};
