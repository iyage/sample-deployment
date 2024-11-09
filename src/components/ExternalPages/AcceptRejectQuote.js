import NavOne from "components/common/NavOne";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalContainer from "components/common/ModalContainer";
import Loader from "components/common/Loader";
import { getTotalPrice } from "helpers/getTotalPrice";
import { useDispatch, useSelector } from "react-redux";
import { quoteActions } from "actions";
import moment from "moment";
import { getCurrencyFromCurrencyCode } from "helpers";
import { formatMoney } from "helpers/formatMoney";

const AcceptRejectQuote = () => {
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [warningModal, setWarningModal] = useState({
        isOpen: false,
        variant: "", // can be accept or reject
    });
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [newOffer, setNewOffer] = useState("");
    const { quoteId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        singleQuoteData,
        isFetchingSingleQuote,
        acceptingQuote,
        quoteAccepted,
        quoteRejected,
        rejectingQuote,
        quoteNegotiated,
        negotiatingQuote,
    } = useSelector((state) => state.quote);
    const allCharges = [
        ...(singleQuoteData?.exportCharges ?? []),
        ...(singleQuoteData?.importCharges ?? []),
        ...(singleQuoteData?.customCharges ?? []),
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

    const handleAcceptQuote = async () => {
        const body = { quoteId: quoteId };
        dispatch(quoteActions.acceptQuote(body));
    };

    const handleRejectQuote = async () => {
        const body = { quoteId: quoteId };
        dispatch(quoteActions.rejectQuote(body));
    };

    const handleNegotiate = async (e) => {
        e.preventDefault();
        const body = {
            content: newOffer,
            shipmentId: singleQuoteData?.shipmentId,
        };
        dispatch(quoteActions.negotiateQuote(body));
    };

    useEffect(() => {
        dispatch(quoteActions.fetchSingleQuote(quoteId));
    }, [quoteId, dispatch]);

    useEffect(() => {
        if (quoteAccepted) {
            setWarningModal({
                isOpen: false,
                variant: "",
            });
            setAccepted(true);
        }
    }, [quoteAccepted]);

    useEffect(() => {
        if (quoteRejected) {
            setWarningModal({
                isOpen: false,
                variant: "",
            });
            setRejected(true);
        }
    }, [quoteRejected]);

    useEffect(() => {
        if (quoteNegotiated) {
            setNewOffer("");
            setIsModalOpen(false);
            navigate(`/messaging-link/${singleQuoteData?.shipmentId}`);
        }
    }, [quoteNegotiated, navigate, singleQuoteData?.shipmentId]);

    if (isFetchingSingleQuote || !singleQuoteData) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavOne />
            <div className="flex max-lg:flex-col">
                <div className="px-10 pt-[88px] max-xl:pt-10 max-sm:px-3 max-sm:pt-3 max-sm:pb-12 pb-12 w-3/5 max-lg:w-full">
                    <div className="relative overflow-hidden pb-4 shadow-[0px_22.6872px_27.2246px_-4.53744px_rgba(16,24,40,0.08),0px_9.07487px_9.07487px_-4.53744px_rgba(16,24,40,0.03)]">
                        <div className="mb-2.5">
                            <div className="relative w-full">
                                <div className="absolute z-20 right-[-28px] top-[-18px] rotate-45 w-[70px] h-[50px] bg-mvx-light-blue"></div>
                                <div className="absolute z-10 right-0 w-[50px] h-[50px] bg-mvx-black"></div>
                            </div>
                        </div>
                        <div className="flex px-[43px] items-center justify-between max-sm:px-3 max-sm:mb-6 pt-[64px] mb-[73px]">
                            <div>
                                <img
                                    src={singleQuoteData?.creator?.profile?.logo}
                                    alt="logo"
                                    width={80}
                                />
                            </div>
                            <div>
                                <p className="font-rocGroteskBold text-base">Quotation</p>
                            </div>
                        </div>
                        <div className="flex max-sm:flex-col gap-[75px] px-[43px] pb-14 max-sm:px-3 max-sm:gap-5">
                            <div className="flex flex-col gap-[32px] w-[23%] max-sm:w-full justify-between ">
                                <div className="text-xs text-mvx-black ">
                                    <p className="font-rocGroteskBold">Bill-From</p>
                                    <p className="font-rocGroteskMedium">
                                        {singleQuoteData?.creator?.profile?.businessName}
                                    </p>
                                    <p className="font-rocGroteskMedium">
                                        {singleQuoteData?.creator?.profile?.businessAddress.address}
                                    </p>
                                </div>
                                <div className="text-xs text-mvx-black ">
                                    <p className="font-rocGroteskBold">Bill-To</p>
                                    <p className="font-rocGroteskMedium">
                                        {singleQuoteData?.shipment?.shipperDetails?.fullName}
                                    </p>
                                    <p className="font-rocGroteskMedium">
                                        {
                                            singleQuoteData?.shipment?.shipperDetails?.address
                                                ?.address
                                        }
                                    </p>
                                </div>
                            </div>
                            <hr className="hidden max-sm:block" />
                            <div className="w-[77%] max-sm:w-full">
                                <div className="grid grid-cols-3 max-sm:grid-cols-1 w-full gap-[33px] ">
                                    <div className="text-xs text-mvx-black ">
                                        <p className="font-rocGroteskBold">Issue date</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {moment(singleQuoteData?.createdAt).format(
                                                "MMM DD, YYYY"
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-xs text-mvx-black ">
                                        <p className="font-rocGroteskBold">Due date</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {singleQuoteData?.dueDate
                                                ? moment(singleQuoteData?.dueDate).format(
                                                      "MMM DD, YYYY"
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div className="text-xs text-mvx-black ">
                                        <p className="font-rocGroteskBold">Quote ID</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {singleQuoteData?.mvxid}
                                        </p>
                                    </div>
                                    <div className="text-xs text-mvx-black ">
                                        <p className="font-rocGroteskBold">Origin pickup</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {singleQuoteData?.shipment?.origin?.address}
                                        </p>
                                    </div>
                                    <div className="text-xs text-mvx-black ">
                                        <p className="font-rocGroteskBold">Shipment Type</p>
                                        <p className="font-rocGroteskMedium capitalize text-mvx-neutral">
                                            {singleQuoteData?.shipment?.serviceMode}
                                        </p>
                                    </div>
                                    <div className="text-xs text-mvx-black ">
                                        <p className="font-rocGroteskBold">Destination</p>
                                        <p className="font-rocGroteskMedium text-mvx-neutral">
                                            {singleQuoteData?.shipment?.destination?.address}
                                        </p>
                                    </div>

                                    <div className="text-xs text-mvx-black ">
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
                                        {quantityOf40Ft > 0 && quantityOf40Ft + " x 40ft"}
                                        {quantityOf20Ft > 0 && quantityOf20Ft + " x 20ft"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {singleQuoteData?.exportCharges &&
                            singleQuoteData?.exportCharges?.length > 0 && (
                                <div>
                                    <table className="mb-2.5 text-xs w-full">
                                        <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                            <tr>
                                                <th>
                                                    <p className={`flex py-2 pl-[43px] `}>
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
                                                        className={` pr-[43px] flex justify-end py-2`}
                                                    >
                                                        AMOUNT
                                                    </p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="">
                                            {singleQuoteData?.exportCharges?.map((charge) => (
                                                <tr key={charge?._id}>
                                                    <td
                                                        className={`pl-[43px]  py-4 font-rocGroteskMedium`}
                                                    >
                                                        {charge?.name}
                                                    </td>
                                                    <td className="font-rocGroteskMedium mr-8"></td>
                                                    <td className="font-rocGroteskMedium"></td>
                                                    <td
                                                        className={`font-rocGroteskMedium text-right  pr-[43px]`}
                                                    >
                                                        {getCurrencyFromCurrencyCode(
                                                            charge?.currency
                                                        )}{" "}
                                                        {formatMoney().format(
                                                            Number(charge?.price)?.toFixed(2)
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div
                                        className={`flex flex-col items-end gap-3 justify-end pr-[43px]  mb-[33px]`}
                                    >
                                        {Boolean(ngnExportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(ngnExportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    }  gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                            {formatMoney().format(
                                                                Number(ngnExportVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(usdExportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(usdExportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8 pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("usd")}{" "}
                                                            {formatMoney().format(
                                                                Number(usdExportVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(eurExportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(eurExportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("eur")}{" "}
                                                            {formatMoney().format(
                                                                Number(eurExportVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(gbpExportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(gbpExportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                            {formatMoney().format(
                                                                Number(gbpExportVatTotal)?.toFixed(
                                                                    2
                                                                )
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
                                    <table className="mb-2.5 text-xs w-full">
                                        <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                            <tr>
                                                <th>
                                                    <p className={`flex py-2 pl-[43px] `}>
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
                                                        className={` pr-[43px] flex justify-end py-2`}
                                                    >
                                                        AMOUNT
                                                    </p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="">
                                            {singleQuoteData?.importCharges?.map((charge) => (
                                                <tr key={charge?._id}>
                                                    <td
                                                        className={`pl-[43px]  py-4 font-rocGroteskMedium`}
                                                    >
                                                        {charge?.name}
                                                    </td>
                                                    <td className="font-rocGroteskMedium mr-8"></td>
                                                    <td className="font-rocGroteskMedium"></td>
                                                    <td
                                                        className={`font-rocGroteskMedium text-right pr-[43px] `}
                                                    >
                                                        {getCurrencyFromCurrencyCode(
                                                            charge?.currency
                                                        )}{" "}
                                                        {formatMoney().format(
                                                            Number(charge?.price)?.toFixed(2)
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div
                                        className={`flex flex-col items-end gap-3 justify-end pr-[43px]  mb-[33px]`}
                                    >
                                        {Boolean(ngnImportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(ngnImportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                            {formatMoney().format(
                                                                Number(ngnImportVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(usdImportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(usdImportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("usd")}{" "}
                                                            {formatMoney().format(
                                                                Number(usdImportVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(eurImportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(eurImportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("eur")}{" "}
                                                            {formatMoney().format(
                                                                Number(eurImportVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(gbpImportSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(gbpImportVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                            {formatMoney().format(
                                                                Number(gbpImportVatTotal)?.toFixed(
                                                                    2
                                                                )
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
                                <table className="mb-2.5 text-xs w-full">
                                    <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                        <tr>
                                            <th>
                                                <p className={`flex py-2 pl-[43px] `}>
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
                                                <p className={` pr-[43px] flex justify-end py-2`}>
                                                    AMOUNT
                                                </p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {singleQuoteData?.exwCharges?.map((charge) => (
                                            <tr key={charge?._id}>
                                                <td
                                                    className={`pl-[43px]  py-4 font-rocGroteskMedium`}
                                                >
                                                    {charge?.name}
                                                </td>
                                                <td className="font-rocGroteskMedium mr-8"></td>
                                                <td className="font-rocGroteskMedium"></td>
                                                <td
                                                    className={`font-rocGroteskMedium text-right pr-[43px] `}
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
                                    className={`flex flex-col items-end gap-3 justify-end pr-[43px]  mb-[33px]`}
                                >
                                    {Boolean(ngnExwSubTotal) && (
                                        <div
                                            className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(ngnExwVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8  pl-[23px]`}
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
                                                    className={`grid grid-cols-2 gap-8  pl-[23px]`}
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
                                            className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(usdExwVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8  pl-[23px]`}
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
                                                    className={`grid grid-cols-2 gap-8  pl-[23px]`}
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
                                            className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(eurExwVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8  pl-[23px]`}
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
                                                    className={`grid grid-cols-2 gap-8  pl-[23px]`}
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
                                            className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                        >
                                            <div
                                                className={`grid grid-cols-2 ${
                                                    !Boolean(gbpExwVatTotal) ? "mb-0" : "mb-2"
                                                } gap-8  pl-[23px]`}
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
                                                    className={`grid grid-cols-2 gap-8  pl-[23px]`}
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
                                    <table className="mb-2.5 text-xs w-full">
                                        <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                                            <tr>
                                                <th>
                                                    <p className={`flex py-2 pl-[43px] `}>
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
                                                        className={` pr-[43px] flex justify-end py-2`}
                                                    >
                                                        AMOUNT
                                                    </p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="">
                                            {singleQuoteData?.customCharges?.map((charge) => (
                                                <tr key={charge?._id}>
                                                    <td
                                                        className={`pl-[43px] py-4 font-rocGroteskMedium`}
                                                    >
                                                        {charge?.name}
                                                    </td>
                                                    <td className="font-rocGroteskMedium mr-8"></td>
                                                    <td className="font-rocGroteskMedium"></td>
                                                    <td
                                                        className={`font-rocGroteskMedium text-right pr-[43px] `}
                                                    >
                                                        {getCurrencyFromCurrencyCode(
                                                            charge?.currency
                                                        )}{" "}
                                                        {formatMoney().format(
                                                            Number(charge?.price)?.toFixed(2)
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div
                                        className={`flex flex-col items-end gap-3 justify-end pr-[43px]  mb-[33px]`}
                                    >
                                        {Boolean(ngnCustomSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(ngnCustomVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("ngn")}{" "}
                                                            {formatMoney().format(
                                                                Number(ngnCustomVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(usdCustomSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(usdCustomVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8 pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("usd")}{" "}
                                                            {formatMoney().format(
                                                                Number(usdCustomVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(eurCustomSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(eurCustomVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("eur")}{" "}
                                                            {formatMoney().format(
                                                                Number(eurCustomVatTotal)?.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {Boolean(gbpCustomSubTotal) && (
                                            <div
                                                className={`py-4 border-y text-xs  font-rocGroteskMedium`}
                                            >
                                                <div
                                                    className={`grid grid-cols-2 ${
                                                        !Boolean(gbpCustomVatTotal)
                                                            ? "mb-0"
                                                            : "mb-2"
                                                    } gap-8  pl-[23px]`}
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
                                                        className={`grid grid-cols-2 gap-8  pl-[23px]`}
                                                    >
                                                        <p>VAT ({singleQuoteData?.vat}%)</p>
                                                        <p className="text-right">
                                                            {getCurrencyFromCurrencyCode("gbp")}{" "}
                                                            {formatMoney().format(
                                                                Number(gbpCustomVatTotal)?.toFixed(
                                                                    2
                                                                )
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
                            <div className="flex justify-end pr-[43px] max-sm:px-3 mb-[33px]">
                                <div className="py-4 border-t text-xs font-rocGroteskMedium">
                                    {allNGNCharges && allNGNCharges?.length > 0 && (
                                        <div className="grid grid-cols-2 mb-3 gap-[167px] pl-[23px] max-sm:pl-0 max-sm:whitespace-nowrap">
                                            <p>Grand Total in (NGN)</p>
                                            <p className="font-rocGroteskBold text-right text-sm">
                                                ₦
                                                {formatMoney().format(
                                                    (
                                                        Number(totalNGNCharges) + allNGNVatCharges
                                                    )?.toFixed(2)
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {allUSDCharges && allUSDCharges?.length > 0 && (
                                        <div className="grid grid-cols-2 mb-3 gap-[167px] pl-[23px] max-sm:pl-0 max-sm:whitespace-nowrap">
                                            <p>Grand Total in (USD)</p>
                                            <p className="font-rocGroteskBold text-right text-sm">
                                                $
                                                {formatMoney().format(
                                                    (
                                                        Number(totalUSDCharges) + allUSDVatCharges
                                                    )?.toFixed(2)
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    {allEURCharges && allEURCharges?.length > 0 && (
                                        <div className="grid grid-cols-2 mb-3 gap-[167px] pl-[23px] max-sm:pl-0 max-sm:whitespace-nowrap">
                                            <p>Grand Total in (EUR)</p>
                                            <p className="font-rocGroteskBold text-right text-sm">
                                                €
                                                {formatMoney().format(
                                                    (
                                                        Number(totalEURCharges) + allEURVatCharges
                                                    )?.toFixed(2)
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    {allGBPCharges && allGBPCharges?.length > 0 && (
                                        <div className="grid grid-cols-2 mb-3 gap-[167px] pl-[23px] max-sm:pl-0 max-sm:whitespace-nowrap">
                                            <p>Grand Total in (GBP)</p>
                                            <p className="font-rocGroteskBold text-right text-sm">
                                                £
                                                {formatMoney().format(
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
                            <div className="px-[43px] max-sm:px-3 text-xs">
                                <p className="font-rocGroteskBold mb-2">Terms and condition</p>
                                <ul className="list-disc pl-3.5 font-rocGroteskMedium text-mvx-neutral">
                                    <li className="mb-4">{singleQuoteData?.terms}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-[35%] max-lg:w-full">
                    <div className="min-h-[50%] max-lg:h-auto max-lg:bg-white max-lg:shadow-[0px_-3px_11.4248px_-1.90413px_rgba(16,24,40,0.08),0px_-3.81px_3.80825px_-1.90413px_rgba(16,24,40,0.03)] max-h-full pt-[90px] pb-[45px] px-[66px] max-sm:px-3 max-sm:py-6 bg-[#FAFBFC]">
                        <div className="py-4 mb-4 font-rocGroteskMedium">
                            {allNGNCharges && allNGNCharges?.length > 0 && (
                                <div className="mb-12">
                                    <div className="pb-4 mb-4 border-b">
                                        <div className="grid grid-cols-2 mb-4 text-sm">
                                            <p>Total in (NGN)</p>
                                            <p className="text-right">
                                                ₦{" "}
                                                {formatMoney().format(totalNGNCharges?.toFixed(2))}
                                            </p>
                                        </div>
                                        {Boolean(allNGNVatCharges) && (
                                            <div className="grid grid-cols-2 text-sm">
                                                <p>VAT({singleQuoteData?.vat}%) in (NGN)</p>
                                                <p className="text-right">
                                                    ₦{" "}
                                                    {formatMoney().format(
                                                        allNGNVatCharges?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 mb-4 text-base">
                                        <p>Grand Total in (NGN)</p>
                                        <p className="text-right">
                                            ₦{" "}
                                            {formatMoney().format(
                                                (
                                                    Number(totalNGNCharges) + allNGNVatCharges
                                                )?.toFixed(2)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {allUSDCharges && allUSDCharges?.length > 0 && (
                                <div className="">
                                    <div className="pb-4 mb-4 border-b">
                                        <div className="grid grid-cols-2 mb-4 text-sm">
                                            <p>Total in (USD)</p>
                                            <p className="text-right">
                                                ${" "}
                                                {formatMoney().format(totalUSDCharges?.toFixed(2))}
                                            </p>
                                        </div>
                                        {Boolean(allUSDVatCharges) && (
                                            <div className="grid grid-cols-2 text-sm">
                                                <p>VAT({singleQuoteData?.vat}%) in (USD)</p>
                                                <p className="text-right">
                                                    ${" "}
                                                    {formatMoney().format(
                                                        allUSDVatCharges?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 mb-4 text-base">
                                        <p>Grand Total in (USD)</p>
                                        <p className="text-right">
                                            ${" "}
                                            {formatMoney().format(
                                                (
                                                    Number(totalUSDCharges) + allUSDVatCharges
                                                )?.toFixed(2)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {allEURCharges && allEURCharges?.length > 0 && (
                                <div>
                                    <div className="pb-4 mb-4 border-b">
                                        <div className="grid grid-cols-2 mb-4 text-sm">
                                            <p>Total in (EUR)</p>
                                            <p className="text-right">
                                                €{" "}
                                                {formatMoney().format(totalEURCharges?.toFixed(2))}
                                            </p>
                                        </div>
                                        {Boolean(allEURVatCharges) && (
                                            <div className="grid grid-cols-2 text-sm">
                                                <p>VAT({singleQuoteData?.vat}%) in (EUR)</p>
                                                <p className="text-right">
                                                    €{" "}
                                                    {formatMoney().format(
                                                        allEURVatCharges?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 mb-4 text-base">
                                        <p>Grand Total in (EUR)</p>
                                        <p className="text-right">
                                            €{" "}
                                            {formatMoney().format(
                                                (
                                                    Number(totalEURCharges) + allEURVatCharges
                                                )?.toFixed(2)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {allGBPCharges && allGBPCharges?.length > 0 && (
                                <div>
                                    <div className="pb-4 mb-4 border-b">
                                        <div className="grid grid-cols-2 text-sm">
                                            <p>Total in (GBP)</p>
                                            <p className="text-right">
                                                £{" "}
                                                {formatMoney().format(totalGBPCharges?.toFixed(2))}
                                            </p>
                                        </div>
                                        {Boolean(allGBPVatCharges) && (
                                            <div className="grid grid-cols-2 text-sm">
                                                <p>VAT({singleQuoteData?.vat}%) in (GBP)</p>
                                                <p className="text-right">
                                                    £{" "}
                                                    {formatMoney().format(
                                                        allGBPVatCharges?.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 mb-4 text-base">
                                        <p>Grand Total in (GBP)</p>
                                        <p className="text-right">
                                            £{" "}
                                            {formatMoney().format(
                                                (
                                                    Number(totalGBPCharges) + allGBPVatCharges
                                                )?.toFixed(2)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <button
                                type="button"
                                disabled={
                                    singleQuoteData?.status === "rejected" ||
                                    singleQuoteData?.status === "accepted" ||
                                    accepted ||
                                    rejected ||
                                    acceptingQuote
                                }
                                className={`w-full text-white text-base font-rocGroteskMedium flex items-center justify-center bg-mvx-black disabled:opacity-40 py-3 px-6`}
                                onClick={() => {
                                    setWarningModal({
                                        isOpen: true,
                                        variant: "accept",
                                    });
                                }}
                            >
                                <p className="text-inherit">Accept quote</p>
                            </button>
                            <button
                                type="button"
                                disabled={
                                    singleQuoteData?.status === "rejected" ||
                                    singleQuoteData?.status === "accepted" ||
                                    accepted ||
                                    rejected ||
                                    rejectingQuote
                                }
                                className={`w-full text-mvx-neutral text-base font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue disabled:opacity-40 py-3 px-6`}
                                onClick={() => {
                                    setWarningModal({
                                        isOpen: true,
                                        variant: "reject",
                                    });
                                }}
                            >
                                <p>Reject quote</p>
                            </button>
                            {singleQuoteData?.status === "pending" && !accepted && !rejected && (
                                <p className="font-rocGroteskMedium text-mvx-neutral text-center text-sm">
                                    Don’t like the offer you can negotiate price{" "}
                                    <span
                                        className="underline cursor-pointer"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        here
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {modalIsOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setIsModalOpen(false);
                        setNewOffer("");
                    }}
                >
                    <form
                        className="bg-white rounded-lg shadow-modalShadow"
                        onSubmit={handleNegotiate}
                    >
                        <div className="px-6 pt-6">
                            <p className="text-[22px] text-center mb-6 font-rocGroteskBold text-mvx-black">
                                Negotiate this offer
                            </p>
                            <div>
                                <p className="text-sm font-rocGroteskMedium text-mvx-black mb-1">
                                    New offer
                                </p>
                                <textarea
                                    type="text"
                                    placeholder="I would like to negotiate the price of my quote"
                                    className="border border-gray-200 resize-none py-3 px-4 outline-0 w-full text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                    required
                                    name="newOffer"
                                    value={newOffer}
                                    onChange={(e) => setNewOffer(e.target.value)}
                                    rows={"5"}
                                />
                            </div>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setNewOffer("");
                                }}
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`uppercase rounded-br-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border-y px-3`}
                            >
                                {negotiatingQuote ? (
                                    <Loader color="mvx-black" />
                                ) : (
                                    <p className="text-inherit">SEND NEW OFFER</p>
                                )}
                            </button>
                        </div>
                    </form>
                </ModalContainer>
            )}
            {warningModal.isOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setWarningModal({
                            isOpen: false,
                            variant: "",
                        });
                    }}
                >
                    <form
                        className="bg-white rounded-lg shadow-modalShadow"
                        onSubmit={handleNegotiate}
                    >
                        <div className="p-6">
                            <p className="text-[22px] text-center mb-2 font-rocGroteskBold text-mvx-black">
                                Are you sure you want to {warningModal.variant} quote?
                            </p>
                            <p className="text-sm text-center mb-6 font-rocGroteskMedium text-mvx-neutral">
                                Once you {warningModal.variant} this quote you will not be able to
                                interact with this quote any further
                            </p>
                            <div className="flex gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setWarningModal({
                                            isOpen: false,
                                            variant: "",
                                        });
                                    }}
                                    className={` w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-2 border rounded-lg border-mvx-black px-3`}
                                >
                                    No, cancel
                                </button>
                                {Boolean(warningModal.variant) &&
                                warningModal.variant === "accept" ? (
                                    <button
                                        type="button"
                                        onClick={handleAcceptQuote}
                                        className={` w-full text-white text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-black rounded-lg py-2 border px-3`}
                                    >
                                        {acceptingQuote ? (
                                            <Loader color="white" />
                                        ) : (
                                            <p className="text-inherit">
                                                Yes, {warningModal.variant}
                                            </p>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleRejectQuote}
                                        className={` w-full text-white text-sm font-rocGroteskMedium flex items-center justify-center bg-[#F90000] rounded-lg py-2 border px-3`}
                                    >
                                        {rejectingQuote ? (
                                            <Loader color="white" />
                                        ) : (
                                            <p className="text-inherit">
                                                Yes, {warningModal.variant}
                                            </p>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </ModalContainer>
            )}
        </div>
    );
};

export default AcceptRejectQuote;
