/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import LandingFooter from "components/ExternalPages/Landing/components/LandingFooter";
import LandingSubFooter from "components/common/LandingSubFooter";
import NavOne from "components/common/NavOne";
import logo from "assets/images/logo-onboard.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFromStorage, regionNames } from "helpers";
import { quoteActions, shipmentActions, authActions } from "actions";
import Loader from "components/common/Loader";
import Item from "./Item";
import PackageContainerList from "./PackageContainerList";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import QuoteDoc from "./QuoteDoc";
import { firebaseService } from "services/firebaseService";
import ModalContainer from "components/common/ModalContainer";
// import { SuccessIcon } from "assets/arts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";

const CreateQuote = () => {
    const [globalFFUser, setGlobalFFUser] = useState(getFromStorage("tradeAlly-user"));
    const dispatch = useDispatch();
    const { ffShipmentLoading, ffShipment } = useSelector((state) => state.shipment);
    const { user } = useSelector((state) => state.auth);
    const { singleQuoteReq, singleQuoteReqLoading, createQuoteForReqLoading, createQuoteForReq } =
        useSelector((state) => state.quote);
    const navigate = useNavigate();
    const resolvedUser = globalFFUser ?? user;
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const itemObjType = {
        name: "",
        price: "",
        currency: selectedCurrency,
    };
    const [customCharges, setCustomCharges] = useState([itemObjType]);
    const [exportCharges, setExportCharges] = useState([itemObjType]);
    const [importCharges, setImportCharges] = useState([itemObjType]);
    const [EXWCharges, setEXWCharges] = useState([itemObjType]);
    const [dueDate, setDueDate] = useState("");
    const [terms, setTerms] = useState("");
    const [pdfURL, setPdfURL] = useState("");
    const [file, setFile] = useState(0);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [toggleStates, setToggleState] = useState({
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
    });
    const [modal, setModal] = useState(false);
    const [blobProviderRerender, setBlobProviderRerender] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const pdfData = {
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate,
        billFromBusinessName:
            resolvedUser?.result?.profile?.businessName || resolvedUser?.profile?.businessName,
        billFromAddress: singleQuoteReq?.portOfLoading.address,
        billToBusinessName: ffShipment?.freightForwarder?.profile?.businessName,
        billToAddress: ffShipment?.freightForwarder?.profile?.businessAddress?.address,
        countryOfSupply: ffShipment ? regionNames.of(ffShipment?.origin.country) : undefined,
        portOfLoading: singleQuoteReq?.portOfLoading.address,
        portOfDestination: singleQuoteReq?.portOfDestination?.address,
        pickupAddress: singleQuoteReq?.pickupAddress.address,
        loadType: singleQuoteReq?.loadType,
        incoterms: ffShipment?.incoterms,
        shipmentList:
            ffShipment?.packageType === "containers"
                ? ffShipment?.containers
                : ffShipment?.packages,
        isContainers: ffShipment?.packageType === "containers",
        goodsDetails: ffShipment?.goodsDetails,
        customCharges,
        exportCharges,
        importCharges,
        EXWCharges,
        terms,
    };

    const pdfFileName = `freight-quote-${Date.now() + Math.random()}.pdf`;

    const toggleAccordion = (idx) => {
        setToggleState((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const isDateFromTomorrow = (event) => {
        const selectedDate = event.target.value;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().slice(0, 10);
        if (selectedDate < tomorrowString) {
            setErrorMessage("Please choose a date starting from tomorrow.");
            setDueDate("");
        } else {
            setDueDate(selectedDate);
            setErrorMessage("");
        }
    };

    useEffect(() => {
        const updateAllCurrValue = (setItemArr) => {
            setItemArr((prev) => {
                const updateArr = prev.map((item) => ({ ...item, currency: selectedCurrency }));
                return updateArr;
            });
        };

        updateAllCurrValue(setCustomCharges);
        updateAllCurrValue(setExportCharges);
        updateAllCurrValue(setImportCharges);
        updateAllCurrValue(setEXWCharges);
    }, [selectedCurrency]);

    useEffect(() => {
        if (!globalFFUser && !user) {
            return navigate("/");
        }
        if (resolvedUser && !ffShipment) {
            dispatch(shipmentActions.fetchFFSingleShipment(resolvedUser.shipmentId));
        }

        if (resolvedUser && !singleQuoteReq) {
            dispatch(quoteActions.fetchSingleQuoteRequest(resolvedUser.quoteRequestId));
        }
    }, [user, globalFFUser, ffShipment, singleQuoteReq]);

    const createQuote = (evt) => {
        evt.preventDefault();
        const nonIsFilled = Object.values(toggleStates).filter((bool) => bool).length;
        if (!nonIsFilled) {
            setToggleState((prev) => ({ ...prev, 0: true }));
            return;
        }
        setBlobProviderRerender(1);
    };

    useEffect(() => {
        if (file) {
            firebaseService.uploadFile(`relayApp/${pdfFileName}`, file, (url) => setPdfURL(url));
        }
    }, [file]);

    const itemHasValue = (listObj) => {
        return Boolean(Object.values(listObj).join(""));
    };

    const isItemsListValid = (list) => {
        return list
            .map((obj) => {
                const requiredSections = Object.keys(obj).filter((key) => key !== "currency");
                return requiredSections.map((key) => obj[key]).join("");
            })
            .filter((list) => list).length;
    };

    useEffect(() => {
        if (pdfURL === "error") {
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    message={"Error creating quote request. Please try again."}
                    type="error"
                />
            ));
        }

        if (pdfURL && pdfURL !== "error") {
            const reqData = {
                quoteRequestId: resolvedUser.quoteRequestId,
                importCharges: isItemsListValid(importCharges) ? importCharges : undefined,
                exportCharges: isItemsListValid(exportCharges) ? exportCharges : undefined,
                customCharges: isItemsListValid(customCharges) ? customCharges : undefined,
                exwCharges: isItemsListValid(EXWCharges) ? EXWCharges : undefined,
                dueDate,
                terms: terms ? terms : undefined,
                template: true,
                templateName: pdfFileName,
                file: {
                    filename: pdfFileName,
                    path: pdfURL,
                },
            };
            dispatch(quoteActions.createQuoteForQuoteReq(reqData));
            return;
        }
    }, [pdfURL]);

    useEffect(() => {
        if (createQuoteForReqLoading || pdfURL === "error") {
            setUploadLoading(false);
        }
    }, [createQuoteForReqLoading, pdfURL]);

    useEffect(() => {
        if (createQuoteForReq) {
            setModal(true);
        }
    }, [createQuoteForReq]);

    if (ffShipmentLoading || singleQuoteReqLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <>
            {ffShipment && singleQuoteReq && (
                <>
                    <NavOne />

                    <div className="px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] mt-20 mb-28">
                        <img src={logo} width={"100px"} height={"100px"} alt="TradeAlly Logo" />

                        <div className="flex mt-14 justify-between max-lg:flex-col-reverse">
                            <form
                                className="w-full lg:basis-[450px] 1100:basis-[60%] mr-auto"
                                onSubmit={createQuote}
                            >
                                <>
                                    <FormTitle
                                        title={"Date"}
                                        toggleAccordion={toggleAccordion}
                                        toggleStates={toggleStates}
                                        index={0}
                                    />
                                    {toggleStates[0] && (
                                        <div className={`flex justify-between items-center pt-7`}>
                                            <label
                                                className="text-sm font-rocGroteskMedium basis-[48.5%] cursor-pointer"
                                                htmlFor="issueDate"
                                            >
                                                Issued date
                                                <input
                                                    type={"date"}
                                                    name="issueDate"
                                                    value={new Date().toISOString().slice(0, 10)}
                                                    id="issueDate"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                                    disabled
                                                />
                                            </label>
                                            <label
                                                className="text-sm font-rocGroteskMedium basis-[48.5%] cursor-pointer relative"
                                                htmlFor="dueDate"
                                            >
                                                Due date
                                                <input
                                                    type={"date"}
                                                    id="dueDate"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                                    placeholder="Select due date"
                                                    required
                                                    onChange={isDateFromTomorrow}
                                                />
                                                <span
                                                    className={`text-red-600 text-[13px] font-rocGroteskRegular translate-y-1 ${
                                                        errorMessage
                                                            ? "absolute left-0 -bottom-[18px]"
                                                            : "hidden"
                                                    }`}
                                                >
                                                    {errorMessage}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </>
                                <>
                                    <FormTitle
                                        title={"Trip Details"}
                                        toggleAccordion={toggleAccordion}
                                        toggleStates={toggleStates}
                                        index={1}
                                    />
                                    {toggleStates[1] && (
                                        <div className="grid grid-cols-2 gap-y-5 gap-x-[3%] mt-7 mb-4">
                                            <div>
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Country of Supply
                                                </p>
                                                <input
                                                    value={regionNames.of(
                                                        ffShipment.origin.country
                                                    )}
                                                    id="countryOfSupply"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                                    disabled
                                                />
                                            </div>

                                            <div>
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Pickup Address
                                                </p>
                                                <input
                                                    value={singleQuoteReq.pickupAddress.address}
                                                    id="pickupAddress"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Port of Loading
                                                </p>
                                                <input
                                                    value={singleQuoteReq.portOfLoading.address}
                                                    id="portOfLoading"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Port of Destination
                                                </p>
                                                <input
                                                    value={singleQuoteReq.portOfDestination.address}
                                                    id="portOfDestination"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Load Type
                                                </p>
                                                <input
                                                    value={singleQuoteReq.loadType}
                                                    id="loadType"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Incoterms
                                                </p>
                                                <input
                                                    value={ffShipment.incoterms}
                                                    id="Incoterms"
                                                    className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>

                                <>
                                    <FormTitle
                                        title={"Enter Customs Charges"}
                                        toggleAccordion={toggleAccordion}
                                        toggleStates={toggleStates}
                                        index={2}
                                    />

                                    {toggleStates[2] && (
                                        <>
                                            {customCharges.map((charge, index) => (
                                                <Item
                                                    key={index}
                                                    item={charge}
                                                    setItems={setCustomCharges}
                                                    index={index}
                                                    isLast={customCharges.length - 1 === index}
                                                    isRequired={itemHasValue(charge)}
                                                    selectedCurrency={selectedCurrency}
                                                    setSelectedCurrency={setSelectedCurrency}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>

                                <>
                                    <FormTitle
                                        title={"Enter Export Charges"}
                                        toggleAccordion={toggleAccordion}
                                        toggleStates={toggleStates}
                                        index={3}
                                    />
                                    {toggleStates[3] && (
                                        <>
                                            {exportCharges.map((charge, index) => (
                                                <Item
                                                    key={index}
                                                    item={charge}
                                                    setItems={setExportCharges}
                                                    index={index}
                                                    isLast={exportCharges.length - 1 === index}
                                                    isRequired={itemHasValue(charge)}
                                                    selectedCurrency={selectedCurrency}
                                                    setSelectedCurrency={setSelectedCurrency}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>

                                <>
                                    <FormTitle
                                        title={"Add Import Charges"}
                                        toggleAccordion={toggleAccordion}
                                        toggleStates={toggleStates}
                                        index={4}
                                    />
                                    {toggleStates[4] && (
                                        <>
                                            {" "}
                                            {importCharges.map((charge, index) => (
                                                <Item
                                                    key={index}
                                                    item={charge}
                                                    setItems={setImportCharges}
                                                    index={index}
                                                    isLast={importCharges.length - 1 === index}
                                                    isRequired={itemHasValue(charge)}
                                                    selectedCurrency={selectedCurrency}
                                                    setSelectedCurrency={setSelectedCurrency}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>

                                <>
                                    <FormTitle
                                        title={"Add EXW Charges"}
                                        toggleAccordion={toggleAccordion}
                                        toggleStates={toggleStates}
                                        index={5}
                                    />
                                    {toggleStates[5] && (
                                        <>
                                            {EXWCharges.map((charge, index) => (
                                                <Item
                                                    key={index}
                                                    item={charge}
                                                    setItems={setEXWCharges}
                                                    index={index}
                                                    isLast={EXWCharges.length - 1 === index}
                                                    isRequired={itemHasValue(charge)}
                                                    selectedCurrency={selectedCurrency}
                                                    setSelectedCurrency={setSelectedCurrency}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>

                                <FormTitle
                                    title={"Terms and Conditions"}
                                    toggleAccordion={toggleAccordion}
                                    toggleStates={toggleStates}
                                    index={6}
                                />

                                {toggleStates[6] && (
                                    <>
                                        <textarea
                                            id="terms"
                                            placeholder="(Optional) Add your terms and conditions here"
                                            className="border mt-3 h-24 resize-none border-gray-200 p-3 outline-0 w-full text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                            onChange={(evt) => setTerms(evt.target.value)}
                                        />
                                    </>
                                )}

                                <button
                                    className="w-max bg-pacific-cyan block text-center text-mvx-black py-3 px-9 mt-8 text-sm font-rocGroteskMedium disabled:bg-pacific-cyan/60"
                                    type="submit"
                                    disabled={uploadLoading || createQuoteForReqLoading}
                                >
                                    {uploadLoading || createQuoteForReqLoading ? (
                                        <Loader color="white" className={"mx-[34.5px]"} />
                                    ) : (
                                        "Create Quote"
                                    )}
                                </button>
                            </form>

                            <div className="border rounded p-5 w-full lg:basis-[360px] h-max lg:sticky top-16 max-lg:mb-16">
                                <p className="text-mvx-black font-rocGroteskBold text-xl mb-3">
                                    Shipment Details
                                </p>
                                <PackageContainerList
                                    list={
                                        ffShipment.packageType === "containers"
                                            ? ffShipment.containers
                                            : ffShipment.packages
                                    }
                                    goodsDetails={ffShipment.goodsDetails}
                                    isContainers={ffShipment.packageType === "containers"}
                                />
                            </div>
                        </div>
                    </div>

                    <LandingSubFooter onBoardType />
                    <LandingFooter />
                </>
            )}

            <>
                {blobProviderRerender ? (
                    <PDFBlob
                        pdfData={pdfData}
                        pdfFileName={pdfFileName}
                        setFile={setFile}
                        rerenderTrue={blobProviderRerender}
                        key={blobProviderRerender}
                        setLoading={setUploadLoading}
                    />
                ) : (
                    <></>
                )}
            </>

            {modal && (
                <SuccessModal
                    closeModal={() => {
                        dispatch(quoteActions.resetCreateQuoteForReqSuccess());
                        setModal(false);
                        navigate("/");
                    }}
                    pdfFileName={pdfFileName}
                    shipmentData={{
                        mvxId: ffShipment.mvxid,
                        ff: resolvedUser?.result?.fullName || resolvedUser?.fullName,
                    }}
                    pdfData={pdfData}
                />
            )}
        </>
    );
};

const FormTitle = ({ title, index, toggleAccordion, toggleStates }) => (
    <p
        className={`flex justify-between items-center text-sm font-rocGroteskMedium bg-mvx-light-blue py-2 px-3 cursor-pointer ${
            index && `${toggleStates[index] ? "mt-7" : "mt-9"}`
        }`}
        onClick={() => toggleAccordion(index)}
    >
        {title}{" "}
        <span className="material-icons !text-lg font-semibold fill-mvx-black transition-all duration-300">
            {toggleStates[index] ? "remove" : "add"}
        </span>
    </p>
);

const PDFBlob = ({ pdfData, pdfFileName, setFile, rerenderTrue, setLoading }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        if (Boolean(rerenderTrue) && isReady) {
            document.getElementById("pdfPreview").click();
        }
    }, [rerenderTrue, isReady]);

    return (
        <>
            <BlobProvider document={<QuoteDoc {...pdfData} />} fileName={pdfFileName}>
                {({ blob, url, loading, error }) => {
                    setIsReady(!loading);
                    return (
                        <button
                            type="button"
                            id="pdfPreview"
                            className="hidden"
                            onClick={() => {
                                setFile(blob);
                            }}
                        >
                            {loading ? "Loading..." : <>''</>}
                        </button>
                    );
                }}
            </BlobProvider>
        </>
    );
};

const SuccessModal = ({ closeModal, pdfData, pdfFileName, shipmentData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <>
            <ModalContainer closeModal={closeModal}>
                <div className="bg-white rounded-lg shadow-modalShadow min-w-[320px] max-w-[450px] pt-12 -mt-20">
                    {/* <SuccessIcon className="mx-auto" /> */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_80/v1687187488/Web%20App/external_pages/success_q1oaal.svg"
                        }
                        alt="success"
                        className="mx-auto"
                    />
                    <p className="text-gun-metal font-rocGroteskBold text-[19px] mb-7 text-center mt-7 mx-4">
                        Quote Created
                        <br />
                        <span className="text-sm font-rocGroteskMedium block mt-[10px]">
                            Your quote for Shipment TA{shipmentData.mvxId} has been created and sent
                            to {shipmentData.ff}. Download to save a copy.
                        </span>
                    </p>

                    <div className="flex border-t">
                        <button
                            className="basis-1/2 border-r h-16 bg-white text-mvx-neutral text-sm font-rocGroteskMedium"
                            onClick={() => {
                                dispatch(authActions.logOut());
                                navigate("/");
                            }}
                        >
                            CLOSE
                        </button>
                        <button
                            className="basis-1/2 h-16 bg-mvx-light-blue text-gun-metal font-rocGroteskBold text-sm"
                            onClick={() => document.getElementById("pdfBtn").click()}
                        >
                            DOWNLOAD QUOTE
                        </button>
                    </div>
                </div>
            </ModalContainer>

            <PDFDownloadLink document={<QuoteDoc {...pdfData} />} fileName={pdfFileName}>
                {({ blob, loading, error }) => {
                    return (
                        <button type="button" id="pdfBtn" className="hidden">
                            {loading ? "Loading..." : "Download Invoice"}
                        </button>
                    );
                }}
            </PDFDownloadLink>
        </>
    );
};

export default CreateQuote;
