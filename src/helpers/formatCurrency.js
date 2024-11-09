function formatCurrency(amount = 0, withDecimal) {
    let tempAmount = "";

    if (withDecimal) {
        tempAmount = `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const [integerPart, decimalPart] = tempAmount.split(".");
        if (decimalPart?.length > 2) {
            tempAmount = integerPart + "." + decimalPart.slice(0, 2);
        }

        return tempAmount;
    }
    return amount?.replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export default formatCurrency;
