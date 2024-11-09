import { useEffect, useState } from "react";
import { authService } from "services";
import { getFromStorage } from "helpers";
import { useDispatch } from "react-redux";
import { authActions } from "actions";

export const PrivateRoutes = ({ children }) => {
    const [user, setUser] = useState(() => getFromStorage("tradeAlly-user"));
    // const { ffProfile } = useSelector((state) => state.auth);
    // const { updateBusinessProfile } = useSelector((state) => state.app);
    const dispatch = useDispatch();

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

    if (!user?.active || !authService.loggedIn()) {
        if (!authService.loggedIn() && Boolean(user)) {
            dispatch(authActions.logOut());
        }
        window.open("/login", "_self");
        return;
    }
    return children;
};
