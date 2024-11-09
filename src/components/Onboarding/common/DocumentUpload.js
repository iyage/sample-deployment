// import { PdfUploadedIcon } from "assets/arts";
import Loader from "components/common/Loader";
import React from "react";

const DocumentUpload = ({
    documentData,
    documentLoading,
    documents,
    setDocuments,
    handleUpload,
}) => {
    return (
        <div>
            <div className="mb-8">
                <h3 className="font-rocGroteskBold text-[22px] text-[#142837] mb-2">
                    Upload Business Documents
                </h3>
                <p className="text-[#142837] font-rocGroteskMedium text-sm">
                    Acceptable file types are .PDF, .JPG, and .PNG
                </p>
            </div>
            <div className="pb-6 mb-6 border-b">
                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-x-3 gap-y-4">
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
                            disabled={
                                documentLoading.idCard ||
                                documentLoading.cac ||
                                documentLoading.git ||
                                documentLoading.memorandumOfAssociation
                            }
                            onChange={(event) => {
                                setDocuments((prevState) => {
                                    return {
                                        ...prevState,
                                        cac: event.target.files[0],
                                    };
                                });
                                handleUpload(
                                    "cac",
                                    event.target.files[0].name,
                                    event.target.files[0]
                                );
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
                                        GIT insurance (optional)
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
                            disabled={
                                documentLoading.idCard ||
                                documentLoading.cac ||
                                documentLoading.git ||
                                documentLoading.memorandumOfAssociation
                            }
                            onChange={(event) => {
                                setDocuments((prevState) => {
                                    return {
                                        ...prevState,
                                        git: event.target.files[0],
                                    };
                                });
                                handleUpload(
                                    "git",
                                    event.target.files[0].name,
                                    event.target.files[0]
                                );
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
                                    ) : documents.memorandumOfAssociation?.type?.includes(
                                          "image"
                                      ) ? (
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
                            disabled={
                                documentLoading.idCard ||
                                documentLoading.cac ||
                                documentLoading.git ||
                                documentLoading.memorandumOfAssociation
                            }
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
                                    {/* <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                            {Boolean(documents.idCard?.name)
                                                ? "File uploaded successfully"
                                                : "JPEG or PNG only"}
                                        </p> */}
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
                            disabled={
                                documentLoading.idCard ||
                                documentLoading.cac ||
                                documentLoading.git ||
                                documentLoading.memorandumOfAssociation
                            }
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
            </div>
        </div>
    );
};

export default DocumentUpload;
