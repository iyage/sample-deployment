import CustomToast from "components/common/CustomToast";
import config from "config/config";
import toast from "react-hot-toast";
import { authService } from "./authService";

const subscribeToNewsletter = async (data, setEmail, setSubscribing) => {
    setSubscribing(true);
    try {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(data),
        };

        const res = await authService.apiGate(
            `${config.API_URL}/api/v1/website/blog/newsletter`,
            requestOptions
        );
        setEmail("");
        setSubscribing(false);
        toast.custom((t) => <CustomToast t={t} message={"Subscribed"} type="success" />);

        return res;
    } catch (error) {
        console.error("error", error);
        setSubscribing(false);
        toast.custom((t) => <CustomToast t={t} message={"error"} type="erro" />);
    }
};

const contactUs = async (data, resetForm, setLoader) => {
    setLoader(true);
    try {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(data),
        };

        const res = await authService.apiGate(
            `${config.API_URL}/api/v1/website/blog/contact`,
            requestOptions
        );
        resetForm?.();
        setLoader(false);
        toast.custom((t) => <CustomToast t={t} message={"Message sent"} type="success" />);

        return res;
    } catch (error) {
        console.error("error", error);
        setLoader(false);
        toast.custom((t) => <CustomToast t={t} message={"An error occurred"} type="erro" />);
    }
};

const getHotDeals = async (setLoader, setData) => {
    setLoader(true);
    try {
        const requestOptions = {
            method: "GET",
        };

        const res = await authService.apiGate(
            `${config.API_URL}/api/v1/website/deals?limit=4&page=1`,
            requestOptions
        );
        setLoader(false);

        setData?.(res?.data?.deals);
        return res;
    } catch (error) {
        setLoader(false);
    }
};

export const websiteService = {
    subscribeToNewsletter,
    contactUs,
    getHotDeals,
};
