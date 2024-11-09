import clsx from "clsx";
import config from "config/config";
import { twMerge } from "tailwind-merge";

export const displayStatusColor = (status) => {
    let color;
    switch (status) {
        case "active":
            color = "#1C56F2";
            break;
        case "pending":
            color = "#FF8A00";
            break;
        case "completed":
            color = "#16C6A4";
            break;
        case "rejected":
            color = "#F90000";
            break;
        default:
            color = "#6C42F5";
            break;
    }
    return (
        <span className={`material-icons text-[8px]`} style={{ color }}>
            fiber_manual_record
        </span>
    );
};

export const truncateWord = (str, length) =>
    str?.length > length ? str?.substring(0, length) + "..." : str;

export const getTransactionFee = (amount = 0, currency = "USD") => {
    switch (currency) {
        case "NGN":
            const ngnCap = config.NGN_TRANSACTION_FEE_CAP;
            const ngnFee = config.NGN_TRANSACTION_PERCENTAGE_RATE * Number(amount);
            return { value: ngnFee > ngnCap ? ngnCap : ngnFee.toFixed(2), currency };
        default:
            return { value: 0, currency };
    }
};

export const generateUrlQuery = (params) => {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
        }
    }

    return queryParams.toString();
};

export const cn = (...input) => twMerge(clsx(input));
