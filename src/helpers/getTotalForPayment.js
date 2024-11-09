import { getTotalPrice } from "./getTotalPrice";

export const getTotalForPayment = (singleQuoteData) => {
    const platformFeePercentNum = 3;
    const allCharges = [
        ...(singleQuoteData?.exportCharges ?? []),
        ...(singleQuoteData?.importCharges ?? []),
        ...(singleQuoteData?.customCharges ?? []),
        ...(singleQuoteData?.exwCharges ?? []),
    ];
    const allNGNCharges = allCharges?.filter((item) => item?.currency?.toLowerCase() === "ngn");
    const allUSDCharges = allCharges?.filter((item) => item?.currency?.toLowerCase() === "usd");
    const allEURCharges = allCharges?.filter((item) => item?.currency?.toLowerCase() === "eur");
    const allGBPCharges = allCharges?.filter((item) => item?.currency?.toLowerCase() === "gbp");
    const allNGNVatCharges =
        getTotalPrice(allNGNCharges?.filter((item) => item?.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const allUSDVatCharges =
        getTotalPrice(allUSDCharges?.filter((item) => item?.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const allEURVatCharges =
        getTotalPrice(allEURCharges?.filter((item) => item?.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const allGBPVatCharges =
        getTotalPrice(allGBPCharges?.filter((item) => item?.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const totalNGNCharges = getTotalPrice(allNGNCharges);
    const totalUSDCharges = getTotalPrice(allUSDCharges);
    const totalEURCharges = getTotalPrice(allEURCharges);
    const totalGBPCharges = getTotalPrice(allGBPCharges);

    const grandTotalNGN =
        Number(totalNGNCharges) +
        allNGNVatCharges +
        Number(totalNGNCharges) * (platformFeePercentNum / 100);
    const grandTotalUSD =
        Number(totalUSDCharges) +
        allUSDVatCharges +
        Number(totalUSDCharges) * (platformFeePercentNum / 100);
    const grandTotalEUR =
        Number(totalEURCharges) +
        allEURVatCharges +
        Number(totalEURCharges) * (platformFeePercentNum / 100);
    const grandTotalGBP =
        Number(totalGBPCharges) +
        allGBPVatCharges +
        Number(totalGBPCharges) * (platformFeePercentNum / 100);

    const allCurrenciesPlatformFees = [
        Number(totalNGNCharges) * (platformFeePercentNum / 100),
        Number(totalUSDCharges) * (platformFeePercentNum / 100),
        Number(totalEURCharges) * (platformFeePercentNum / 100),
        Number(totalGBPCharges) * (platformFeePercentNum / 100),
    ];
    const oneCurrencyPlayformFee = allCurrenciesPlatformFees.find((value) => value > 0);

    const allGrandTotals = [grandTotalNGN, grandTotalUSD, grandTotalEUR, grandTotalGBP];
    const oneGrandTotal = allGrandTotals.find((value) => value > 0);
    const oneGrandTotalIndex = allGrandTotals.findIndex((value) => value > 0);
    let currency;

    switch (oneGrandTotalIndex) {
        case 0:
            currency = "NGN";
            break;

        case 1:
            currency = "USD";
            break;

        case 2:
            currency = "EUR";
            break;

        case 3:
            currency = "GBP";
            break;

        default:
            currency = "USD";
            break;
    }

    return {
        amount: oneGrandTotal?.toFixed(2),
        currency: currency,
        platformFee: oneCurrencyPlayformFee,
    };
};
