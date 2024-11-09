import { getCurrencyFromCurrencyCode, getTotalPrice } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";

const PreviewQuoteComponent = ({ shipment, quote, creator }) => {
    const vat = quote?.vat ?? 7.5;
    const fromDetails = [
        { title: "Issue Date", value: moment(quote?.createdAt).format("MMM DD, YYYY") },
        { title: "Due Date", value: moment(quote?.dueDate).format("MMM DD, YYYY") },
        { title: "Quote ID", value: upperFirst(quote?._id?.slice(-8)) },
        { title: "Origin Pickup", value: shipment?.origin?.address ?? "--" },
        {
            title: "Port of Loading",
            value: shipment?.portOfLoading?.details?.at(-1)?.address ?? "--",
        },
        { title: "Shipment Type", value: upperFirst(shipment?.serviceMode) ?? "--" },
    ];

    const toDetails = [
        { title: "Destination", value: shipment?.destination?.address ?? "---" },
        { title: "Destination Port", value: "---" },
        { title: "Gross Weight", value: shipment?.destination?.adress ?? "---" },
    ];

    const getCurrencyCharges = (arr, currency) =>
        arr?.filter((charge) => charge?.currency?.toLowerCase() === currency?.toLowerCase());

    const getVatCharges = (arr, currency) => {
        const charges = arr?.filter(
            (charge) => charge?.currency?.toLowerCase() === currency?.toLowerCase() && !!charge.vat
        );

        return getTotalPrice(charges) * (Number(vat ?? 0) / 100);
    };

    const charges = [
        {
            title: "EXPORT CHARGES",
            display: !!quote?.exportCharges?.length,
            value: quote?.exportCharges,
            subtotal: [
                {
                    currency: "NGN",
                    value: getTotalPrice(getCurrencyCharges(quote?.exportCharges, "NGN")),
                    vat: getVatCharges(quote?.exportCharges, "NGN"),
                },
                {
                    currency: "USD",
                    value: getTotalPrice(getCurrencyCharges(quote?.exportCharges, "USD")),
                    vat: getVatCharges(quote?.exportCharges, "USD"),
                },
                {
                    currency: "GBP",
                    value: getTotalPrice(getCurrencyCharges(quote?.exportCharges, "GBP")),
                    vat: getVatCharges(quote?.exportCharges, "GBP"),
                },
                {
                    currency: "EUR",
                    value: getTotalPrice(getCurrencyCharges(quote?.exportCharges, "EUR")),
                    vat: getVatCharges(quote?.exportCharges, "EUR"),
                },
            ],
        },
        {
            title: "IMPORT CHARGES",
            display: !!quote?.importCharges?.length,
            value: quote?.importCharges,
            subtotal: [
                {
                    currency: "NGN",
                    value: getTotalPrice(getCurrencyCharges(quote?.importCharges, "NGN")),
                    vat: getVatCharges(quote?.importCharges, "NGN"),
                },
                {
                    currency: "USD",
                    value: getTotalPrice(getCurrencyCharges(quote?.importCharges, "USD")),
                    vat: getVatCharges(quote?.importCharges, "USD"),
                },
                {
                    currency: "GBP",
                    value: getTotalPrice(getCurrencyCharges(quote?.importCharges, "GBP")),
                    vat: getVatCharges(quote?.importCharges, "GBP"),
                },
                {
                    currency: "EUR",
                    value: getTotalPrice(getCurrencyCharges(quote?.importCharges, "EUR")),
                    vat: getVatCharges(quote?.importCharges, "EUR"),
                },
            ],
        },
        {
            title: "EXW CHARGES",
            display: !!quote?.exwCharges?.length,
            value: quote?.exwCharges,
            subtotal: [
                {
                    currency: "NGN",
                    value: getTotalPrice(getCurrencyCharges(quote?.exwCharges, "NGN")),
                    vat: getVatCharges(quote?.exwCharges, "NGN"),
                },
                {
                    currency: "USD",
                    value: getTotalPrice(getCurrencyCharges(quote?.exwCharges, "USD")),
                    vat: getVatCharges(quote?.exwCharges, "USD"),
                },
                {
                    currency: "GBP",
                    value: getTotalPrice(getCurrencyCharges(quote?.exwCharges, "GBP")),
                    vat: getVatCharges(quote?.exwCharges, "GBP"),
                },
                {
                    currency: "EUR",
                    value: getTotalPrice(getCurrencyCharges(quote?.exwCharges, "EUR")),
                    vat: getVatCharges(quote?.exwCharges, "EUR"),
                },
            ],
        },
        {
            title: "CUSTOM CHARGES",
            display: !!quote?.customCharges?.length,
            value: quote?.customCharges,
            subtotal: [
                {
                    currency: "NGN",
                    value: getTotalPrice(getCurrencyCharges(quote?.customCharges, "NGN")),
                    vat: getVatCharges(quote?.customCharges, "NGN"),
                },
                {
                    currency: "USD",
                    value: getTotalPrice(getCurrencyCharges(quote?.customCharges, "USD")),
                    vat: getVatCharges(quote?.customCharges, "USD"),
                },
                {
                    currency: "GBP",
                    value: getTotalPrice(getCurrencyCharges(quote?.customCharges, "GBP")),
                    vat: getVatCharges(quote?.customCharges, "GBP"),
                },
                {
                    currency: "EUR",
                    value: getTotalPrice(getCurrencyCharges(quote?.customCharges, "EUR")),
                    vat: getVatCharges(quote?.customCharges, "EUR"),
                },
            ],
        },
    ];

    const getTotalCurrencyPrice = (currency) =>
        charges
            ?.map((c) =>
                c?.subtotal
                    ?.filter((sb) => sb?.currency?.toLowerCase() === currency?.toLowerCase())
                    ?.map((c) => c?.value)
            )
            ?.flat()
            ?.reduce((a, b) => a + (b || 0), 0);

    const getTotalCurrencyVAT = (currency) =>
        charges
            ?.map((c) =>
                c?.subtotal
                    ?.filter((sb) => sb?.currency?.toLowerCase() === currency?.toLowerCase())
                    ?.map((c) => c?.vat)
            )
            ?.flat()
            ?.reduce((a, b) => a + (b || 0), 0);

    const chargesTotal = [
        {
            currency: "NGN",
            value: getTotalCurrencyPrice("NGN") + (getTotalCurrencyVAT("NGN") || 0),
        },
        {
            currency: "USD",
            value: getTotalCurrencyPrice("USD") + (getTotalCurrencyVAT("USD") || 0),
        },
        {
            currency: "GBP",
            value: getTotalCurrencyPrice("GBP") + (getTotalCurrencyVAT("GBP") || 0),
        },
        {
            currency: "EUR",
            value: getTotalCurrencyPrice("EUR") + (getTotalCurrencyVAT("EUR") || 0),
        },
    ];

    return (
        <div className="w-full bg-white shadow-[0px_13.42385px_13.42385px_-6.71193px_rgba(16,24,40,0.03),0px_33.55964px_40.27156px_-6.71193px_rgba(16,24,40,0.08)] pb-[200px]">
            <div className="h-[176px] bg-neutral-n-10 px-16 flex justify-between relative">
                <div className="absolute z-20 right-[-28px] top-[-18px] rotate-45 w-[70px] h-[50px] bg-mvx-light-blue"></div>
                <div className="absolute z-10 right-0 w-[50px] h-[50px] bg-mvx-black"></div>
                <img
                    src={creator?.profile?.logo || ""}
                    alt=""
                    className="w-[126px] h-[126px] mt-auto -mb-8"
                />
                <h4 className="mt-auto py-7 font-rocGroteskBold text-gun-metal text-2xl">
                    Quotation
                </h4>
            </div>

            <div className="mt-20 px-16">
                <div className="grid grid-cols-[250px_1fr] gap-x-[70px]">
                    <div className="">
                        <h1 className="text-gun-metal font-rocGroteskMedium mb-2">Bill-From</h1>
                        <p className="text-neutral-n-200 font-rocGroteskMedium">
                            {upperFirst(creator?.profile?.businessName) ?? ""}
                        </p>
                        <p className="text-neutral-n-200 font-rocGroteskMedium mt-1">
                            {upperFirst(creator?.profile?.businessAddress?.address) ?? ""}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-x-[70px] gap-y-[60px]">
                        {fromDetails?.map((f) => (
                            <div key={f?.title}>
                                <h1 className="text-gun-metal font-rocGroteskMedium mb-1">
                                    {f?.title}
                                </h1>
                                <p className="text-neutral-n-200 font-rocGroteskMedium">
                                    {f?.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-[250px_1fr] gap-x-[70px] mt-10">
                    <div className="">
                        <h1 className="text-gun-metal font-rocGroteskMedium mb-2">Bill-To</h1>
                        <p className="text-neutral-n-200 font-rocGroteskMedium">
                            {upperFirst(shipment?.shipperDetails?.fullName) ?? ""}
                        </p>
                        <p className="text-neutral-n-200 font-rocGroteskMedium mt-1">
                            {upperFirst(shipment?.destination?.address) ?? ""}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-x-[70px] gap-y-[60px]">
                        {toDetails?.map((f) => (
                            <div key={f?.title}>
                                <h1 className="text-gun-metal font-rocGroteskMedium mb-1">
                                    {f?.title}
                                </h1>
                                <p className="text-neutral-n-200 font-rocGroteskMedium">
                                    {f?.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16">
                    <h1 className="font-rocGroteskMedium text-gun-metal mb-4">
                        Shipment description
                    </h1>
                    <p className="text-neutral-n-200 font-rocGroteskMedium">
                        {shipment?.goodsDetails?.description}
                    </p>
                </div>
            </div>

            <div className="mt-16 space-y-16">
                {charges?.map((c) => (
                    <div className="" key={c?.title}>
                        {c?.display && (
                            <div>
                                <div className="w-full bg-neutral-n-20 px-16 py-3 grid grid-cols-[1fr_250px] gap-10 items-center">
                                    <h1 className="text-neutral-n-200 text-sm font-rocGroteskMedium">
                                        {c?.title}
                                    </h1>

                                    <h2 className="text-right uppercase text-sm font-rocGroteskMedium text-neutral-n-200">
                                        Amount
                                    </h2>
                                </div>
                                <div className="space-y-6 mt-6">
                                    {c?.value?.map((c, i) => (
                                        <div
                                            className="grid grid-cols-[1fr_250px] gap-10 px-16"
                                            key={i}
                                        >
                                            <h3 className="text-gun-metal font-rocGroteskMedium">
                                                {c?.name}
                                            </h3>
                                            <h4 className="text-right text-gun-metal font-rocGroteskMedium">
                                                {getCurrencyFromCurrencyCode(c?.currency)}
                                                {formatMoney().format(Number(c?.price)?.toFixed(2))}
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-[300px] ml-auto border-y border-y-neutral-n-40 py-6 mr-16 mt-6 pl-8 space-y-3">
                                    {c?.subtotal?.map((amt) => (
                                        <div key={amt?.currency}>
                                            {!!amt?.value && (
                                                <div className="grid grid-cols-2 gap-x-10 ">
                                                    <h1 className="font-rocGroteskMedium text-gun-metal">{`Sub Total ${amt.currency}`}</h1>
                                                    <h3 className="text-right font-rocGroteskMedium text-gun-metal">{`${getCurrencyFromCurrencyCode(
                                                        amt?.currency
                                                    )}${formatMoney().format(
                                                        Number(amt?.value).toFixed(2)
                                                    )}`}</h3>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {c?.subtotal?.map((amt) => (
                                        <div key={amt?.currency}>
                                            {!!amt?.vat && (
                                                <div className="grid grid-cols-2 gap-x-10">
                                                    <h1 className="font-rocGroteskMedium text-gun-metal">{`VAT (${vat}%)`}</h1>
                                                    <h3 className="text-right font-rocGroteskMedium text-gun-metal">{`${getCurrencyFromCurrencyCode(
                                                        amt?.currency
                                                    )}${formatMoney().format(
                                                        Number(amt?.vat).toFixed(2)
                                                    )}`}</h3>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-16 w-[600px] ml-auto border-t border-y-neutral-n-40 pt-2 space-y-[14px] mr-16">
                {chargesTotal?.map((tot) => (
                    <div key={tot?.currency}>
                        {!!tot?.value && (
                            <div className="grid grid-cols-2 gap-10">
                                <h1 className="font-rocGroteskMedium text-gun-metal">
                                    Grand Total In {tot?.currency}
                                </h1>
                                <h2 className="text-right font-rocGroteskBold">
                                    {getCurrencyFromCurrencyCode(tot?.currency)}
                                    {formatMoney().format(Number(tot?.value)?.toFixed(2))}
                                </h2>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviewQuoteComponent;
