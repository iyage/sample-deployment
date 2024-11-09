import { getCurrencyFromCurrencyCode, getTotalPrice } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import { getTotalForPayment } from "helpers/getTotalForPayment";
import { hasHTMLTag, sanitizeHtml } from "helpers/sanitizeHtml";
import { truncate, upperFirst } from "lodash";
import moment from "moment";
import React from "react";

const Quote = ({
    singleQuoteData,
    portOfLoading,
    destinationPort,
    className,
    isResponsive,
    singleQuoteReq,
    ffProfile,
}) => {
    const weightInKg = singleQuoteData?.shipment?.packages?.filter(
        (item) => item?.weight?.unit?.toLowerCase() === "kg"
    );
    const weightInLb = singleQuoteData?.shipment?.packages?.filter(
        (item) => item?.weight?.unit?.toLowerCase() === "lb"
    );
    const grossWeightInKg = weightInKg?.reduce((acc, curr) => {
        return acc + curr?.weight?.value;
    }, 0);
    const grossWeightInLb = weightInLb?.reduce((acc, curr) => {
        return acc + curr?.weight?.value;
    }, 0);
    const fortyFtContainerType = singleQuoteData?.shipment?.containers?.filter(
        (container) => container?.containerType === "40ft"
    );
    const twentyFtContainerType = singleQuoteData?.shipment?.containers?.filter(
        (container) => container?.containerType === "20ft"
    );
    const quantityOf40Ft = fortyFtContainerType?.reduce((acc, curr) => {
        return acc + curr?.quantity;
    }, 0);
    const quantityOf20Ft = twentyFtContainerType?.reduce((acc, curr) => {
        return acc + curr?.quantity;
    }, 0);

    const ngnExportSubTotalArr = singleQuoteData?.exportCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "ngn"
    );
    const usdExportSubTotalArr = singleQuoteData?.exportCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "usd"
    );
    const eurExportSubTotalArr = singleQuoteData?.exportCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "eur"
    );
    const gbpExportSubTotalArr = singleQuoteData?.exportCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "gbp"
    );
    const ngnExportSubTotal = getTotalPrice(ngnExportSubTotalArr);
    const usdExportSubTotal = getTotalPrice(usdExportSubTotalArr);
    const eurExportSubTotal = getTotalPrice(eurExportSubTotalArr);
    const gbpExportSubTotal = getTotalPrice(gbpExportSubTotalArr);

    const ngnExportVatTotal =
        getTotalPrice(ngnExportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const usdExportVatTotal =
        getTotalPrice(usdExportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const eurExportVatTotal =
        getTotalPrice(eurExportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const gbpExportVatTotal =
        getTotalPrice(gbpExportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);

    const ngnImportSubTotalArr = singleQuoteData?.importCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "ngn"
    );
    const usdImportSubTotalArr = singleQuoteData?.importCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "usd"
    );
    const eurImportSubTotalArr = singleQuoteData?.importCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "eur"
    );
    const gbpImportSubTotalArr = singleQuoteData?.importCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "gbp"
    );
    const ngnImportSubTotal = getTotalPrice(ngnImportSubTotalArr);
    const usdImportSubTotal = getTotalPrice(usdImportSubTotalArr);
    const eurImportSubTotal = getTotalPrice(eurImportSubTotalArr);
    const gbpImportSubTotal = getTotalPrice(gbpImportSubTotalArr);
    const ngnImportVatTotal =
        getTotalPrice(ngnImportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const usdImportVatTotal =
        getTotalPrice(usdImportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const eurImportVatTotal =
        getTotalPrice(eurImportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const gbpImportVatTotal =
        getTotalPrice(gbpImportSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);

    const ngnExwSubTotalArr = singleQuoteData?.exwCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "ngn"
    );
    const usdExwSubTotalArr = singleQuoteData?.exwCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "usd"
    );
    const eurExwSubTotalArr = singleQuoteData?.exwCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "eur"
    );
    const gbpExwSubTotalArr = singleQuoteData?.exwCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "gbp"
    );
    const ngnExwSubTotal = getTotalPrice(ngnExwSubTotalArr);
    const usdExwSubTotal = getTotalPrice(usdExwSubTotalArr);
    const eurExwSubTotal = getTotalPrice(eurExwSubTotalArr);
    const gbpExwSubTotal = getTotalPrice(gbpExwSubTotalArr);
    const ngnExwVatTotal =
        getTotalPrice(ngnExwSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const usdExwVatTotal =
        getTotalPrice(usdExwSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const eurExwVatTotal =
        getTotalPrice(eurExwSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const gbpExwVatTotal =
        getTotalPrice(gbpExwSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);

    const ngnCustomSubTotalArr = singleQuoteData?.customCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "ngn"
    );
    const usdCustomSubTotalArr = singleQuoteData?.customCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "usd"
    );
    const eurCustomSubTotalArr = singleQuoteData?.customCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "eur"
    );
    const gbpCustomSubTotalArr = singleQuoteData?.customCharges?.filter(
        (item) => item?.currency?.toLowerCase() === "gbp"
    );
    const ngnCustomSubTotal = getTotalPrice(ngnCustomSubTotalArr);
    const usdCustomSubTotal = getTotalPrice(usdCustomSubTotalArr);
    const eurCustomSubTotal = getTotalPrice(eurCustomSubTotalArr);
    const gbpCustomSubTotal = getTotalPrice(gbpCustomSubTotalArr);
    const ngnCustomVatTotal =
        getTotalPrice(ngnCustomSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const usdCustomVatTotal =
        getTotalPrice(usdCustomSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const eurCustomVatTotal =
        getTotalPrice(eurCustomSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);
    const gbpCustomVatTotal =
        getTotalPrice(gbpCustomSubTotalArr?.filter((item) => item.vat === true)) *
        (Number(singleQuoteData?.vat ?? 0) / 100);

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
    const paymentFeeDetails = getTotalForPayment(singleQuoteData);

    return (
        <div className={`w-full ${className}`}>
            <div
                className={`px-10 w-full pt-[88px] ${
                    isResponsive &&
                    "max-xl:pt-10 max-sm:px-3 max-sm:pt-3 max-sm:pb-12 max-lg:w-full"
                } pb-8 w-full `}
            >
                <div className="relative bg-white w-full overflow-hidden pb-4 shadow-[0px_33.5596px_40.2716px_-6.71193px_rgba(16,24,40,0.08),0px_13.4239px_13.4239px_-6.71193px_rgba(16,24,40,0.03)]">
                    <div className="">
                        <div className="relative w-full">
                            <div className="absolute z-20 right-[-28px] top-[-18px] rotate-45 w-[70px] h-[50px] bg-mvx-light-blue"></div>
                            <div className="absolute z-10 right-0 w-[50px] h-[50px] bg-mvx-black"></div>
                        </div>
                    </div>
                    <div
                        className={`flex px-[43px] pb-4 bg-[#FAFBFC] items-center justify-between ${
                            isResponsive && "max-sm:px-3 max-sm:mb-6"
                        } pt-[64px] mb-[73px]`}
                    >
                        <div>
                            <img
                                src={singleQuoteData?.creator?.profile?.logo}
                                alt={`${singleQuoteData?.creator?.profile?.businessName} logo`}
                                width={100}
                            />
                        </div>
                        <div>
                            <p className="font-rocGroteskBold text-xl">Quotation</p>
                        </div>
                    </div>
                    <div
                        className={`flex gap-[75px] px-[43px] pb-14 ${
                            isResponsive && "max-sm:flex-col max-sm:px-3"
                        } max-sm:gap-5`}
                    >
                        <div
                            className={`flex flex-col gap-[32px] w-[23%] ${
                                isResponsive && "max-sm:w-full"
                            } justify-between`}
                        >
                            <div className="text-base text-mvx-black ">
                                <p className="font-rocGroteskBold">Bill-From</p>
                                <p className="font-rocGroteskMedium text-mvx-neutral capitalize mb-2">
                                    {ffProfile
                                        ? ffProfile?.result?.profile?.businessName
                                        : singleQuoteData?.creator?.profile?.businessName
                                        ? upperFirst(
                                              singleQuoteData?.creator?.profile?.businessName
                                          )
                                        : ""}
                                </p>
                                <p className="font-rocGroteskMedium text-mvx-neutral text-sm">
                                    {ffProfile
                                        ? ffProfile?.result?.profile?.businessAddress?.address
                                        : singleQuoteData?.creator?.profile?.businessAddress
                                              ?.address
                                        ? singleQuoteData?.creator?.profile?.businessAddress
                                              ?.address
                                        : ""}
                                </p>
                            </div>
                            <div className="text-base text-mvx-black ">
                                <p className="font-rocGroteskBold">Bill-To</p>
                                <p className="font-rocGroteskMedium text-mvx-neutral mb-2">
                                    {singleQuoteReq
                                        ? singleQuoteReq?.sender?.profile?.businessName
                                        : singleQuoteData?.shipment?.shipperDetails?.fullName
                                        ? upperFirst(
                                              singleQuoteData?.shipment?.shipperDetails?.fullName
                                          )
                                        : ""}
                                </p>
                                <p className="font-rocGroteskMedium text-mvx-neutral text-sm">
                                    {singleQuoteReq
                                        ? singleQuoteReq?.sender?.profile?.businessAddress?.address
                                        : singleQuoteData?.shipment?.shipperDetails?.address
                                              ?.address
                                        ? singleQuoteData?.shipment?.shipperDetails?.address
                                              ?.address
                                        : ""}
                                </p>
                            </div>
                        </div>
                        <hr className={`hidden ${isResponsive && "max-sm:block"}`} />
                        <div className={`w-[77%] ${isResponsive && "max-sm:w-full"}`}>
                            <div
                                className={`grid grid-cols-3 ${
                                    isResponsive && "max-sm:grid-cols-1"
                                } w-full gap-[33px]`}
                            >
                                <div className="text-base text-mvx-black ">
                                    <p className="font-rocGroteskBold">Issue date</p>
                                    <p className="font-rocGroteskMedium text-mvx-neutral">
                                        {moment(singleQuoteData?.createdAt).format("MMM DD, YYYY")}
                                    </p>
                                </div>
                                <div className="text-base text-mvx-black ">
                                    <p className="font-rocGroteskBold">Due date</p>
                                    <p className="font-rocGroteskMedium text-mvx-neutral">
                                        {singleQuoteData?.dueDate
                                            ? moment(singleQuoteData?.dueDate).format(
                                                  "MMM DD, YYYY"
                                              )
                                            : "N/A"}
                                    </p>
                                </div>
                                {singleQuoteData?.mvxid && (
                                    <div className="text-base text-mvx-black ">
                                        <p className="font-rocGroteskBold">Quote ID</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {singleQuoteData.mvxid}
                                        </p>
                                    </div>
                                )}

                                <div className="text-base text-mvx-black ">
                                    <p className="font-rocGroteskBold">Origin pickup</p>
                                    <p className="font-rocGroteskMedium text-mvx-neutral">
                                        {singleQuoteData?.shipment?.origin?.address}
                                    </p>
                                </div>
                                {portOfLoading && (
                                    <div className="text-base text-mvx-black ">
                                        <p className="font-rocGroteskBold">Port of Loading</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {portOfLoading?.address}
                                        </p>
                                    </div>
                                )}
                                <div className="text-base text-mvx-black ">
                                    <p className="font-rocGroteskBold">Shipment Type</p>
                                    <p className="font-rocGroteskMedium capitalize text-mvx-neutral">
                                        {singleQuoteData?.shipment?.serviceMode}
                                    </p>
                                </div>
                                <div className="text-base text-mvx-black ">
                                    <p className="font-rocGroteskBold">Destination</p>
                                    <p className="font-rocGroteskMedium text-mvx-neutral">
                                        {singleQuoteData?.shipment?.destination?.address}
                                    </p>
                                </div>
                                {destinationPort && (
                                    <div className="text-base text-mvx-black ">
                                        <p className="font-rocGroteskBold">Destination Port</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {destinationPort?.address}
                                        </p>
                                    </div>
                                )}
                                <div className="text-base text-mvx-black ">
                                    <p className="font-rocGroteskBold">Gross weight</p>
                                    {grossWeightInKg && grossWeightInKg > 0 ? (
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {grossWeightInKg + " KG"}
                                        </p>
                                    ) : null}
                                    {grossWeightInLb && grossWeightInLb > 0 ? (
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {grossWeightInLb + " LB"}
                                        </p>
                                    ) : null}

                                    {quantityOf40Ft > 0 && (
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {quantityOf40Ft + " x 40ft"}
                                        </p>
                                    )}
                                    {quantityOf20Ft > 0 && (
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {quantityOf20Ft + " x 20ft"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {singleQuoteData?.shipment?.goodsDetails?.description && (
                        <div className="text-base text-mvx-black px-[43px] mb-16">
                            <p className="font-rocGroteskBold">Shipment description</p>
                            <p className="font-rocGroteskMedium text-mvx-neutral">
                                {/\s/g.test(singleQuoteData?.shipment?.goodsDetails?.description)
                                    ? singleQuoteData?.shipment?.goodsDetails?.description
                                    : truncate(
                                          singleQuoteData?.shipment?.goodsDetails?.description,
                                          {
                                              length: 110,
                                          }
                                      )}
                            </p>
                        </div>
                    )}
                    {singleQuoteData?.exportCharges &&
                        singleQuoteData?.exportCharges?.length > 0 && (
                            <div>
                                <table className="mb-2.5 text-base w-full">
                                    <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                        <tr>
                                            <th>
                                                <p
                                                    className={`flex py-2 pl-[43px] ${
                                                        isResponsive && "max-sm:pl-3"
                                                    }`}
                                                >
                                                    EXPORT CHARGES
                                                </p>
                                            </th>
                                            <th className="">
                                                <p className="flex py-2 mr-8"></p>
                                            </th>
                                            <th className="">
                                                <p className="flex py-2"></p>
                                            </th>
                                            <th className="">
                                                <p
                                                    className={`${
                                                        isResponsive && "max-sm:pr-3"
                                                    } pr-[43px] flex justify-end py-2`}
                                                >
                                                    AMOUNT
                                                </p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {singleQuoteData?.exportCharges?.map((charge, idx) => {
                                            return (
                                                <tr key={charge?.name + idx}>
                                                    <td
                                                        className={`pl-[43px] ${
                                                            isResponsive && "max-sm:pl-3"
                                                        } py-4 font-rocGroteskMedium`}
                                                    >
                                                        {charge?.name}
                                                    </td>
                                                    <td className="font-rocGroteskMedium mr-8"></td>
                                                    <td className="font-rocGroteskMedium"></td>
                                                    <td
                                                        className={`font-rocGroteskMedium text-right ${
                                                            isResponsive && "max-sm:pr-3"
                                                        } pr-[43px]`}
                                                    >
                                                        {getCurrencyFromCurrencyCode(
                                                            charge?.currency
                                                        )}{" "}
                                                        {formatMoney().format(
                                                            Number(charge?.price)?.toFixed(2)
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div
                                    className={`flex flex-col items-end gap-3 justify-end pr-[43px] ${
                                        isResponsive && "max-sm:pr-3"
                                    } mb-[33px]`}
                                >
                                    {Boolean(ngnExportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(ngnExportVatTotal) ? "mb-0" : "mb-2"
                                                }  gap-8 ${
                                                    isResponsive && "max-sm:pl-0"
                                                } pl-[23px]`}
                                            >
                                                <p>Sub Total (NGN)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                    {formatMoney().format(
                                                        Number(ngnExportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                            {Boolean(ngnExportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                        {formatMoney().format(
                                                            Number(ngnExportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(usdExportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(usdExportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (USD)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("usd")}{" "}
                                                    {formatMoney().format(
                                                        Number(usdExportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                            {Boolean(usdExportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("usd")}{" "}
                                                        {formatMoney().format(
                                                            Number(usdExportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(eurExportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(eurExportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (EUR)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("eur")}{" "}
                                                    {formatMoney().format(
                                                        Number(eurExportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                            {Boolean(eurExportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("eur")}{" "}
                                                        {formatMoney().format(
                                                            Number(eurExportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(gbpExportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(gbpExportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (GBP)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                    {formatMoney().format(
                                                        Number(gbpExportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                            {Boolean(gbpExportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                        {formatMoney().format(
                                                            Number(gbpExportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {singleQuoteData?.importCharges &&
                        singleQuoteData?.importCharges?.length > 0 && (
                            <div>
                                <table className="mb-2.5 text-base w-full">
                                    <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                        <tr>
                                            <th>
                                                <p
                                                    className={`flex py-2 pl-[43px] ${
                                                        isResponsive && "max-sm:pl-3"
                                                    }`}
                                                >
                                                    IMPORT CHARGES
                                                </p>
                                            </th>
                                            <th className="">
                                                <p className="flex py-2 mr-8"></p>
                                            </th>
                                            <th className="">
                                                <p className="flex py-2"></p>
                                            </th>
                                            <th className="">
                                                <p
                                                    className={`${
                                                        isResponsive && "max-sm:pr-3"
                                                    } pr-[43px] flex justify-end py-2`}
                                                >
                                                    AMOUNT
                                                </p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {singleQuoteData?.importCharges?.map((charge, idx) => (
                                            <tr key={charge?.name + idx}>
                                                <td
                                                    className={`pl-[43px] ${
                                                        isResponsive && "max-sm:pl-3"
                                                    } py-4 font-rocGroteskMedium`}
                                                >
                                                    {charge?.name}
                                                </td>
                                                <td className="font-rocGroteskMedium mr-8"></td>
                                                <td className="font-rocGroteskMedium"></td>
                                                <td
                                                    className={`font-rocGroteskMedium text-right pr-[43px] ${
                                                        isResponsive && "max-sm:pr-3"
                                                    }`}
                                                >
                                                    {getCurrencyFromCurrencyCode(charge?.currency)}{" "}
                                                    {formatMoney().format(
                                                        Number(charge?.price)?.toFixed(2)
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div
                                    className={`flex flex-col items-end gap-3 justify-end pr-[43px] ${
                                        isResponsive && "max-sm:pr-3"
                                    } mb-[33px]`}
                                >
                                    {Boolean(ngnImportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(ngnImportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (NGN)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                    {formatMoney().format(
                                                        Number(ngnImportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(ngnImportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                        {formatMoney().format(
                                                            Number(ngnImportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(usdImportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(usdImportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (USD)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("usd")}{" "}
                                                    {formatMoney().format(
                                                        Number(usdImportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(usdImportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("usd")}{" "}
                                                        {formatMoney().format(
                                                            Number(usdImportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(eurImportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(eurImportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (EUR)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("eur")}{" "}
                                                    {formatMoney().format(
                                                        Number(eurImportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(eurImportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("eur")}{" "}
                                                        {formatMoney().format(
                                                            Number(eurImportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(gbpImportSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(gbpImportVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (GBP)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                    {formatMoney().format(
                                                        Number(gbpImportSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(gbpImportVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                        {formatMoney().format(
                                                            Number(gbpImportVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {singleQuoteData?.exwCharges && singleQuoteData?.exwCharges?.length > 0 && (
                        <div>
                            <table className="mb-2.5 text-base w-full">
                                <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                    <tr>
                                        <th>
                                            <p
                                                className={`flex py-2 pl-[43px] ${
                                                    isResponsive && "max-sm:pl-3"
                                                }`}
                                            >
                                                EXW CHARGES
                                            </p>
                                        </th>
                                        <th className="">
                                            <p className="flex py-2 mr-8"></p>
                                        </th>
                                        <th className="">
                                            <p className="flex py-2"></p>
                                        </th>
                                        <th className="">
                                            <p
                                                className={`${
                                                    isResponsive && "max-sm:pr-3"
                                                } pr-[43px] flex justify-end py-2`}
                                            >
                                                AMOUNT
                                            </p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {singleQuoteData?.exwCharges?.map((charge, idx) => (
                                        <tr key={charge?.name + idx}>
                                            <td
                                                className={`pl-[43px] ${
                                                    isResponsive && "max-sm:pl-3"
                                                } py-4 font-rocGroteskMedium`}
                                            >
                                                {charge?.name}
                                            </td>
                                            <td className="font-rocGroteskMedium mr-8"></td>
                                            <td className="font-rocGroteskMedium"></td>
                                            <td
                                                className={`font-rocGroteskMedium text-right pr-[43px] ${
                                                    isResponsive && "max-sm:pr-3"
                                                }`}
                                            >
                                                {getCurrencyFromCurrencyCode(charge?.currency)}{" "}
                                                {formatMoney().format(
                                                    Number(charge?.price)?.toFixed(2)
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div
                                className={`flex flex-col items-end gap-3 justify-end pr-[43px] ${
                                    isResponsive && "max-sm:pr-3"
                                } mb-[33px]`}
                            >
                                {Boolean(ngnExwSubTotal) && (
                                    <div
                                        className={`py-4 border-y text-base ${
                                            isResponsive && "max-sm:w-[97%]"
                                        } font-rocGroteskMedium`}
                                    >
                                        <div
                                            className={`grid grid-cols-2 ${
                                                !Boolean(ngnExwVatTotal) ? "mb-0" : "mb-2"
                                            } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                        >
                                            <p>Sub Total (NGN)</p>
                                            <p className="text-right">
                                                {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                {formatMoney().format(
                                                    Number(ngnExwSubTotal)?.toFixed(2)
                                                )}
                                            </p>
                                        </div>

                                        {Boolean(ngnExwVatTotal) && (
                                            <div
                                                className={`grid grid-cols-2 gap-8 ${
                                                    isResponsive && "max-sm:pl-0"
                                                } pl-[23px]`}
                                            >
                                                <p>VAT ({singleQuoteData?.vat}%)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                    {formatMoney().format(
                                                        Number(ngnExwVatTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {Boolean(usdExwSubTotal) && (
                                    <div
                                        className={`py-4 border-y text-base ${
                                            isResponsive && "max-sm:w-[97%]"
                                        } font-rocGroteskMedium`}
                                    >
                                        <div
                                            className={`grid grid-cols-2 ${
                                                !Boolean(usdExwVatTotal) ? "mb-0" : "mb-2"
                                            } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                        >
                                            <p>Sub Total (USD)</p>
                                            <p className="text-right">
                                                {getCurrencyFromCurrencyCode("usd")}{" "}
                                                {formatMoney().format(
                                                    Number(usdExwSubTotal)?.toFixed(2)
                                                )}
                                            </p>
                                        </div>

                                        {Boolean(usdExwVatTotal) && (
                                            <div
                                                className={`grid grid-cols-2 gap-8 ${
                                                    isResponsive && "max-sm:pl-0"
                                                } pl-[23px]`}
                                            >
                                                <p>VAT ({singleQuoteData?.vat}%)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("usd")}{" "}
                                                    {formatMoney().format(
                                                        Number(usdExwVatTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {Boolean(eurExwSubTotal) && (
                                    <div
                                        className={`py-4 border-y text-base ${
                                            isResponsive && "max-sm:w-[97%]"
                                        } font-rocGroteskMedium`}
                                    >
                                        <div
                                            className={`grid grid-cols-2 ${
                                                !Boolean(eurExwVatTotal) ? "mb-0" : "mb-2"
                                            } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                        >
                                            <p>Sub Total (EUR)</p>
                                            <p className="text-right">
                                                {getCurrencyFromCurrencyCode("eur")}{" "}
                                                {formatMoney().format(
                                                    Number(eurExwSubTotal)?.toFixed(2)
                                                )}
                                            </p>
                                        </div>

                                        {Boolean(eurExwVatTotal) && (
                                            <div
                                                className={`grid grid-cols-2 gap-8 ${
                                                    isResponsive && "max-sm:pl-0"
                                                } pl-[23px]`}
                                            >
                                                <p>VAT ({singleQuoteData?.vat}%)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("eur")}{" "}
                                                    {formatMoney().format(
                                                        Number(eurExwVatTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {Boolean(gbpExwSubTotal) && (
                                    <div
                                        className={`py-4 border-y text-base ${
                                            isResponsive && "max-sm:w-[97%]"
                                        } font-rocGroteskMedium`}
                                    >
                                        <div
                                            className={`grid grid-cols-2 ${
                                                !Boolean(gbpExwVatTotal) ? "mb-0" : "mb-2"
                                            } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                        >
                                            <p>Sub Total (GBP)</p>
                                            <p className="text-right">
                                                {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                {formatMoney().format(
                                                    Number(gbpExwSubTotal)?.toFixed(2)
                                                )}
                                            </p>
                                        </div>

                                        {Boolean(gbpExwVatTotal) && (
                                            <div
                                                className={`grid grid-cols-2 gap-8 ${
                                                    isResponsive && "max-sm:pl-0"
                                                } pl-[23px]`}
                                            >
                                                <p>VAT ({singleQuoteData?.vat}%)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                    {formatMoney().format(
                                                        Number(gbpExwVatTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {singleQuoteData?.customCharges &&
                        singleQuoteData?.customCharges?.length > 0 && (
                            <div>
                                <table className="mb-2.5 text-base w-full">
                                    <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                        <tr>
                                            <th>
                                                <p
                                                    className={`flex py-2 pl-[43px] ${
                                                        isResponsive && "max-sm:pl-3"
                                                    }`}
                                                >
                                                    CUSTOM CHARGES
                                                </p>
                                            </th>
                                            <th className="">
                                                <p className="flex py-2 mr-8"></p>
                                            </th>
                                            <th className="">
                                                <p className="flex py-2"></p>
                                            </th>
                                            <th className="">
                                                <p
                                                    className={`${
                                                        isResponsive && "max-sm:pr-3"
                                                    } pr-[43px] flex justify-end py-2`}
                                                >
                                                    AMOUNT
                                                </p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {singleQuoteData?.customCharges?.map((charge, idx) => (
                                            <tr key={charge?.name + idx}>
                                                <td
                                                    className={`pl-[43px] ${
                                                        isResponsive && "max-sm:pl-3"
                                                    } py-4 font-rocGroteskMedium`}
                                                >
                                                    {charge?.name}
                                                </td>
                                                <td className="font-rocGroteskMedium mr-8"></td>
                                                <td className="font-rocGroteskMedium"></td>
                                                <td
                                                    className={`font-rocGroteskMedium text-right pr-[43px] ${
                                                        isResponsive && "max-sm:pr-3"
                                                    }`}
                                                >
                                                    {getCurrencyFromCurrencyCode(charge?.currency)}{" "}
                                                    {formatMoney().format(
                                                        Number(charge?.price)?.toFixed(2)
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div
                                    className={`flex flex-col items-end gap-3 justify-end pr-[43px] ${
                                        isResponsive && "max-sm:pr-3"
                                    } mb-[33px]`}
                                >
                                    {Boolean(ngnCustomSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(ngnCustomVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (NGN)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                    {formatMoney().format(
                                                        Number(ngnCustomSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(ngnCustomVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                        {formatMoney().format(
                                                            Number(ngnCustomVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(usdCustomSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(usdCustomVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (USD)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("usd")}{" "}
                                                    {formatMoney().format(
                                                        Number(usdCustomSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(usdCustomVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("usd")}{" "}
                                                        {formatMoney().format(
                                                            Number(usdCustomVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(eurCustomSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(eurCustomVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (EUR)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("eur")}{" "}
                                                    {formatMoney().format(
                                                        Number(eurCustomSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(eurCustomVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("eur")}{" "}
                                                        {formatMoney().format(
                                                            Number(eurCustomVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {Boolean(gbpCustomSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-base ${
                                                isResponsive && "max-sm:w-[97%]"
                                            } font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(gbpCustomVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8 ${isResponsive && "max-sm:pl-0"} pl-[23px]`}
                                            >
                                                <p>Sub Total (GBP)</p>
                                                <p className="text-right">
                                                    {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                    {formatMoney().format(
                                                        Number(gbpCustomSubTotal)?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>

                                            {Boolean(gbpCustomVatTotal) && (
                                                <div
                                                    className={`grid grid-cols-2 gap-8 ${
                                                        isResponsive && "max-sm:pl-0"
                                                    } pl-[23px]`}
                                                >
                                                    <p>VAT ({singleQuoteData?.vat}%)</p>
                                                    <p className="text-right">
                                                        {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                        {formatMoney().format(
                                                            Number(gbpCustomVatTotal)?.toFixed(2)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    <div>
                        <div
                            className={`w-full flex justify-end pr-[43px] ${
                                isResponsive && "max-sm:px-3"
                            } mb-[33px]`}
                        >
                            <div
                                className={`py-4 border-t text-base w-[40%] ${
                                    isResponsive && "max-sm:w-full"
                                }  font-rocGroteskMedium`}
                            >
                                {singleQuoteData?.quoteType?.toLowerCase() === "ff" && (
                                    <div
                                        className={`flex justify-between w-full items-center mb-3 ${
                                            isResponsive && "max-sm:pl-0 max-sm:whitespace-nowrap"
                                        }`}
                                    >
                                        <p>Fleet+ platform fee (3%)</p>
                                        <p className="font-rocGroteskBold text-right text-lg">
                                            {getCurrencyFromCurrencyCode(
                                                paymentFeeDetails?.currency
                                            )}{" "}
                                            {formatMoney().format(
                                                paymentFeeDetails?.platformFee?.toFixed(2)
                                            )}
                                        </p>
                                    </div>
                                )}

                                {allNGNCharges && allNGNCharges?.length > 0 && (
                                    <div
                                        className={`flex justify-between w-full items-center mb-3 ${
                                            isResponsive && "max-sm:pl-0 max-sm:whitespace-nowrap"
                                        }`}
                                    >
                                        <p>Grand Total in (NGN)</p>
                                        <p className="font-rocGroteskBold text-right text-lg">
                                            ₦{" "}
                                            {singleQuoteData?.quoteType?.toLowerCase() === "ff"
                                                ? formatMoney().format(
                                                      Number(paymentFeeDetails?.amount)?.toFixed(2)
                                                  )
                                                : formatMoney().format(
                                                      (
                                                          Number(totalNGNCharges) + allNGNVatCharges
                                                      )?.toFixed(2)
                                                  )}
                                        </p>
                                    </div>
                                )}

                                {allUSDCharges && allUSDCharges?.length > 0 && (
                                    <div
                                        className={`flex justify-between w-full items-center mb-3 ${
                                            isResponsive && "max-sm:pl-0 max-sm:whitespace-nowrap"
                                        }`}
                                    >
                                        <p>Grand Total in (USD)</p>
                                        <p className="font-rocGroteskBold text-right text-lg">
                                            ${" "}
                                            {singleQuoteData?.quoteType?.toLowerCase() === "ff"
                                                ? formatMoney().format(
                                                      Number(paymentFeeDetails?.amount)?.toFixed(2)
                                                  )
                                                : formatMoney().format(
                                                      (
                                                          Number(totalUSDCharges) + allUSDVatCharges
                                                      )?.toFixed(2)
                                                  )}
                                        </p>
                                    </div>
                                )}
                                {allEURCharges && allEURCharges?.length > 0 && (
                                    <div
                                        className={`flex justify-between w-full items-center mb-3 ${
                                            isResponsive && "max-sm:pl-0 max-sm:whitespace-nowrap"
                                        }`}
                                    >
                                        <p>Grand Total in (EUR)</p>
                                        <p className="font-rocGroteskBold text-right text-lg">
                                            €{" "}
                                            {singleQuoteData?.quoteType?.toLowerCase() === "ff"
                                                ? formatMoney().format(
                                                      Number(paymentFeeDetails?.amount)?.toFixed(2)
                                                  )
                                                : formatMoney().format(
                                                      (
                                                          Number(totalEURCharges) + allEURVatCharges
                                                      )?.toFixed(2)
                                                  )}
                                        </p>
                                    </div>
                                )}
                                {allGBPCharges && allGBPCharges?.length > 0 && (
                                    <div
                                        className={`flex justify-between w-full items-center mb-3 ${
                                            isResponsive && "max-sm:pl-0 max-sm:whitespace-nowrap"
                                        }`}
                                    >
                                        <p>Grand Total in (GBP)</p>
                                        <p className="font-rocGroteskBold text-right text-lg">
                                            £{" "}
                                            {singleQuoteData?.quoteType?.toLowerCase() === "ff"
                                                ? formatMoney().format(
                                                      Number(paymentFeeDetails?.amount)?.toFixed(2)
                                                  )
                                                : formatMoney().format(
                                                      (
                                                          Number(totalGBPCharges) + allGBPVatCharges
                                                      )?.toFixed(2)
                                                  )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {singleQuoteData?.terms && (
                        <div className={`px-[43px] ${isResponsive && "max-sm:px-3"} text-base`}>
                            <p className="font-rocGroteskBold mb-2">Terms and condition</p>
                            <div
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: hasHTMLTag(singleQuoteData.terms)
                                        ? sanitizeHtml(singleQuoteData.terms).sanitizedHTML?.join(
                                              ""
                                          )
                                        : singleQuoteData.terms,
                                }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quote;
