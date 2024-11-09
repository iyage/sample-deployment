export const formatMoney = () => {
    const formatter = new Intl.NumberFormat("en-US", {});
    return formatter;
};

export const formatMoneyDisplay = (value) => {
    const formatter = new Intl.NumberFormat("en-US", {});

    return formatter.format(value);
};
