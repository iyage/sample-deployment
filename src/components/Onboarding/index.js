/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { authActions } from "actions";
import { appActions } from "actions/appActions";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import { getFromStorage, saveToStorage } from "helpers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authService } from "services";
import { firebaseService } from "services/firebaseService";
import BusinessInformation from "./common/BusinessInformation";
import DocumentUpload from "./common/DocumentUpload";
import ReviewAndSubmit from "./common/ReviewAndSubmit";
import TradeLanes from "./common/TradeLanes";

const Onboarding = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [address, setAddress] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { updateBusinessProfileLoading, updateBusinessProfile } = useSelector(
        (state) => state.app
    );
    const { ffProfile, verifyByMailSuccess } = useSelector((state) => state.auth);
    const [user, setUser] = useState(getFromStorage("tradeAlly-user"));

    const [businessInfoData, setBusinessInfoData] = useState({
        businessName: "",
        freightForwardingMode: [],
        businessType: "",
        registrationNo: "",
    });
    const [tradeLanes, setTradeLanes] = useState();
    const [documentData, setDocumentData] = useState({
        cac: {
            name: "CAC",
            file: "",
            optional: false,
        },
        git: {
            name: "GIT",
            file: "",
            optional: true,
        },
        memorandumOfAssociation: {
            name: "MOA",
            file: "",
            optional: false,
        },
        idCard: {
            name: "ID",
            file: "",
            optional: false,
        },
    });
    const [documents, setDocuments] = useState({
        cac: {},
        git: {},
        memorandumOfAssociation: {},
        idCard: {},
    });
    const [documentLoading, setDocumentLoading] = useState({
        cac: false,
        git: false,
        memorandumOfAssociation: false,
        idCard: false,
    });
    const steps = ["Business Information", "Document upload", "Trade Lanes", "Review and submit"];

    const canUserContinue = (step) => {
        const areBusinessInfoFieldsFilled = [
            ...Object.values(businessInfoData).map((value) => Boolean(value)),
            Boolean(address?.businessAddress),
        ];
        const areDocumentsUploaded = [
            ...Object.values(documentData)
                ?.filter((t) => !t?.optional)
                .map(({ file }) => Boolean(file)),
        ];
        const areLanesSelected =
            tradeLanes?.length > 0 ? tradeLanes?.map((value) => Boolean(value)) : [false];

        switch (step) {
            case 0:
                return areBusinessInfoFieldsFilled;
            case 1:
                return [...areBusinessInfoFieldsFilled, ...areDocumentsUploaded];
            case 2:
                return [
                    ...areBusinessInfoFieldsFilled,
                    ...areDocumentsUploaded,
                    ...areLanesSelected,
                ];

            default:
                return areBusinessInfoFieldsFilled;
        }
    };

    const areFieldsFilled = canUserContinue(activeStep);

    const handleUpload = (name, fileName, file) => {
        setDocumentLoading((prevState) => ({ ...prevState, [name]: true }));
        setDocumentData((prev) => ({
            ...prev,
            [name]: { name: prev[name].name, file: "" },
        }));

        firebaseService.uploadFile(`relayApp/${fileName}`, file, (url) => {
            setDocumentData((prev) => ({
                ...prev,
                [name]: { name: prev[name].name, file: url !== "error" ? url : "" },
            }));
            setDocumentLoading((prevState) => ({
                ...prevState,
                [name]: false,
            }));
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (activeStep !== steps.length - 1) {
            return setActiveStep((prev) => {
                return prev + 1;
            });
        }

        const body = {
            businessName: businessInfoData.businessName,
            mode: businessInfoData.freightForwardingMode,
            businessType: businessInfoData.businessType,
            businessAddress: address?.businessAddress,
            businessNumber: businessInfoData.registrationNo,
            businessDocs: Object.values(documentData)
                ?.filter((d) => !!d?.file)
                .map((value) => value),
            tradeLanes: tradeLanes,
        };

        return dispatch(appActions.updateBusinessProfile(body));
    };

    const displayStepSection = () => {
        switch (activeStep) {
            case 0:
                return (
                    <BusinessInformation
                        businessInfoData={businessInfoData}
                        setBusinessInfoData={setBusinessInfoData}
                        address={address}
                        setAddress={setAddress}
                    />
                );
            case 1:
                return (
                    <DocumentUpload
                        documentData={documentData}
                        documentLoading={documentLoading}
                        documents={documents}
                        setDocuments={setDocuments}
                        handleUpload={handleUpload}
                    />
                );
            case 2:
                return (
                    <TradeLanes
                        // handleSelectTradeLane={handleSelectTradeLane}
                        // activeTradeLanes={activeTradeLanes}
                        // handleSelectAllTradeLanes={handleSelectAllTradeLanes}
                        setTradeLanes={setTradeLanes}
                        tradeLanes={tradeLanes}
                    />
                );
            case 3:
                return (
                    <ReviewAndSubmit
                        documentData={documentData}
                        businessInfoData={businessInfoData}
                        address={address}
                        setActiveStep={setActiveStep}
                        documentLoading={documentLoading}
                        documents={documents}
                        setDocuments={setDocuments}
                        handleUpload={handleUpload}
                    />
                );
            default:
                return (
                    <BusinessInformation
                        businessInfoData={businessInfoData}
                        setBusinessInfoData={setBusinessInfoData}
                        address={address}
                        setAddress={setAddress}
                    />
                );
        }
    };

    useEffect(() => {
        if (user && !user?.result?.profile?.businessName && !ffProfile) {
            dispatch(authActions.fetchFreightForwarderProfile(user._id));
        }
    }, [user, ffProfile, dispatch]);

    useEffect(() => {
        if (ffProfile?.result) {
            const updatedUserProfile = { ...user, ...ffProfile.result };
            saveToStorage("tradeAlly-user", updatedUserProfile);
        }
    }, [ffProfile, user]);

    // restrict to allow only users that have not completed onboarding
    useEffect(() => {
        const hasOnboarded =
            Boolean(ffProfile?.result?.profile?.businessName) &&
            Boolean(ffProfile?.result?.profile?.businessNumber) &&
            Boolean(ffProfile?.result?.profile?.businessType) &&
            ffProfile?.result?.profile?.mode?.length > 0;

        if (user && hasOnboarded) {
            navigate("/dashboard/home", { replace: true });
        }

        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [navigate, user, ffProfile]);

    useEffect(() => {
        if (Boolean(updateBusinessProfile)) {
            navigate("/dashboard/home");

            dispatch(appActions.resetUpdateBizProfile());
            verifyByMailSuccess && authService.saveAccount(verifyByMailSuccess);
        }
    }, [updateBusinessProfile, navigate, dispatch]);

    if (!ffProfile) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavOne />
            <div className="w-full mt-16 px-[120px] max-lg:px-10 max-sm:px-4 max-lg:mt-10">
                <div className="w-full flex gap-[98px]">
                    <div className="font-rocGroteskMedium max-lg:hidden">
                        {steps.map((step, idx) => (
                            <div key={step} className="mb-4">
                                <p
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => {
                                        if (idx < steps.length - 1) {
                                            setActiveStep(idx);
                                        }
                                    }}
                                >
                                    <span
                                        className={`material-icons text-[8px] ${
                                            activeStep === idx
                                                ? "text-mvx-black hover:text-mvx-black"
                                                : "text-mvx-neutral"
                                        }`}
                                    >
                                        fiber_manual_record
                                    </span>
                                    <span
                                        className={`${
                                            activeStep === idx
                                                ? "underline text-mvx-black"
                                                : " text-mvx-neutral"
                                        } hover:underline hover:text-mvx-black whitespace-nowrap`}
                                    >
                                        {step}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="w-[50%] max-lg:w-full">
                        <span
                            onClick={() => {
                                if (activeStep > 0) {
                                    setActiveStep((prev) => prev - 1);
                                }
                            }}
                            className={`material-icons-outlined text-lg font-semibold mb-3 hidden ${
                                activeStep > 0 && "max-lg:block"
                            }`}
                        >
                            arrow_back
                        </span>
                        <div className="mb-6">
                            <p className="mb-3 font-rocGroteskMedium text-mvx-neutral text-sm">
                                Step {activeStep + 1} of {steps?.length}
                            </p>
                            <div className="w-full h-1 bg-[#DFE1E6]">
                                <div
                                    style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                                    className={` h-1 bg-[#142837]`}
                                ></div>
                            </div>
                        </div>
                        <div>{displayStepSection()}</div>
                        <div className="mt-4 mb-8 flex justify-between items-center">
                            <div>
                                {activeStep === 2 && !canUserContinue(1).includes(false) && (
                                    <p
                                        onClick={() => {
                                            setActiveStep((prev) => prev + 1);
                                        }}
                                        className="underline cursor-pointer font-rocGroteskMedium text-mvx-neutral text-sm"
                                    >
                                        I'll do this later
                                    </p>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={
                                        activeStep === steps.length - 1
                                            ? false
                                            : areFieldsFilled.includes(false)
                                    }
                                    className={`rounded text-white flex items-center justify-center disabled:bg-mvx-light-blue py-3 px-6 ${
                                        activeStep === steps.length - 1
                                            ? "bg-pacific-cyan text-white"
                                            : "bg-pacific-cyan text-white"
                                    } disabled:text-mvx-neutral  font-rocGroteskMedium text-sm`}
                                >
                                    {updateBusinessProfileLoading ? (
                                        <Loader color={"gun-metal"} />
                                    ) : activeStep === steps.length - 1 ? (
                                        "Proceed to dashboard"
                                    ) : (
                                        "Continue"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                    {activeStep === 1 && (
                        <div className="w-[25%] max-lg:hidden">
                            <div className="border p-6 mt-14">
                                <span className="material-icons mb-6 text-4xl">info</span>
                                <div className="mb-6">
                                    <p className="font-rocGroteskBold text-base text-gun-metal">
                                        Tips for uploading documents
                                    </p>
                                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                        Follow this tips for easy upload
                                    </p>
                                </div>
                                <div className="pb-6 border-b mb-6">
                                    <div className="mb-3">
                                        <p className="flex items-center gap-2">
                                            <span className="material-icons text-[6px] text-mvx-black">
                                                fiber_manual_record
                                            </span>
                                            <span className="text-gun-metal text-sm font-rocGroteskMedium">
                                                Make sure ID numbers are visible
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="flex items-center gap-2">
                                            <span className="material-icons text-[6px] text-mvx-black">
                                                fiber_manual_record
                                            </span>
                                            <span className="text-gun-metal text-sm font-rocGroteskMedium">
                                                Use clear, non-blurry photos
                                            </span>
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="flex  gap-2">
                                            <span className="material-icons text-[6px] text-mvx-black mt-2">
                                                fiber_manual_record
                                            </span>
                                            <span className="text-gun-metal text-sm font-rocGroteskMedium">
                                                If applicable, make sure your photo is visible
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="material-icons mb-4 text-4xl">lock</span>
                                    <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                        At Fleet+, we take your privacy seriously. Rest assured that
                                        all documents uploaded will be kept secure and confidential
                                        and will not be shared with any third party.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
