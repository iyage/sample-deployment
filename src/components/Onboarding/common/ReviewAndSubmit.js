// import { PdfUploadedIcon } from "assets/arts";
import Loader from "components/common/Loader";
import { getFromStorage } from "helpers";
import React, { useState } from "react";

const ReviewAndSubmit = ({
    documentData,
    businessInfoData,
    address,
    setActiveStep,
    documentLoading,
    documents,
    setDocuments,
    handleUpload,
}) => {
    const [activeTab, setActiveTab] = useState(1);
    const user = getFromStorage("tradeAlly-user");

    const PersonalInfo = () => {
        return (
            <div>
                {/* <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Full name
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {user?.fullName}
                        </p>
                    </div>
                </div> */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">Email</p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {user?.email}
                        </p>
                    </div>
                </div>
                {/* <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Phone number
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {user?.mobile}
                        </p>
                    </div>
                </div> */}
            </div>
        );
    };

    const BusinessInfo = () => {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Legal Business Name
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {businessInfoData.businessName}
                        </p>
                    </div>
                    <div>
                        <p
                            onClick={() => setActiveStep(0)}
                            className="underline cursor-pointer text-sm font-rocGroteskMedium"
                        >
                            Edit
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Business address
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {address?.businessAddress?.address}
                        </p>
                    </div>
                    <div>
                        <p
                            onClick={() => setActiveStep(0)}
                            className="underline cursor-pointer text-sm font-rocGroteskMedium"
                        >
                            Edit
                        </p>
                    </div>
                </div>
                {/* <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Phone number
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {user.mobile}
                        </p>
                    </div>
                </div> */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Freight Forwarding Mode
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium capitalize">
                            {businessInfoData.freightForwardingMode}
                        </p>
                    </div>
                    <div>
                        <p
                            onClick={() => setActiveStep(0)}
                            className="underline cursor-pointer text-sm font-rocGroteskMedium"
                        >
                            Edit
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Business Type
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium capitalize">
                            {businessInfoData.businessType}
                        </p>
                    </div>
                    <div>
                        <p
                            onClick={() => setActiveStep(0)}
                            className="underline cursor-pointer text-sm font-rocGroteskMedium"
                        >
                            Edit
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-1">
                            Registration Number
                        </p>
                        <p className="text-sm text-gun-metal font-rocGroteskMedium">
                            {businessInfoData.registrationNo}
                        </p>
                    </div>
                    <div>
                        <p
                            onClick={() => setActiveStep(0)}
                            className="underline cursor-pointer text-sm font-rocGroteskMedium"
                        >
                            Edit
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const Documents = () => {
        return (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                <div className="relative flex flex-col w-full cursor-pointer">
                    <div className="py-9 pl-6 border cursor-pointer border-dashed w-full">
                        <>
                            <div className="mb-2">
                                {documents.cac?.type?.includes("application") ? (
                                    // <PdfUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                        }
                                        alt="pdf Uploaded Icon"
                                    />
                                ) : documents.cac?.type?.includes("image") ? (
                                    // <ImageUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                                        }
                                        alt="pictorial Uploaded Icon"
                                    />
                                ) : (
                                    <span className="material-icons-outlined text-4xl text-mvx-neutral ml-[-4px]">
                                        note_add
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                    CAC or Business registration
                                </p>
                                {documentLoading.cac ? (
                                    <Loader color="mvx-black" />
                                ) : (
                                    <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                        {Boolean(documents.cac?.name)
                                            ? "File uploaded successfully"
                                            : "JPEG or PNG only"}
                                    </p>
                                )}
                            </div>
                        </>
                    </div>
                    <input
                        type={"file"}
                        name="cac"
                        onChange={(event) => {
                            setDocuments((prevState) => {
                                return {
                                    ...prevState,
                                    cac: event.target.files[0],
                                };
                            });
                            handleUpload("cac", event.target.files[0].name, event.target.files[0]);
                        }}
                        className="w-full h-full absolute cursor-pointer opacity-0"
                        accept=".pdf,.jpeg,.png"
                    />
                    {Boolean(documentData.cac.file) && (
                        <div className="mt-2">
                            <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                Change File
                            </p>
                        </div>
                    )}
                </div>
                <div className="relative flex flex-col w-full cursor-pointer">
                    <div className="py-9 pl-6 border cursor-pointer border-dashed w-full">
                        <>
                            <div className="mb-2">
                                {documents.git?.type?.includes("application") ? (
                                    // <PdfUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                        }
                                        alt="pdf Uploaded Icon"
                                    />
                                ) : documents.git?.type?.includes("image") ? (
                                    // <ImageUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                                        }
                                        alt="pictorial Uploaded Icon"
                                    />
                                ) : (
                                    <span className="material-icons-outlined text-4xl text-mvx-neutral ml-[-4px]">
                                        note_add
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                    GIT insurance
                                </p>
                                {documentLoading.git ? (
                                    <Loader color="mvx-black" />
                                ) : (
                                    <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                        {Boolean(documents.git?.name)
                                            ? "File uploaded successfully"
                                            : "JPEG or PNG only"}
                                    </p>
                                )}
                            </div>
                        </>
                    </div>
                    <input
                        type={"file"}
                        name="git"
                        onChange={(event) => {
                            setDocuments((prevState) => {
                                return {
                                    ...prevState,
                                    git: event.target.files[0],
                                };
                            });
                            handleUpload("git", event.target.files[0].name, event.target.files[0]);
                        }}
                        className="w-full h-full absolute cursor-pointer opacity-0"
                        accept=".pdf,.jpeg,.png"
                    />
                    {Boolean(documentData.git.file) && (
                        <div className="mt-2">
                            <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                Change File
                            </p>
                        </div>
                    )}
                </div>
                <div className="relative flex flex-col w-full cursor-pointer">
                    <div className="py-9 pl-6 border cursor-pointer border-dashed w-full">
                        <>
                            <div className="mb-2">
                                {documents.memorandumOfAssociation?.type?.includes(
                                    "application"
                                ) ? (
                                    // <PdfUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                        }
                                        alt="pdf Uploaded Icon"
                                    />
                                ) : documents.memorandumOfAssociation?.type?.includes("image") ? (
                                    // <ImageUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                                        }
                                        alt="pictorial Uploaded Icon"
                                    />
                                ) : (
                                    <span className="material-icons-outlined text-4xl text-mvx-neutral ml-[-4px]">
                                        note_add
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                    Memorandum of Association
                                </p>
                                {documentLoading.memorandumOfAssociation ? (
                                    <Loader color="mvx-black" />
                                ) : (
                                    <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                        {Boolean(documents.memorandumOfAssociation?.name)
                                            ? "File uploaded successfully"
                                            : "JPEG or PNG only"}
                                    </p>
                                )}
                            </div>
                        </>
                    </div>
                    <input
                        type={"file"}
                        name="memorandumOfAssociation"
                        onChange={(event) => {
                            setDocuments((prevState) => {
                                return {
                                    ...prevState,
                                    memorandumOfAssociation: event.target.files[0],
                                };
                            });
                            handleUpload(
                                "memorandumOfAssociation",
                                event.target.files[0].name,
                                event.target.files[0]
                            );
                        }}
                        className="w-full h-full absolute cursor-pointer opacity-0"
                        accept=".pdf,.jpeg,.png"
                    />
                    {Boolean(documentData.memorandumOfAssociation.file) && (
                        <div className="mt-2">
                            <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                Change File
                            </p>
                        </div>
                    )}
                </div>
                <div className="relative flex flex-col w-full cursor-pointer">
                    <div className="py-9 pl-6 border cursor-pointer border-dashed w-full">
                        <>
                            <div className="mb-2">
                                {documents.idCard?.type?.includes("application") ? (
                                    // <PdfUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                        }
                                        alt="pdf Uploaded Icon"
                                    />
                                ) : documents.idCard?.type?.includes("image") ? (
                                    // <ImageUploadedIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                                        }
                                        alt="pictorial Uploaded Icon"
                                    />
                                ) : (
                                    <span className="material-icons-outlined text-4xl text-mvx-neutral ml-[-4px]">
                                        note_add
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                    I.D Card of Director
                                </p>
                                {documentLoading.idCard ? (
                                    <Loader color="mvx-black" />
                                ) : (
                                    <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                        {Boolean(documents.idCard?.name)
                                            ? "File uploaded successfully"
                                            : "JPEG or PNG only"}
                                    </p>
                                )}
                            </div>
                        </>
                    </div>
                    <input
                        type={"file"}
                        name="idCard"
                        onChange={(event) => {
                            setDocuments((prevState) => {
                                return {
                                    ...prevState,
                                    idCard: event.target.files[0],
                                };
                            });
                            handleUpload(
                                "idCard",
                                event.target.files[0].name,
                                event.target.files[0]
                            );
                        }}
                        className="w-full h-full absolute cursor-pointer opacity-0"
                        accept=".pdf,.jpeg,.png"
                    />
                    {Boolean(documentData.idCard.file) && (
                        <div className="mt-2">
                            <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                Change File
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const displayTab = () => {
        switch (activeTab) {
            case 1:
                return <PersonalInfo />;
            case 2:
                return <BusinessInfo />;
            case 3:
                return <Documents />;

            default:
                return <PersonalInfo />;
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h3 className="font-rocGroteskBold text-[22px] text-[#142837] mb-2">
                    Review and submit
                </h3>
                <p className="text-[#142837] font-rocGroteskMedium text-sm">
                    Double check and make sure your information is correct before submitting.
                </p>
            </div>
            <div className="mb-5">
                <div className="">
                    <div>
                        <div className="flex justify-between">
                            <div
                                onClick={() => setActiveTab(1)}
                                className={`flex gap-1 items-center ${
                                    activeTab === 1 && "border-b-2 border-gun-metal"
                                } w-fit py-3 cursor-pointer`}
                            >
                                <p className="text-[15px] font-rocGroteskMedium text-mvx-neutral px-2">
                                    Personal Information
                                </p>
                            </div>
                            <div
                                onClick={() => setActiveTab(2)}
                                className={`flex gap-1 items-center ${
                                    activeTab === 2 && "border-b-2 border-gun-metal"
                                } w-fit py-3 cursor-pointer`}
                            >
                                <p className="text-[15px] font-rocGroteskMedium text-mvx-neutral px-5">
                                    Business Information
                                </p>
                            </div>
                            <div
                                onClick={() => setActiveTab(3)}
                                className={`flex gap-1 items-center ${
                                    activeTab === 3 && "border-b-2 border-gun-metal"
                                } w-fit py-3 cursor-pointer`}
                            >
                                <p className="text-[15px] font-rocGroteskMedium text-mvx-neutral px-5">
                                    Documents
                                </p>
                            </div>
                        </div>

                        <hr className="mb-3" />
                    </div>
                </div>
            </div>
            <div>{displayTab()}</div>
        </div>
    );
};

export default ReviewAndSubmit;
