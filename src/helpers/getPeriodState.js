export function getPeriodState(data) {
    switch (data) {
        case "one-year":
            return "year";
        case "six-months":
            return "6 months";
        case "one-month":
            return "month";
        case "seven-days":
            return "week";
        default:
            return "year";
    }
}
