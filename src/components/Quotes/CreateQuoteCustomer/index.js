/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { authActions, quoteActions, rateActions, shipmentActions } from "actions";
import Quote from "components/common/Quote";
import ModalContainer from "components/common/ModalContainer";
import Loader from "components/common/Loader";
import Form from "./Form";
import { getFromStorage } from "helpers";

const CreateQuoteCustomer = () => {
    const { shipmentId } = useParams();
    const [reqData, setReqData] = useState();
    const [step, setStep] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const itemObjType = {
        name: "",
        price: "",
        currency: selectedCurrency,
        vat: false,
    };
    const [customCharges, setCustomCharges] = useState([itemObjType]);
    const [exportCharges, setExportCharges] = useState([itemObjType]);
    const [importCharges, setImportCharges] = useState([itemObjType]);
    const [EXWCharges, setEXWCharges] = useState([itemObjType]);
    const [dueDate, setDueDate] = useState("");
    const [terms, setTerms] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [param] = useSearchParams();
    const requestId = param.get("requestId");
    const instantQuoteId = param.get("instantQuoteId");
    const [user, setUser] = useState(getFromStorage("tradeAlly-user"));
    const { ffProfile, ffProfileLoading } = useSelector((state) => state.auth);
    const {
        createQuoteToCustomer,
        createQuoteToCustomerLoading,
        createQuoteForReq,
        createQuoteForReqLoading,
        singleQuoteReqLoading,
        singleQuoteReq,
    } = useSelector((state) => state.quote);
    const { pendingShipments, isPendingShipmentsLoading, ffShipmentLoading, ffShipment } =
        useSelector((state) => state.shipment);
    const { getSingleRateLoading, getSingleRateSuccess } = useSelector((state) => state.rate);

    useEffect(() => {
        if (shipmentId) {
            dispatch(shipmentActions.fetchFFSingleShipment(shipmentId));
        }
        if (instantQuoteId) {
            dispatch(rateActions.fetchSingleRate(instantQuoteId));
        }
        if (requestId) {
            dispatch(quoteActions.fetchSingleQuoteRequest(requestId));
        } else {
            dispatch(quoteActions.resetFetchSingleQuoteSuccessData());
        }
    }, [shipmentId, instantQuoteId, requestId]);

    useEffect(() => {
        if (user && !user?.result?.profile?.businessName && !ffProfile) {
            dispatch(authActions.fetchFreightForwarderProfile(user._id));
        }
    }, [user, ffProfile]);

    if (!shipmentId) return <Navigate to={"/dashboard/home"} />;

    const singleQuoteData = {
        shipment: ffShipment,
        creator: {
            profile: ffShipment?.freightForwarder?.profile,
        },
        dueDate: reqData?.dueDate,
        exportCharges: reqData?.exportCharges,
        importCharges: reqData?.importCharges,
        customCharges: reqData?.customCharges,
        exwCharges: reqData?.exwCharges,
        createdAt: new Date().toISOString().slice(0, 10),
        terms: reqData?.terms,
        vat: 7.5,
    };

    if (requestId) {
        singleQuoteData.quoteType = "FF";
    }

    const createQuote = () => {
        if (Boolean(requestId)) {
            const data = { ...reqData };
            delete data?.shipmentId;
            data.quoteRequestId = requestId;

            return dispatch(quoteActions.createQuoteForQuoteReq(data));
        }

        return dispatch(quoteActions.createQuoteToCustomer(reqData));
    };

    if (ffShipmentLoading || singleQuoteReqLoading || ffProfileLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <>
            <nav className="flex justify-between bg-white items-center px-3 475:px-6 pt-[13px] pb-[15px] sticky top-0 z-30 shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                <div className="flex">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262644/Web%20App/dashboard/file-list_i1dehd.svg"
                        }
                        alt="File List Icon"
                        className="w-10 h-10 self-center"
                    />
                    <div className="text-sm 475:text-base font-bold ml-[13px]">
                        <p className="text-inherit">Create Quote</p>
                        <p className="text-xs 475:text-sm font-normal">
                            Create quotations for your customers
                        </p>
                    </div>
                </div>
                <div
                    className={`flex items-center text-sm ml-2 ${
                        (createQuoteToCustomerLoading || createQuoteForReqLoading) &&
                        "pointer-events-none"
                    }`}
                >
                    <button className="mr-[10px] px-7 py-[9px] text-gun-metal bg-white border hidden">
                        Save to drafts
                    </button>
                    <button
                        className="mr-5 px-5 max-475:text-xs py-[10px] bg-pacific-cyan disabled:bg-pacific-cyan/70"
                        disabled={createQuoteToCustomerLoading || createQuoteForReqLoading}
                        onClick={() =>
                            !step ? document.getElementById("qt-Btn").click() : createQuote()
                        }
                    >
                        {!step ? (
                            "Preview"
                        ) : (
                            <>
                                {createQuoteToCustomerLoading || createQuoteForReqLoading ? (
                                    <Loader color={"white"} className={"mx-[30px]"} />
                                ) : (
                                    "Send Quote"
                                )}
                            </>
                        )}
                    </button>
                    <span
                        className="material-icons bg-mvx-light-blue rounded-full px-[5px] text-lg font-medium cursor-pointer"
                        onClick={() => {
                            return step ? setStep(0) : navigate("/dashboard/home");
                        }}
                    >
                        close
                    </span>
                </div>
            </nav>

            {!step ? (
                <div className="flex bg-mvx-light-blue min-h-[calc(100vh-72px)]">
                    <aside className="max-lg:hidden w-[280px] bg-white p-6 pr-5 pb-10 shadow-primary">
                        <p className="flex justify-between items-center font-semibold text-[13px]">
                            QUOTE LIST
                        </p>
                    </aside>

                    <div className="flex-1 bg-white 475:mx-9 mt-9 shadow-primary pt-8 p-7 pb-10">
                        <Form
                            ffShipment={ffShipment}
                            ffShipmentLoading={ffShipmentLoading}
                            setStep={setStep}
                            setReqData={setReqData}
                            formLoading={getSingleRateLoading || ffShipmentLoading}
                            instantQuoteData={getSingleRateSuccess?.rate}
                            {...{
                                itemObjType,
                                selectedCurrency,
                                setSelectedCurrency,
                                customCharges,
                                setCustomCharges,
                                exportCharges,
                                setExportCharges,
                                importCharges,
                                setImportCharges,
                                EXWCharges,
                                setEXWCharges,
                                dueDate,
                                setDueDate,
                                terms,
                                setTerms,
                                errorMessage,
                                setErrorMessage,
                            }}
                        />
                    </div>

                    <aside className="max-lg:hidden w-[280px] bg-white pt-[30px] pl-6 pr-5 pb-10 shadow-primary">
                        <Link
                            to={`/dashboard/shipment/${shipmentId}`}
                            className="text-sm mb-4 font-medium text-mvx-neutral flex items-center"
                        >
                            {/* <EyeIcon className="mr-1 -translate-y-[1px]" /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262863/Web%20App/dashboard/eye_i2f08n.svg"
                                }
                                alt="Eye Icon"
                                className="mr-1 -translate-y-[1px]"
                            />
                            View shipment details
                        </Link>
                        {/* <p className="text-sm mb-4 font-medium text-mvx-neutral flex items-center">
                        <BookScrollIcon className="mr-1 -translate-y-[1px]" />
                        Download as PDF
                    </p> */}
                    </aside>
                </div>
            ) : (
                <div className="bg-mvx-light-blue 475:px-0 lg:px-32">
                    <Quote
                        isResponsive={true}
                        singleQuoteReq={singleQuoteReq}
                        ffProfile={ffProfile}
                        {...{ singleQuoteData, portOfLoading: ffShipment?.portOfLoading }}
                    />
                </div>
            )}

            <p
                className={`font-rocGrotesk font-medium text-base text-mvx-neutral py-8 text-center ${
                    step && "bg-mvx-light-blue"
                }`}
            >
                Powered by{" "}
                <span className="font-rocGrotesk font-semibold text-mvx-neutral">Fleet+</span>
            </p>

            {(createQuoteToCustomer || createQuoteForReq) && (
                <ModalContainer>
                    <div className="bg-white rounded-t 475:rounded-lg overflow-hidden [&*]:font-rocGrotesk max-475:fixed bottom-0 left-0 w-full 475:w-[420px]">
                        {/* <SuccessIcon className="mb-6 m-auto mt-8" /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_80/v1687187488/Web%20App/external_pages/success_q1oaal.svg"
                            }
                            alt="success"
                            className="m-auto mb-6 mt-8"
                        />
                        <p className="text-[20px] text-center mb-3 font-semibold px-6">
                            Quote Created!
                        </p>
                        <p className="text-sm text-center px-6 mb-8 leading-[20px]">
                            Your quote for Shipment no. TA
                            {createQuoteToCustomer || ffShipment?.mvxid} has been created
                            successfully.
                            {/*  You will get an update as soon as a partner accepts your shipment request */}
                        </p>
                        <button
                            className="bg-mvx-blue/[.03] text-gun-metal text-xs w-full font-medium py-5"
                            onClick={() => {
                                dispatch(quoteActions.resetCreateQuoteToCustomer());
                                dispatch(quoteActions.resetCreateQuoteForReqSuccess());
                                navigate("/dashboard/quotes");
                            }}
                        >
                            CLOSE
                        </button>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default CreateQuoteCustomer;

/*
upload logo
set max logo size to 1mb
download pdf on both pages
currency change update on all sections
fields repopulate on enter form page
image on powered by tradeAlly
auoteList Api
template should be true once pdf is ready and upload pdf should be added to retrieve the URL before sending the quote
*/
