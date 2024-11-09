import React, { useCallback, useEffect, useRef, useState } from "react";
import { CloudUpload, UploadDoc } from "../icons";
import { useDispatch, useSelector } from "react-redux";
import { folderActions } from "actions";
import Loader from "components/common/Loader";
import { truncate } from "lodash";
import moment from "moment";
import ModalContainer from "components/common/ModalContainer";
import Dropdown from "components/common/Dropdown";
import { displayFileIcon } from "helpers/getFileIcon";
import { firebaseService } from "services/firebaseService";

function Documents({ shipmentId }) {
    const [documents, setDocuments] = useState([]);
    const [selectedFoldersArr, setSelectedFoldersArr] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [addFilesModal, setAddFilesModal] = useState(false);
    const [createFolderModal, setCreateFolderModal] = useState(false);
    const [documentLoading, setDocumentLoading] = useState(false);
    const [renamedData, setRenamedData] = useState("");
    const [changedFolderColor, setChangedFolderColor] = useState("");
    const [fileClicked, setFileClicked] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [renameModal, setRenameModal] = useState(false);
    const [colorLabelModal, setColorLabelModal] = useState(false);
    const [isOpenedFolder, setIsOpenedFolder] = useState(false);
    const [progress, setProgress] = useState({
        progress: 0,
    });
    const [createFolderData, setCreateFolderData] = useState({
        name: "",
        labelColor: "",
        service: [],
        isForShipment: false,
        shipmentId: "",
        parentFolderId: "",
    });

    const dispatch = useDispatch();
    const progressRef = useRef(null);

    const {
        shipmentFilesAndFoldersLoading,
        shipmentFilesAndFoldersSuccess,
        folderContentLoading,
        folderContentSuccess,
        createFolderSuccess,
        createFolderLoading,
        createFileSuccess,
        deleteFileLoading,
        deleteFileSuccess,
        updateFolderLoading,
        updateFolderSuccess,
        updateFileSuccess,
        updateFileLoading,
        duplicateFileSuccess,
        deleteFolderSuccess,
        deleteFolderLoading,
        copyFolderSuccess,
        downloadFolderSuccess,
    } = useSelector((state) => state.folder);
    const { ffProfile } = useSelector((state) => state.auth);

    const handleChange = (name, value) => {
        setCreateFolderData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleDownloadFolder = useCallback(
        (url) => {
            dispatch(folderActions.resetDownloadFolderData());
            fetch(url ?? "").then((response) => {
                response.blob().then((blob) => {
                    // Creating new object of PDF file
                    const fileURL = window.URL.createObjectURL(blob);

                    let alink = document.createElement("a");
                    alink.href = fileURL;
                    alink.download = selectedContent?.folderName;
                    alink.click();

                    setDownloading(false);
                });
            });
        },
        [dispatch, selectedContent?.folderName]
    );

    const handleUpload = (fileName, file) => {
        setAddFilesModal(false);
        setDocumentLoading(true);
        const dateStamp = new Date();
        const fileNameSplit = fileName.split(".");

        firebaseService.uploadFile(
            `${selectedFoldersArr[selectedFoldersArr.length - 1]?.path}/${dateStamp}${fileName}`,
            file,
            (url) => {
                const body = {
                    fileName: fileName,
                    folderId: selectedFoldersArr[selectedFoldersArr.length - 1]?._id,
                    fileExt: fileNameSplit[fileNameSplit.length - 1],
                    url: url,
                    path: selectedFoldersArr[selectedFoldersArr.length - 1]?.path,
                };

                dispatch(folderActions.createFile(body));
            },
            345,
            setProgress
        );
    };

    const createFolder = () => {
        const body = {
            folderName: createFolderData.name,
            isForShipment: createFolderData.isForShipment,
            service: createFolderData.service,
            colorLabel: createFolderData.labelColor,
            path:
                selectedFoldersArr && selectedFoldersArr?.length > 0
                    ? selectedFoldersArr[selectedFoldersArr.length - 1]?.path
                    : `relay_app/${
                          process.env.REACT_APP_STAGE === "production" ? "production" : "staging"
                      }/${ffProfile?.result?._id}`,
            parentFolderId: selectedFoldersArr[selectedFoldersArr.length - 1]?._id,
        };

        if (createFolderData.isForShipment) {
            body.shipmentId = shipmentId;
        }

        return dispatch(folderActions.createFolder(body));
    };

    const displayOption = (type) => {
        return type === "folder"
            ? [
                  {
                      label: "Open folder",
                      value: "Open folder",
                      icon: <i className="ri-book-open-line text-base"></i>,
                      action: () => {
                          setSelectedFoldersArr((prev) => [...prev, selectedContent]);
                          //   setStep((prev) => prev + 1);
                      },
                  },
                  {
                      label: "Download folder",
                      value: "Download folder",
                      icon: <i className="ri-download-line text-base"></i>,
                      action: () => {
                          setDownloading(true);
                          dispatch(folderActions.downloadFolder(selectedContent?._id));
                      },
                  },
                  {
                      label: "Duplicate folder",
                      value: "Duplicate folder",
                      icon: <i className="ri-file-copy-fill text-base"></i>,
                      action: () => {
                          dispatch(folderActions.copyFolder({ folderId: selectedContent?._id }));
                      },
                  },
                  {
                      label: "Change label",
                      value: "Change label",
                      icon: <i className="ri-palette-fill"></i>,
                      action: () => setColorLabelModal(true),
                  },
                  {
                      label: "Rename folder",
                      value: "Rename folder",
                      icon: <i className="ri-pencil-fill text-base"></i>,
                      action: () => {
                          setRenamedData(selectedContent?.folderName);
                          setRenameModal(true);
                      },
                  },
                  {
                      label: "Delete folder",
                      value: "Delete folder",
                      icon: (
                          <i className="ri-delete-bin-fill text-base before:text-[#FF0000] before:content-['\ec29']"></i>
                      ),
                      action: () => setDeleteModal(true),
                  },
              ]
            : [
                  {
                      label: "Open file",
                      value: "Open file",
                      icon: <i className="ri-book-open-line text-base"></i>,
                      action: () => {
                          const a = document.createElement("a");
                          a.href = selectedContent?.url;
                          a.target = "_blank";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                      },
                      disabled: !Boolean(selectedContent?.url),
                  },
                  {
                      label: "Download file",
                      value: "Download file",
                      icon: <i className="ri-download-line text-base"></i>,
                      action: () => {
                          fetch(selectedContent?.url ?? "").then((response) => {
                              response.blob().then((blob) => {
                                  // Creating new object of PDF file
                                  const fileURL = window.URL.createObjectURL(blob);

                                  let alink = document.createElement("a");
                                  alink.href = fileURL;
                                  alink.download = selectedContent?.fileName;
                                  alink.click();
                              });
                          });
                      },
                  },
                  {
                      label: "Duplicate file",
                      value: "Duplicate file",
                      icon: <i className="ri-file-copy-fill text-base"></i>,
                      action: () => {
                          dispatch(folderActions.duplicateFile({ fileId: selectedContent?._id }));
                      },
                  },
                  {
                      label: "Rename file",
                      value: "Rename file",
                      icon: <i className="ri-pencil-fill text-base"></i>,
                      action: () => {
                          setRenamedData(selectedContent?.fileName);
                          setRenameModal(true);
                      },
                  },
                  {
                      label: "Delete file",
                      value: "Delete file",
                      icon: (
                          <i className="ri-delete-bin-fill text-base before:text-[#FF0000] before:content-['\ec29']"></i>
                      ),
                      action: () => setDeleteModal(true),
                  },
              ];
    };

    const displayListContent = () => {
        return documents?.map((content) => {
            return (
                <div key={content._id}>
                    <>
                        <div>
                            <hr className="max-sm:hidden" />
                            <div
                                onClick={() => {
                                    if (content?.folderName) {
                                        setSelectedFoldersArr((prev) => [...prev, content]);
                                        // setStep((prev) => prev + 1);

                                        setFileClicked(false);
                                    } else {
                                        setSelectedContent(content);
                                        setFileClicked(true);
                                    }
                                }}
                                className={`max-sm:hidden w-full grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.2fr] gap-3 py-3 px-4 hover:bg-[#FAFBFC] cursor-pointer`}
                            >
                                <div className="flex items-center justify-start gap-2.5 text-sm font-rocGroteskMedium text-gun-metal">
                                    {content?.folderName && (
                                        <i
                                            style={{ color: content?.colorLabel }}
                                            className={`ri-folder-5-fill text-lg folder-icon before:text-inherit folder-icon`}
                                        ></i>
                                    )}
                                    {content?.fileName && displayFileIcon(content?.fileExt, true)}
                                    <span className="text-inherit">
                                        {truncate(content?.fileName || content?.folderName, {
                                            length: 25,
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                    <div className="flex items-center gap-2.5">
                                        {/* <span className="w-6 h-6 rounded-full bg-mvx-neutral" /> */}
                                        <span className="text-inherit">
                                            {truncate(content?.admin?.fullName, {
                                                length: 30,
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                    {moment(content.createdAt).format("MMM DD, YYYY")}
                                </div>
                                <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                    {moment(content.updatedAt).format("MMM DD, YYYY")}
                                </div>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                                >
                                    <Dropdown
                                        value={""}
                                        dropdown={
                                            <span
                                                onClick={() => setSelectedContent(content)}
                                                className="material-icons text-base"
                                            >
                                                more_vert
                                            </span>
                                        }
                                        dropdownContainerClasses={`${
                                            content?.folderName ? "left-[-160px]" : "left-[-140px]"
                                        } shadow-dropdownShadow border-0 rounded !max-h-fit `}
                                        dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                        name={"dropdown"}
                                        dropdownOptions={displayOption(
                                            content?.folderName ? "folder" : "file"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            );
        });
    };

    useEffect(() => {
        if (selectedFoldersArr?.length === 0) {
            dispatch(folderActions.fetchFolderAndFilesByShipmentId(shipmentId));
        }
    }, [dispatch, shipmentId, selectedFoldersArr]);

    useEffect(() => {
        setDocuments(shipmentFilesAndFoldersSuccess?.data?.folderData);
    }, [shipmentFilesAndFoldersSuccess]);

    useEffect(() => {
        if (selectedFoldersArr && selectedFoldersArr?.length > 0) {
            dispatch(
                folderActions.fetchFolderContent(
                    selectedFoldersArr[selectedFoldersArr.length - 1]?._id
                )
            );
        }
        dispatch(folderActions.resetDuplicateFileData());
        dispatch(folderActions.resetCopyFolderData());
    }, [dispatch, selectedFoldersArr, duplicateFileSuccess, copyFolderSuccess]);

    useEffect(() => {
        if (Boolean(createFileSuccess)) {
            setDocuments((prev) => [createFileSuccess.file, ...prev]);
            dispatch(folderActions.resetCreateFileData());
            setDocumentLoading(false);
        }
    }, [dispatch, createFileSuccess]);

    useEffect(() => {
        if (Boolean(createFolderSuccess)) {
            setDocuments((prev) => [createFolderSuccess.folder, ...prev]);

            setCreateFolderModal(false);
            setCreateFolderData({
                name: "",
                labelColor: "",
                service: [],
                isForShipment: false,
                shipmentId: "",
                parentFolderId: "",
            });

            dispatch(folderActions.resetCreateFolderData());
        }
    }, [dispatch, createFolderSuccess]);

    useEffect(() => {
        if (Boolean(updateFileSuccess)) {
            const childContentCopy = [...documents];
            const updatedFileIdx = childContentCopy.findIndex(
                (item) => item._id === updateFileSuccess?.searchResult?._id
            );

            if (updatedFileIdx !== -1) {
                childContentCopy[updatedFileIdx] = updateFileSuccess?.searchResult;
            }

            setDocuments(childContentCopy);
            dispatch(folderActions.resetUpdateFileData());
            setRenameModal(false);
            setRenamedData("");
        }
    }, [dispatch, updateFileSuccess, documents]);

    useEffect(() => {
        let unSubscribe;

        if (downloading && downloadFolderSuccess) {
            firebaseService.downloadFolder(
                selectedContent?._id,
                handleDownloadFolder,
                (unSubFunc) => {
                    unSubscribe = unSubFunc;
                }
            );
        }

        return () => {
            if (unSubscribe) {
                unSubscribe();
            }
        };
    }, [downloading, selectedContent?._id, handleDownloadFolder, downloadFolderSuccess]);

    useEffect(() => {
        if (Boolean(folderContentSuccess)) {
            setDocuments([
                ...folderContentSuccess.data?.subFolderData,
                ...folderContentSuccess.data?.filesData,
            ]);
            dispatch(folderActions.resetFetchFolderData());
        }
    }, [folderContentSuccess, dispatch]);

    useEffect(() => {
        if (Boolean(updateFolderSuccess)) {
            const childContentCopy = [...documents];
            const updatedFolderIdx = childContentCopy.findIndex(
                (item) => item._id === updateFolderSuccess?.searchResult?._id
            );

            if (updatedFolderIdx !== -1) {
                childContentCopy[updatedFolderIdx] = updateFolderSuccess?.searchResult;
            }
            if (isOpenedFolder) {
                const foldersArr = [...selectedFoldersArr];
                foldersArr[foldersArr.length - 1] = updateFolderSuccess?.searchResult;

                setSelectedFoldersArr(foldersArr);
            }
            setDocuments(childContentCopy);
            dispatch(folderActions.resetUpdateFolderData());
            setRenameModal(false);
            setIsOpenedFolder(false);
            setColorLabelModal(false);
            setRenamedData("");
            setChangedFolderColor("");
        }
    }, [
        dispatch,
        updateFolderSuccess,
        documents,
        selectedFoldersArr,
        setSelectedFoldersArr,
        isOpenedFolder,
    ]);

    useEffect(() => {
        if (Boolean(deleteFileSuccess || deleteFolderSuccess)) {
            const childContentCopy = [...documents];
            const updatedContentIdx = childContentCopy.findIndex(
                (item) => item._id === selectedContent?._id
            );

            if (updatedContentIdx !== -1) {
                childContentCopy.splice(updatedContentIdx, 1);
            }
            setDocuments(childContentCopy);
            dispatch(folderActions.resetDeleteFileData());
            dispatch(folderActions.resetDeleteFolderData());
            setDeleteModal(false);
        }
    }, [dispatch, deleteFileSuccess, deleteFolderSuccess, documents, selectedContent?._id]);

    useEffect(() => {
        if (fileClicked && selectedContent?.fileName) {
            const a = document.createElement("a");
            a.href = selectedContent?.url;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }, [selectedContent, fileClicked]);

    if (shipmentFilesAndFoldersLoading) {
        return (
            <div className="flex my-10 items-center justify-center">
                <Loader color="mvx-black" size={8} />
            </div>
        );
    }

    return (
        <div>
            <div
                className={`font-rocGroteskBold text-base mt-6 max-sm:hidden mb-4 flex flex-wrap items-center`}
            >
                <span
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                        if (selectedFoldersArr && selectedFoldersArr?.length > 0) {
                            // setStep(0);
                            setSelectedFoldersArr([]);
                        }
                    }}
                >
                    Root
                </span>
                {selectedFoldersArr && selectedFoldersArr?.length > 0 && (
                    <span className="material-icons-outlined text-base">chevron_right</span>
                )}
                {selectedFoldersArr.map((item, idx) => {
                    return (
                        <p key={item.folderName + idx} className="flex items-center">
                            <span
                                onClick={() => {
                                    const selectedFoldersArrCopy = [...selectedFoldersArr];
                                    selectedFoldersArrCopy.splice(idx + 1);
                                    setSelectedFoldersArr(selectedFoldersArrCopy);
                                }}
                                className="cursor-pointer hover:underline"
                            >
                                {truncate(item?.folderName, {
                                    length: 12,
                                })}
                            </span>
                            {selectedFoldersArr.length !== idx + 1 && (
                                <span className="material-icons-outlined text-base">
                                    chevron_right
                                </span>
                            )}
                        </p>
                    );
                })}
            </div>
            {!documents?.length ? (
                <div className="flex flex-col items-center justify-start w-full h-full mt-4 text-[14px]">
                    <div className="container w-fit py-[32px] px-[69px] flex items-center justify-center flex-col">
                        <UploadDoc fill={"#142837"} />
                        <p className="text-inherit font-rocGroteskMedium mt-[12px]">
                            No {selectedFoldersArr?.length > 0 ? "Files" : "Folder"}
                        </p>
                        <p className="text-mvx-neutral font-rocGroteskMedium text-inherit">
                            {selectedFoldersArr?.length > 0
                                ? "You have no Files in this folder"
                                : "You have no Folder for this shipment"}
                        </p>
                        <button
                            className="border-[#EBECF0] bg-transparent text-gun-metal flex items-center mt-[12px] px-4 py-[12px] border"
                            onClick={() => {
                                setCreateFolderData({
                                    name: "",
                                    labelColor: "",
                                    service: [],
                                    isForShipment:
                                        selectedFoldersArr && selectedFoldersArr?.length === 0
                                            ? true
                                            : false,
                                    shipmentId: "",
                                });
                                if (selectedFoldersArr && selectedFoldersArr?.length > 0) {
                                    setAddFilesModal(true);
                                } else {
                                    setCreateFolderModal(true);
                                }
                            }}
                        >
                            <CloudUpload className="mr-[10px]" />{" "}
                            <span className="font-rocGroteskMedium">
                                {" "}
                                {selectedFoldersArr?.length > 0 ? "Upload files" : "Create folder"}
                            </span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    {selectedFoldersArr?.length > 0 && (
                        <div className="mb-4">
                            <div className={`flex items-center gap-3 `}>
                                <Dropdown
                                    value={""}
                                    dropdown={
                                        <button className="bg-pacific-cyan rounded py-2 px-4 flex items-center justify-center gap-2">
                                            <span className="material-icons-outlined text-white text-sm">
                                                add
                                            </span>
                                            <span className="text-sm font-rocGroteskMedium text-white">
                                                New file
                                            </span>
                                        </button>
                                    }
                                    dropdownContainerClasses={
                                        "!py-0 shadow-dropdownShadow border-0 rounded"
                                    }
                                    name={"dropdown"}
                                    dropdownOptions={[
                                        {
                                            label: "New File",
                                            value: "New File",
                                            icon: <i className="ri-file-add-fill text-base"></i>,
                                            action: () => setAddFilesModal(true),
                                        },
                                        {
                                            label: "New Folder",
                                            value: "New Folder",
                                            icon: <i className="ri-folder-add-fill text-base"></i>,
                                            action: () => setCreateFolderModal(true),
                                        },
                                    ]}
                                />

                                <Dropdown
                                    value={""}
                                    dropdown={
                                        <button
                                            onClick={() => {
                                                setSelectedContent(
                                                    selectedFoldersArr[
                                                        selectedFoldersArr.length - 1
                                                    ]
                                                );
                                                setIsOpenedFolder(true);
                                            }}
                                            className="bg-mvx-light-blue rounded py-2 px-4 flex items-center justify-center gap-2"
                                        >
                                            <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                                More options
                                            </span>
                                        </button>
                                    }
                                    dropdownContainerClasses={
                                        "shadow-dropdownShadow border-0 rounded !max-h-fit"
                                    }
                                    dropdownItemsClasses={` !py-2`}
                                    name={"dropdown"}
                                    dropdownOptions={[
                                        {
                                            label: "Download folder",
                                            value: "Download folder",
                                            icon: <i className="ri-download-line text-base"></i>,
                                            action: () => {
                                                setDownloading(true);
                                                dispatch(
                                                    folderActions.downloadFolder(
                                                        selectedContent?._id
                                                    )
                                                );
                                            },
                                        },
                                        {
                                            label: "Duplicate folder",
                                            value: "Duplicate folder",
                                            icon: <i className="ri-file-copy-fill text-base"></i>,
                                            action: () => {
                                                dispatch(
                                                    folderActions.copyFolder({
                                                        folderId: selectedContent?._id,
                                                    })
                                                );
                                            },
                                        },
                                        {
                                            label: "Change label",
                                            value: "Change label",
                                            icon: <i className="ri-palette-fill"></i>,
                                            action: () => setColorLabelModal(true),
                                        },
                                        {
                                            label: "Rename folder",
                                            value: "Rename folder",
                                            icon: <i className="ri-pencil-fill text-base"></i>,
                                            action: () => setRenameModal(true),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                    <div className={`border rounded max-sm:border-none `}>
                        <div
                            className={` max-sm:hidden w-full grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.2fr] gap-3 py-3 px-4 bg-[#FAFBFC]`}
                        >
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                Name
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                created by
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                date created
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                last modified
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                        </div>
                        <div>
                            {folderContentLoading ? (
                                <div className="flex justify-center my-10">
                                    <Loader color="gun-metal" size={10} />
                                </div>
                            ) : (
                                displayListContent()
                            )}
                        </div>
                    </div>
                </div>
            )}
            {downloading && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="p-6">
                                <p className="text-[20px] text-center mb-4 relative font-rocGroteskBold ">
                                    Downloading...
                                </p>
                                <div>
                                    <Loader color="gun-metal" size={8} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {documentLoading && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="px-6 pt-24 pb-20 flex items-center justify-center">
                                <div>
                                    <div className="h-[5px] w-[345px] bg-[#DFE1E6] rounded-[3px] mb-5">
                                        <div
                                            ref={progressRef}
                                            className={`h-full rounded-[3px] bg-pacific-cyan`}
                                            style={{
                                                width: `${(
                                                    (progress?.progress / 345) *
                                                    100
                                                ).toFixed()}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-sm font-rocGroteskMedium text-center mt-2 text-mvx-neutral">
                                        Uploading ({((progress?.progress / 345) * 100).toFixed()}
                                        %)...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {createFolderModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[32.5%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setCreateFolderModal(false);
                        setCreateFolderData({
                            name: "",
                            labelColor: "",
                            service: [],
                            isForShipment: false,
                            shipmentId: "",
                        });
                    }}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createFolder();
                        }}
                        className="bg-white rounded-lg shadow-modalShadow"
                    >
                        <div className="p-6">
                            <p className="text-lg mb-4 font-rocGroteskBold text-gun-metal">
                                Create folder
                            </p>
                            <div>
                                <div className="mb-6">
                                    <p className="text-sm mb-1 font-rocGroteskMedium ">
                                        Folder name
                                    </p>
                                    <input
                                        value={createFolderData.name}
                                        type="text"
                                        className="border border-gray-200 p-3 rounded outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                        placeholder="Enter folder name"
                                        required
                                        name="name"
                                        onChange={(event) => {
                                            handleChange(event.target.name, event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-sm mb-1 font-rocGroteskMedium ">
                                        Select label
                                    </p>
                                    <div className="flex items-center gap-2 relative">
                                        <input
                                            value={createFolderData.labelColor}
                                            type="text"
                                            className="border absolute h-[48px] z-[-1] opacity-0"
                                            required
                                            name="labelColor"
                                        />
                                        <div
                                            onClick={() => handleChange("labelColor", "#FF0000")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#FF0000" &&
                                                "border border-[3px] border-[#FF0000] rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#FF0000"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-[#FF0000]`}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#16C6A4")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#16C6A4" &&
                                                "border border-[3px] border-pacific-cyan rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#16C6A4"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-pacific-cyan `}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#FF6224")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#FF6224" &&
                                                "border border-[3px] border-mvx-orange rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#FF6224"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-mvx-orange`}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#736CED")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#736CED" &&
                                                "border border-[3px] border-[#736CED] rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#736CED"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-[#736CED]`}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#00C6FA")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#00C6FA" &&
                                                "border border-[3px] border-[#00C6FA] rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#00C6FA"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-[#00C6FA]`}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#0054C2")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#0054C2" &&
                                                "border border-[3px] border-[#0054C2] rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#0054C2"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-[#0054C2]`}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#000000")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#000000" &&
                                                "border border-[3px] border-[#000000] rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#000000"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-[#000000]`}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleChange("labelColor", "#6B778C")}
                                            className={`cursor-pointer ${
                                                createFolderData.labelColor === "#6B778C" &&
                                                "border border-[3px] border-[#6B778C] rounded-full p-[2px]"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    createFolderData.labelColor === "#6B778C"
                                                        ? "w-7 h-7"
                                                        : "w-9 h-9"
                                                } rounded-full bg-[#6B778C]`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <p className="text-sm mb-1 font-rocGroteskMedium ">
                                        Select a service
                                    </p>
                                    <Dropdown
                                        value={""}
                                        dropdown={
                                            <>
                                                <div className="relative flex items-center w-full border rounded px-3 h-[48px] gap-2">
                                                    {createFolderData.service.length > 0 ? (
                                                        <div className="flex flex-wrap items-center w-full gap-2">
                                                            {createFolderData.service.map(
                                                                (item, idx) => {
                                                                    return (
                                                                        <div
                                                                            key={item}
                                                                            className="w-fit flex items-center gap-2 px-3 py-1.5 rounded bg-mvx-light-blue"
                                                                        >
                                                                            <div className="text-xs whitespace-nowrap font-rocGroteskMedium text-mvx-neutral">
                                                                                {item}
                                                                            </div>
                                                                            <span
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    const createFolderDataServiceCopy =
                                                                                        [
                                                                                            ...createFolderData.service,
                                                                                        ];
                                                                                    createFolderDataServiceCopy.splice(
                                                                                        idx,
                                                                                        1
                                                                                    );
                                                                                    setCreateFolderData(
                                                                                        (prev) => {
                                                                                            return {
                                                                                                ...prev,
                                                                                                service:
                                                                                                    createFolderDataServiceCopy,
                                                                                            };
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                className="material-icons text-sm cursor-point"
                                                                            >
                                                                                close
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className=" flex items-center w-full justify-between ">
                                                            <div className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                                Select a service
                                                            </div>
                                                            <span className="material-icons text-base ">
                                                                keyboard_arrow_down
                                                            </span>
                                                        </div>
                                                    )}
                                                    <input
                                                        value={createFolderData.service?.[0]}
                                                        type="text"
                                                        className="border absolute h-[48px] z-[-1] opacity-0"
                                                        required
                                                        name="service"
                                                    />
                                                </div>
                                            </>
                                        }
                                        dropdownClassname={"!w-full"}
                                        dropdownContainerClasses={
                                            "shadow-dropdownShadow border-0 rounded !py-0"
                                        }
                                        name={"dropdown"}
                                        dropdownOptions={[
                                            {
                                                customChild: (
                                                    <div className="flex flex-col bg-white">
                                                        <div
                                                            onClick={() => {
                                                                const createFolderDataServiceCopy =
                                                                    [...createFolderData.service];
                                                                const serviceIndex =
                                                                    createFolderDataServiceCopy.findIndex(
                                                                        (value) => value === "air"
                                                                    );
                                                                if (serviceIndex !== -1) {
                                                                    createFolderDataServiceCopy.splice(
                                                                        serviceIndex,
                                                                        1
                                                                    );
                                                                } else {
                                                                    createFolderDataServiceCopy.push(
                                                                        "air"
                                                                    );
                                                                }
                                                                setCreateFolderData((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        service:
                                                                            createFolderDataServiceCopy,
                                                                    };
                                                                });
                                                            }}
                                                            className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                        >
                                                            {createFolderData.service.includes(
                                                                "air"
                                                            ) ? (
                                                                <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                            ) : (
                                                                <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                            )}
                                                            <span className="text-inherit">
                                                                Air
                                                            </span>
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                const createFolderDataServiceCopy =
                                                                    [...createFolderData.service];
                                                                const serviceIndex =
                                                                    createFolderDataServiceCopy.findIndex(
                                                                        (value) => value === "ocean"
                                                                    );
                                                                if (serviceIndex !== -1) {
                                                                    createFolderDataServiceCopy.splice(
                                                                        serviceIndex,
                                                                        1
                                                                    );
                                                                } else {
                                                                    createFolderDataServiceCopy.push(
                                                                        "ocean"
                                                                    );
                                                                }
                                                                setCreateFolderData((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        service:
                                                                            createFolderDataServiceCopy,
                                                                    };
                                                                });
                                                            }}
                                                            className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                        >
                                                            {createFolderData.service.includes(
                                                                "ocean"
                                                            ) ? (
                                                                <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                            ) : (
                                                                <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                            )}
                                                            <span className="text-inherit">
                                                                Ocean
                                                            </span>
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                const createFolderDataServiceCopy =
                                                                    [...createFolderData.service];
                                                                const serviceIndex =
                                                                    createFolderDataServiceCopy.findIndex(
                                                                        (value) => value === "land"
                                                                    );
                                                                if (serviceIndex !== -1) {
                                                                    createFolderDataServiceCopy.splice(
                                                                        serviceIndex,
                                                                        1
                                                                    );
                                                                } else {
                                                                    createFolderDataServiceCopy.push(
                                                                        "land"
                                                                    );
                                                                }
                                                                setCreateFolderData((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        service:
                                                                            createFolderDataServiceCopy,
                                                                    };
                                                                });
                                                            }}
                                                            className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                        >
                                                            {createFolderData.service.includes(
                                                                "land"
                                                            ) ? (
                                                                <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                            ) : (
                                                                <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                            )}
                                                            <span className="text-inherit">
                                                                Land
                                                            </span>
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                const createFolderDataServiceCopy =
                                                                    [...createFolderData.service];
                                                                const serviceIndex =
                                                                    createFolderDataServiceCopy.findIndex(
                                                                        (value) =>
                                                                            value ===
                                                                            "custom clearance"
                                                                    );
                                                                if (serviceIndex !== -1) {
                                                                    createFolderDataServiceCopy.splice(
                                                                        serviceIndex,
                                                                        1
                                                                    );
                                                                } else {
                                                                    createFolderDataServiceCopy.push(
                                                                        "custom clearance"
                                                                    );
                                                                }
                                                                setCreateFolderData((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        service:
                                                                            createFolderDataServiceCopy,
                                                                    };
                                                                });
                                                            }}
                                                            className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                        >
                                                            {createFolderData.service.includes(
                                                                "custom clearance"
                                                            ) ? (
                                                                <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                            ) : (
                                                                <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                            )}

                                                            <span className="text-inherit">
                                                                Customs Clearance
                                                            </span>
                                                        </div>
                                                        <div className="text-xs font-rocGroteskMedium bg-mvx-light-blue px-4 py-3 cursor-pointer">
                                                            <span className="text-inherit">
                                                                You can select multiple services for
                                                                this folder
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t border-r px-3`}
                                onClick={() => {
                                    setCreateFolderModal(false);

                                    setCreateFolderData({
                                        name: "",
                                        labelColor: "",
                                        service: [],
                                        isForShipment: false,
                                        shipmentId: "",
                                    });
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="submit"
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                {createFolderLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">create a folder</p>
                                )}
                            </button>
                        </div>
                    </form>
                </ModalContainer>
            )}
            {addFilesModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        dispatch(folderActions.resetCreateFolderData());
                        setAddFilesModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="p-6 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F4F5F7] mb-6">
                                    <i className="ri-upload-2-line before:content-['\f24a'] before:text-mvx-neutral text-3xl"></i>
                                </div>
                                <p className="text-lg mb-1 font-rocGroteskBold text-gun-metal">
                                    Add files to your folder
                                </p>
                                <p className="text-sm mb-1 font-rocGroteskRegular px-4 text-center text-gun-metal">
                                    Drag and drop files right into this place or upload them
                                    directly from your device
                                </p>
                            </div>
                            <input
                                type={"file"}
                                name="fileUpload"
                                id="uploadFile"
                                onChange={(event) => {
                                    handleUpload(event.target.files[0].name, event.target.files[0]);
                                }}
                                className="w-full h-full absolute cursor-pointer opacity-0 top-0"
                                accept="*"
                            />
                        </div>

                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t border-r px-3`}
                                onClick={() => {
                                    dispatch(folderActions.resetCreateFileData());
                                    setAddFilesModal(false);
                                }}
                            >
                                close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    document.getElementById("uploadFile").click();
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                upload from device
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {deleteModal && (
                <ModalContainer
                    showCloseIcon={false}
                    closeModal={() => setDeleteModal(false)}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="p-6">
                                <p className="text-[20px] text-center mb-2 relative font-rocGroteskBold ">
                                    Delete {selectedContent?.fileName ? "file" : "folder"}?
                                </p>
                                <p className="text-sm text-center px-4">
                                    Are you sure you want to delete{" "}
                                    <span className="font-rocGroteskMedium text-inherit">
                                        {truncate(
                                            selectedContent?.fileName ||
                                                selectedContent?.folderName,
                                            {
                                                length: 40,
                                            }
                                        )}
                                    </span>{" "}
                                    from your Fleet+?
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t  px-3`}
                                onClick={() => {
                                    setDeleteModal(false);
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    return selectedContent?.fileName
                                        ? dispatch(folderActions.deleteFile(selectedContent?._id))
                                        : dispatch(
                                              folderActions.deleteFolder(selectedContent?._id)
                                          );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                {deleteFileLoading || deleteFolderLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Delete</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {renameModal && (
                <ModalContainer
                    showCloseIcon={false}
                    closeModal={() => {
                        setRenameModal(false);
                        setRenamedData("");
                    }}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="p-6">
                                <p className="text-[20px] mb-4 relative font-rocGroteskBold ">
                                    Rename {selectedContent?.fileName ? "file" : "folder"}
                                </p>
                                <div>
                                    <input
                                        value={renamedData}
                                        type="text"
                                        className="border border-gray-200 p-3 rounded outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                        placeholder={`${
                                            selectedContent?.fileName ? "File" : "Folder"
                                        } name`}
                                        name="renamedFile"
                                        required
                                        onChange={({ target: { value } }) => setRenamedData(value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t  px-3`}
                                onClick={() => {
                                    setRenameModal(false);
                                    setRenamedData("");
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                disabled={!Boolean(renamedData)}
                                onClick={() => {
                                    return selectedContent?.fileName
                                        ? dispatch(
                                              folderActions.updateFile(
                                                  { fileName: renamedData },
                                                  selectedContent?._id
                                              )
                                          )
                                        : dispatch(
                                              folderActions.updateFolder(
                                                  { folderName: renamedData },
                                                  selectedContent?._id
                                              )
                                          );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                {updateFolderLoading || updateFileLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">save changes</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {colorLabelModal && (
                <ModalContainer
                    showCloseIcon={false}
                    closeModal={() => {
                        setColorLabelModal(false);
                        setChangedFolderColor("");
                    }}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="p-6">
                                <p className="text-[20px] mb-4 relative font-rocGroteskBold ">
                                    Change label
                                </p>
                                <div className="flex items-center gap-2">
                                    <div
                                        onClick={() => setChangedFolderColor("#FF0000")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#FF0000" &&
                                            "border border-[3px] border-[#FF0000] rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#FF0000"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-[#FF0000]`}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setChangedFolderColor("#16C6A4")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#16C6A4" &&
                                            "border border-[3px] border-pacific-cyan rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#16C6A4"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-pacific-cyan `}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setChangedFolderColor("#FF6224")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#FF6224" &&
                                            "border border-[3px] border-mvx-orange rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#FF6224"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-mvx-orange`}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setChangedFolderColor("#736CED")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#736CED" &&
                                            "border border-[3px] border-[#736CED] rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#736CED"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-[#736CED]`}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setChangedFolderColor("#00C6FA")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#00C6FA" &&
                                            "border border-[3px] border-[#00C6FA] rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#00C6FA"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-[#00C6FA]`}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setChangedFolderColor("#0054C2")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#0054C2" &&
                                            "border border-[3px] border-[#0054C2] rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#0054C2"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-[#0054C2]`}
                                        />
                                    </div>

                                    <div
                                        onClick={() => setChangedFolderColor("#000000")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#000000" &&
                                            "border border-[3px] border-[#000000] rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#000000"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-[#000000]`}
                                        />
                                    </div>
                                    <div
                                        onClick={() => setChangedFolderColor("#6B778C")}
                                        className={`cursor-pointer ${
                                            changedFolderColor === "#6B778C" &&
                                            "border border-[3px] border-[#6B778C] rounded-full p-[2px]"
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                changedFolderColor === "#6B778C"
                                                    ? "w-7 h-7"
                                                    : "w-9 h-9"
                                            } rounded-full bg-[#6B778C]`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t  px-3`}
                                onClick={() => {
                                    setColorLabelModal(false);
                                    setChangedFolderColor("");
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                disabled={!Boolean(changedFolderColor)}
                                onClick={() => {
                                    dispatch(
                                        folderActions.updateFolder(
                                            { colorLabel: changedFolderColor },
                                            selectedContent?._id
                                        )
                                    );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                {updateFolderLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">save</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
}

export default Documents;
