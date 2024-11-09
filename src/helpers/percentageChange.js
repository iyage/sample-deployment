import { isFinite } from "lodash";

export const percentageChange = (previousValue, currentValue) => {
    if (previousValue === 0) {
        return 0;
    }
    const increase = currentValue - previousValue;
    const percentage = (increase / previousValue) * 100;
    return isFinite(percentage) ? Number(percentage.toFixed(0)) : 0;
};
