export const getCurrencyFromCurrencyCode = (currencyCode) => {
    const currency = currencyCode?.toLowerCase();

    switch (currency) {
        case "usd":
            return "$";

        case "ngn":
            return "₦";

        case "eur":
            return "€";

        case "gbp":
            return "£";

        case "cny":
            return "¥";

        default:
            return "$";
    }
};
