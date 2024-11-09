import ModalContainer from "components/common/ModalContainer";
// import { PdfUploadedIcon } from "assets/arts";
import React, { useEffect, useRef, useState } from "react";
import { firebaseService } from "services/firebaseService";
import Loader from "components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "actions/appActions";

const Documents = ({ setActiveMobileSection }) => {
    const [addDocumentModal, setAddDocumentModal] = useState(false);
    const [progress, setProgress] = useState({
        progress: 0,
    });
    const progressRef = useRef(null);
    const dispatch = useDispatch();
    const [documentData, setDocumentData] = useState({
        cac: {
            name: "CAC",
            file: "",
        },
        git: {
            name: "GIT",
            file: "",
        },
        memorandumOfAssociation: {
            name: "MOA",
            file: "",
        },
        idCard: {
            name: "ID",
            file: "",
        },
    });
    const [updatedDocs, setUpdatedDocs] = useState(null);
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
    const { ffProfile } = useSelector((state) => state.auth);
    const { updateBusinessProfile } = useSelector((state) => state.app);

    const handleUpload = (name, fileName, file) => {
        setDocumentLoading((prevState) => ({ ...prevState, [name]: true }));
        setDocumentData((prev) => ({
            ...prev,
            [name]: { name: prev[name].name, file: "" },
        }));

        firebaseService.uploadFile(
            `relayApp/${fileName}`,
            file,
            (url) => {
                setDocumentData((prev) => ({
                    ...prev,
                    [name]: { name: prev[name].name, file: url !== "error" ? url : "" },
                }));
                setDocumentLoading((prevState) => ({
                    ...prevState,
                    [name]: false,
                }));
            },
            245,
            setProgress
        );
    };

    const handleSubmit = () => {
        const body = {
            businessDocs: [
                {
                    name: "CAC",
                    file: Boolean(documentData?.cac?.file)
                        ? documentData.cac.file
                        : ffProfile?.result?.profile?.businessDocs?.find(
                              (item) => item?.name?.toLowerCase() === "cac"
                          )?.file,
                },
                {
                    name: "GIT",
                    file: Boolean(documentData?.git?.file)
                        ? documentData.git.file
                        : ffProfile?.result?.profile?.businessDocs?.find(
                              (item) => item?.name?.toLowerCase() === "git"
                          )?.file,
                },
                {
                    name: "MOA",
                    file: Boolean(documentData?.memorandumOfAssociation?.file)
                        ? documentData.memorandumOfAssociation.file
                        : ffProfile?.result?.profile?.businessDocs?.find(
                              (item) => item?.name?.toLowerCase() === "moa"
                          )?.file,
                },
                {
                    name: "ID",
                    file: Boolean(documentData?.idCard?.file)
                        ? documentData.idCard.file
                        : ffProfile?.result?.profile?.businessDocs?.find(
                              (item) => item?.name?.toLowerCase() === "id"
                          )?.file,
                },
            ],
        };

        return dispatch(appActions.updateBusinessProfile(body));
    };

    useEffect(() => {
        if (Boolean(updateBusinessProfile)) {
            setUpdatedDocs(updateBusinessProfile);
        }
    }, [updateBusinessProfile]);

    if (!ffProfile) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className="flex max-sm:flex-col max-sm:items-start justify-between items-center">
                    <div className="mb-6 max-sm:pl-5">
                        {/* <p className="text-[22px] font-rocGroteskBold mb-1">Documents</p> */}
                        <div className="max-sm:flex max-sm:gap-4">
                            <span
                                onClick={() => setActiveMobileSection(false)}
                                className="material-icons-outlined max-sm:block hidden text-lg font-semibold "
                            >
                                arrow_back
                            </span>
                            <p className="text-[22px] font-rocGroteskBold mb-1">Documents</p>
                        </div>
                        <p className="text-sm font-rocGroteskMedium">
                            Documents uploaded to Fleet+ are kept here
                        </p>
                    </div>
                    <div className="max-sm:px-5 max-sm:w-full max-sm:mb-5">
                        <button
                            className="flex items-center justify-center gap-2 bg-pacific-cyan text-white font-rocGroteskMedium w-full py-2 text-sm rounded"
                            type={"button"}
                            onClick={() => setAddDocumentModal(true)}
                        >
                            Add document
                        </button>
                    </div>
                </div>

                <hr />
                {(
                    updatedDocs?.ffUpdated?.user?.profile?.businessDocs ??
                    ffProfile?.result?.profile?.businessDocs
                )?.length > 0 &&
                (
                    updatedDocs?.ffUpdated?.user?.profile?.businessDocs ??
                    ffProfile?.result?.profile?.businessDocs
                )?.find((item) => Boolean(item?.file)) ? (
                    <div className="py-4 mt-6 flex gap-6 max-sm:grid max-sm:grid-cols-2 max-sm:px-5 max-sm:gap-y-8">
                        {(
                            updatedDocs?.ffUpdated?.user?.profile?.businessDocs ??
                            ffProfile?.result?.profile?.businessDocs
                        )?.map((doc) => {
                            return (
                                Boolean(doc?.file) && (
                                    <div
                                        key={doc?._id}
                                        className="h-[212px] w-[158px] flex items-center p-5 relative border"
                                    >
                                        <div className="absolute top-[-30px] right-[-30px] w-[60px] h-[60px] max-sm:h-[30px] max-sm:top-[-5px] max-sm:right-[-20px] rotate-45 border-b bg-white"></div>
                                        <div>
                                            {(
                                                updatedDocs?.ffUpdated?.user?.profile
                                                    ?.businessDocs ??
                                                ffProfile?.result?.profile?.businessDocs
                                            )?.filter(
                                                (item) =>
                                                    item?.name?.toLowerCase() ===
                                                        doc?.name?.toLowerCase() &&
                                                    item?.file?.toLowerCase()?.includes(".pdf")
                                            )?.length > 0 && (
                                                // <PdfUploadedIcon />
                                                <img
                                                    src={
                                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                                    }
                                                    alt="pdf Uploaded Icon"
                                                />
                                            )}
                                            {(
                                                updatedDocs?.ffUpdated?.user?.profile
                                                    ?.businessDocs ??
                                                ffProfile?.result?.profile?.businessDocs
                                            )?.filter(
                                                (item) =>
                                                    item?.name?.toLowerCase() ===
                                                        doc?.name?.toLowerCase() &&
                                                    (item?.file?.toLowerCase()?.includes(".png") ||
                                                        item?.file
                                                            ?.toLowerCase()
                                                            ?.includes(".jpg") ||
                                                        item?.file
                                                            ?.toLowerCase()
                                                            ?.includes(".jpeg"))
                                            )?.length > 0 && (
                                                // <ImageUploadedIcon />
                                                <img
                                                    src={
                                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                                                    }
                                                    alt="pictorial Uploaded Icon"
                                                />
                                            )}

                                            <p className="text-sm font-rocGroteskMedium mt-3 mb-5">
                                                {doc?.name?.toLowerCase() === "cac" &&
                                                    "CAC or Business registration"}
                                                {doc?.name?.toLowerCase() === "git" && (
                                                    <span>
                                                        <span>GIT</span> <br />{" "}
                                                        <span>insurance</span>
                                                    </span>
                                                )}
                                                {doc?.name?.toLowerCase() === "moa" &&
                                                    "Memorandum of Association"}
                                                {doc?.name?.toLowerCase() === "id" &&
                                                    "I.D Card of Director"}
                                            </p>
                                            <p
                                                onClick={() => setAddDocumentModal(true)}
                                                className="text-xs font-rocGroteskMedium cursor-pointer w-fit text-mvx-neutral underline"
                                            >
                                                Change file
                                            </p>
                                        </div>
                                    </div>
                                )
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-4 mt-6 flex flex-col items-center justify-center h-80">
                        <span className="material-icons-outlined text-5xl mb-3 text-gun-metal">
                            note_add
                        </span>
                        <p className="text-lg font-rocGroteskBold text-gun-metal">
                            No documents yet
                        </p>
                        <p className="font-rocGroteskRegular text-sm text-center w-[23%]">
                            Please upload your documents so we can verify your business .
                        </p>
                        <button
                            className="flex items-center justify-center gap-2 bg-pacific-cyan text-white font-rocGroteskMedium w-fit px-8 py-2 mt-6 text-sm rounded"
                            type={"button"}
                            onClick={() => setAddDocumentModal(true)}
                        >
                            Upload document
                        </button>
                    </div>
                )}
            </div>
            {addDocumentModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[45%] max-lg:w-1/2 max-sm:w-full max-sm:h-[85%] max-sm:overflow-auto max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        handleSubmit();
                        setAddDocumentModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg  shadow-modalShadow">
                        <div className="px-6 pt-6">
                            <div className="mb-8">
                                <p className="font-rocGroteskBold text-xl text-center">
                                    Upload a new file
                                </p>
                                <p className="font-rocGroteskRegular text-sm text-center">
                                    Change or upload a new document.
                                </p>
                            </div>

                            <div>
                                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-x-3 gap-y-4">
                                    <div className="relative flex flex-col w-full cursor-pointer">
                                        <div className="py-9 px-6 border cursor-pointer rounded border-dashed w-full">
                                            <>
                                                <div className="mb-2">
                                                    {documents.cac?.type?.includes(
                                                        "application"
                                                    ) ? (
                                                        // <PdfUploadedIcon />
                                                        <img
                                                            src={
                                                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                                            }
                                                            alt="pdf Uploaded Icon"
                                                        />
                                                    ) : !Boolean(documents.cac?.type) &&
                                                      ffProfile?.result?.profile?.businessDocs?.filter(
                                                          (item) =>
                                                              item?.name?.toLowerCase() === "cac" &&
                                                              item?.file
                                                                  ?.toLowerCase()
                                                                  ?.includes(".pdf")
                                                      )?.length > 0 ? (
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
                                                    ) : !Boolean(documents.cac?.type) &&
                                                      ffProfile?.result?.profile?.businessDocs?.filter(
                                                          (item) =>
                                                              item?.name?.toLowerCase() === "cac" &&
                                                              (item?.file
                                                                  ?.toLowerCase()
                                                                  ?.includes(".png") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpg") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpeg"))
                                                      )?.length > 0 ? (
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
                                                        <div>
                                                            <div className="h-[5px] w-[245px] bg-[#DFE1E6] rounded-[3px]">
                                                                <div
                                                                    ref={progressRef}
                                                                    className={`h-full rounded-[3px] bg-gun-metal`}
                                                                    style={{
                                                                        width: `${(
                                                                            (progress?.progress /
                                                                                245) *
                                                                            100
                                                                        ).toFixed()}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs font-rocGroteskMedium mt-2 text-mvx-neutral">
                                                                Uploading (
                                                                {(
                                                                    (progress?.progress / 245) *
                                                                    100
                                                                ).toFixed(0)}
                                                                %)...
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                                            {Boolean(documents.cac?.name)
                                                                ? "File uploaded successfully"
                                                                : "PDF, JPEG or PNG only"}
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
                                                handleUpload(
                                                    "cac",
                                                    event.target?.files[0]?.name,
                                                    event.target?.files[0]
                                                );
                                            }}
                                            className="w-full h-full absolute cursor-pointer opacity-0"
                                            accept=".pdf,.jpeg,.png"
                                        />
                                        {(Boolean(documentData.cac.file) ||
                                            ffProfile?.result?.profile?.businessDocs?.find(
                                                (item) => item?.name?.toLowerCase() === "cac"
                                            )?.file) && (
                                            <div className="mt-2">
                                                <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                                    Change File
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative flex flex-col w-full cursor-pointer">
                                        <div className="py-9 pl-6 border cursor-pointer rounded border-dashed w-full">
                                            <>
                                                <div className="mb-2">
                                                    {documents.git?.type?.includes("application") ||
                                                    ffProfile?.result?.profile?.businessDocs?.filter(
                                                        (item) =>
                                                            item?.name?.toLowerCase() === "git" &&
                                                            item?.file
                                                                ?.toLowerCase()
                                                                ?.includes(".pdf")
                                                    )?.length > 0 ? (
                                                        // <PdfUploadedIcon />
                                                        <img
                                                            src={
                                                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                                            }
                                                            alt="pdf Uploaded Icon"
                                                        />
                                                    ) : documents.git?.type?.includes("image") ||
                                                      ffProfile?.result?.profile?.businessDocs?.filter(
                                                          (item) =>
                                                              item?.name?.toLowerCase() === "git" &&
                                                              (item?.file
                                                                  ?.toLowerCase()
                                                                  ?.includes(".png") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpg") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpeg"))
                                                      )?.length > 0 ? (
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
                                                        <div>
                                                            <div className="h-[5px] w-[245px] rounded-[3px] bg-[#DFE1E6]">
                                                                <div
                                                                    ref={progressRef}
                                                                    className={`h-full rounded-[3px] bg-gun-metal`}
                                                                    style={{
                                                                        width: `${(
                                                                            (progress?.progress /
                                                                                245) *
                                                                            100
                                                                        ).toFixed()}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs font-rocGroteskMedium mt-2 text-mvx-neutral">
                                                                Uploading (
                                                                {(
                                                                    (progress?.progress / 245) *
                                                                    100
                                                                ).toFixed(0)}
                                                                %)...
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                                            {Boolean(documents.git?.name)
                                                                ? "File uploaded successfully"
                                                                : "PDF, JPEG or PNG only"}
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
                                                        git: event.target?.files[0],
                                                    };
                                                });
                                                handleUpload(
                                                    "git",
                                                    event.target?.files[0]?.name,
                                                    event.target?.files[0]
                                                );
                                            }}
                                            className="w-full h-full absolute cursor-pointer opacity-0"
                                            accept=".pdf,.jpeg,.png"
                                        />
                                        {(Boolean(documentData.git.file) ||
                                            ffProfile?.result?.profile?.businessDocs?.find(
                                                (item) => item?.name?.toLowerCase() === "git"
                                            )?.file) && (
                                            <div className="mt-2">
                                                <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                                    Change File
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative flex flex-col w-full cursor-pointer">
                                        <div className="py-9 pl-6 border cursor-pointer rounded border-dashed w-full">
                                            <>
                                                <div className="mb-2">
                                                    {documents.memorandumOfAssociation?.type?.includes(
                                                        "application"
                                                    ) ||
                                                    ffProfile?.result?.profile?.businessDocs?.filter(
                                                        (item) =>
                                                            item?.name?.toLowerCase() === "moa" &&
                                                            item?.file
                                                                ?.toLowerCase()
                                                                ?.includes(".pdf")
                                                    )?.length > 0 ? (
                                                        // <PdfUploadedIcon />
                                                        <img
                                                            src={
                                                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                                            }
                                                            alt="pdf Uploaded Icon"
                                                        />
                                                    ) : documents.memorandumOfAssociation?.type?.includes(
                                                          "image"
                                                      ) ||
                                                      ffProfile?.result?.profile?.businessDocs?.filter(
                                                          (item) =>
                                                              item?.name?.toLowerCase() === "moa" &&
                                                              (item?.file
                                                                  ?.toLowerCase()
                                                                  ?.includes(".png") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpg") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpeg"))
                                                      )?.length > 0 ? (
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
                                                        <div>
                                                            <div className="h-[5px] w-[245px] rounded-[3px] bg-[#DFE1E6]">
                                                                <div
                                                                    ref={progressRef}
                                                                    className={`h-full rounded-[3px] bg-gun-metal`}
                                                                    style={{
                                                                        width: `${(
                                                                            (progress?.progress /
                                                                                245) *
                                                                            100
                                                                        ).toFixed()}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs font-rocGroteskMedium mt-2 text-mvx-neutral">
                                                                Uploading (
                                                                {(
                                                                    (progress?.progress / 245) *
                                                                    100
                                                                ).toFixed(0)}
                                                                %)...
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                                            {Boolean(
                                                                documents.memorandumOfAssociation
                                                                    ?.name
                                                            )
                                                                ? "File uploaded successfully"
                                                                : "PDF, JPEG or PNG only"}
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
                                                        memorandumOfAssociation:
                                                            event.target.files[0],
                                                    };
                                                });
                                                handleUpload(
                                                    "memorandumOfAssociation",
                                                    event.target?.files[0]?.name,
                                                    event.target?.files[0]
                                                );
                                            }}
                                            className="w-full h-full absolute cursor-pointer opacity-0"
                                            accept=".pdf,.jpeg,.png"
                                        />
                                        {(Boolean(documentData.memorandumOfAssociation.file) ||
                                            ffProfile?.result?.profile?.businessDocs?.find(
                                                (item) => item?.name?.toLowerCase() === "moa"
                                            )?.file) && (
                                            <div className="mt-2">
                                                <p className="cursor-pointer font-rocGroteskMedium text-gun-metal underline text-sm">
                                                    Change File
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative flex flex-col w-full cursor-pointer">
                                        <div className="py-9 pl-6 border cursor-pointer rounded border-dashed w-full">
                                            <>
                                                <div className="mb-2">
                                                    {documents.idCard?.type?.includes(
                                                        "application"
                                                    ) ||
                                                    ffProfile?.result?.profile?.businessDocs?.filter(
                                                        (item) =>
                                                            item?.name?.toLowerCase() === "id" &&
                                                            item?.file
                                                                ?.toLowerCase()
                                                                ?.includes(".pdf")
                                                    )?.length > 0 ? (
                                                        // <PdfUploadedIcon />
                                                        <img
                                                            src={
                                                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                                                            }
                                                            alt="pdf Uploaded Icon"
                                                        />
                                                    ) : documents.idCard?.type?.includes("image") ||
                                                      ffProfile?.result?.profile?.businessDocs?.filter(
                                                          (item) =>
                                                              item?.name?.toLowerCase() === "id" &&
                                                              (item?.file
                                                                  ?.toLowerCase()
                                                                  ?.includes(".png") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpg") ||
                                                                  item?.file
                                                                      ?.toLowerCase()
                                                                      ?.includes(".jpeg"))
                                                      )?.length > 0 ? (
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
                                                        <div>
                                                            <div className="h-[5px] w-[245px] rounded-[3px] bg-[#DFE1E6]">
                                                                <div
                                                                    ref={progressRef}
                                                                    className={`h-full rounded-[3px] bg-gun-metal`}
                                                                    style={{
                                                                        width: `${(
                                                                            (progress?.progress /
                                                                                245) *
                                                                            100
                                                                        ).toFixed()}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs font-rocGroteskMedium mt-2 text-mvx-neutral">
                                                                Uploading (
                                                                {(
                                                                    (progress?.progress / 245) *
                                                                    100
                                                                ).toFixed(0)}
                                                                %)...
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                                            {Boolean(documents.idCard?.name)
                                                                ? "File uploaded successfully"
                                                                : "PDF, JPEG or PNG only"}
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
                                                    event.target?.files[0]?.name,
                                                    event.target?.files[0]
                                                );
                                            }}
                                            className="w-full h-full absolute cursor-pointer opacity-0"
                                            accept=".pdf,.jpeg,.png"
                                        />
                                        {(Boolean(documentData.idCard.file) ||
                                            ffProfile?.result?.profile?.businessDocs?.find(
                                                (item) => item?.name?.toLowerCase() === "id"
                                            )?.file) && (
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
                        <div className="flex pt-8">
                            <button
                                type="button"
                                onClick={() => {
                                    handleSubmit();
                                    setAddDocumentModal(false);
                                }}
                                // disabled={progress.progress !== 245}
                                className={`uppercase rounded-b rounded-t-none w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                            >
                                close
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default Documents;
