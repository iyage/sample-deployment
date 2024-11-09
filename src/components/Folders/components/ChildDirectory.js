import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import moment from "moment";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { folderActions, shipmentActions } from "actions";
import { firebaseService } from "services/firebaseService";
import { displayFileIcon } from "helpers/getFileIcon";
import CreateToCustomer from "components/common/CreateQuote/CreateToCustomer";
import toast from "react-hot-toast";
import CustomToast from "components/common/CustomToast";

const ChildDirectory = ({
    setStep,
    selectedFoldersArr,
    setSelectedFoldersArr,
    isChildDirListMode,
    setIsChildDirListMode,
    searchResults,
    setActiveFilterChildOption,
    searchField,
    setSearchField,
    searchInput,
    setSearchInput,
    setSearchResults,
}) => {
    const [createFolderModal, setCreateFolderModal] = useState(false);
    const [searchInFocus, setSearchInFocus] = useState(false);
    const [addFilesModal, setAddFilesModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [renameModal, setRenameModal] = useState(false);
    const [colorLabelModal, setColorLabelModal] = useState(false);
    const [isOpenedFolder, setIsOpenedFolder] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [fileClicked, setFileClicked] = useState(false);
    const [isShipmentModal, setIsShipmentModal] = useState(false);
    const [renamedData, setRenamedData] = useState("");
    const [changedFolderColor, setChangedFolderColor] = useState("");
    const [childContent, setChildContent] = useState(
        searchResults ? [...searchResults?.folders, ...searchResults?.files] : []
    );
    const [createFolderData, setCreateFolderData] = useState({
        name: "",
        labelColor: "",
        service: [],
        isForShipment: false,
        shipmentId: "",
        parentFolderId: "",
    });
    const [documentLoading, setDocumentLoading] = useState(false);
    const [progress, setProgress] = useState({
        progress: 0,
    });
    const [searched, setSearched] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedMvxId, setSelectedMvxId] = useState("");
    const { pendingShipments, isPendingShipmentsLoading } = useSelector((state) => state.shipment);

    const shipments = useMemo(() => {
        const shipmentsCut = pendingShipments?.data ? [...pendingShipments.data] : [];
        if (shipmentsCut.length > 4) shipmentsCut.length = 4;
        return shipmentsCut;
    }, [pendingShipments]);

    const searchShipment = (id) => {
        const regex = /\d+/g;
        if (id) {
            if (Boolean(id.match(regex))) {
                setSearched(true);
                dispatch(
                    shipmentActions.fetchPendingShipments("pending", 1, id.match(regex).join(""))
                );
            } else {
                toast.custom((t) => (
                    <CustomToast t={t} message="Invalid shipment id" type="error" />
                ));
            }
        }
    };
    const progressRef = useRef(null);

    const dispatch = useDispatch();

    const {
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
        searchFoldersLoading,
    } = useSelector((state) => state.folder);

    const handleChange = (name, value) => {
        setCreateFolderData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

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

    const createFolder = () => {
        const body = {
            folderName: createFolderData.name,
            isForShipment: createFolderData.isForShipment,
            service: createFolderData.service,
            colorLabel: createFolderData.labelColor,
            path: selectedFoldersArr[selectedFoldersArr.length - 1]?.path,
            parentFolderId: selectedFoldersArr[selectedFoldersArr.length - 1]?._id,
        };

        if (createFolderData.isForShipment) {
            body.shipmentId = selectedId;
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
                          setStep((prev) => prev + 1);
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
        return childContent && childContent.length > 0 ? (
            childContent?.map((content) => {
                return (
                    <div key={content._id}>
                        <>
                            <div>
                                <hr className="max-sm:hidden" />
                                <div
                                    onClick={() => {
                                        if (content?.folderName) {
                                            setSelectedFoldersArr((prev) => [...prev, content]);
                                            setStep((prev) => prev + 1);
                                            setSearchResults(null);
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
                                        {content?.fileName &&
                                            displayFileIcon(content?.fileExt, isChildDirListMode)}
                                        <span className="text-inherit">
                                            {_.truncate(content?.fileName || content?.folderName, {
                                                length: 40,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                        <div className="flex items-center gap-2.5">
                                            {/* <span className="w-6 h-6 rounded-full bg-mvx-neutral" /> */}
                                            <span className="text-inherit">
                                                {_.truncate(content?.admin?.fullName, {
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
                                                content?.folderName
                                                    ? "left-[-160px]"
                                                    : "left-[-140px]"
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
                            <div
                                onClick={() => {
                                    if (content?.folderName) {
                                        setSelectedFoldersArr((prev) => [...prev, content]);
                                        setStep((prev) => prev + 1);
                                        setSearchResults(null);
                                        setFileClicked(false);
                                    } else {
                                        setSelectedContent(content);
                                        setFileClicked(true);
                                    }
                                }}
                                className="hidden max-sm:block cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 my-4 text-sm font-rocGroteskMedium text-gun-metal">
                                        <div>
                                            {content?.folderName && (
                                                <i
                                                    style={{ color: content?.colorLabel }}
                                                    className={`ri-folder-5-fill text-3xl folder-icon before:text-inherit folder-icon`}
                                                ></i>
                                            )}
                                            {content?.fileName &&
                                                displayFileIcon(
                                                    content?.fileExt,
                                                    isChildDirListMode
                                                )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium mb-1">
                                                {_.truncate(
                                                    content?.fileName || content?.folderName,
                                                    {
                                                        length: 35,
                                                    }
                                                )}
                                            </p>
                                            {content?.folderName && (
                                                <p className="text-xs font-rocGroteskMedium w-fit text-mvx-neutral">
                                                    {content.files.length +
                                                        content.subFolders.length}{" "}
                                                    file
                                                    {content.files.length +
                                                        content.subFolders.length !==
                                                        1 && "s"}{" "}
                                                    | Created:{" "}
                                                    {moment(content.createdAt).format(
                                                        "MMM DD, YYYY"
                                                    )}
                                                </p>
                                            )}
                                            {content?.fileName && (
                                                <p className="text-xs font-rocGroteskMedium w-fit text-mvx-neutral">
                                                    Modified:{" "}
                                                    {moment(content.updatedAt).format(
                                                        "MMM DD, YYYY"
                                                    )}
                                                </p>
                                            )}
                                        </div>
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
                                                content?.folderName
                                                    ? "left-[-160px]"
                                                    : "left-[-140px]"
                                            } shadow-dropdownShadow border-0 rounded !max-h-fit`}
                                            dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                            name={"dropdown"}
                                            dropdownOptions={displayOption(
                                                content?.folderName ? "folder" : "file"
                                            )}
                                        />
                                    </div>
                                </div>

                                <hr />
                            </div>
                        </>
                    </div>
                );
            })
        ) : (
            <div className="flex justify-center relative">
                <div className="w-[20%] max-sm:w-[90%] max-lg:w-[40%] my-[60px] flex flex-col items-center justify-center">
                    <i className="ri-file-add-fill text-[45px] mb-4"></i>
                    <p className="font-rocGroteskBold text-center text-lg text-gun-metal mb-1">
                        {searchResults ? "No results found" : "No files yet"}
                    </p>
                    {!searchResults && (
                        <div>
                            <p className="font-rocGroteskRegular text-center text-sm text-gun-metal mb-6">
                                Drag & drop files here or Click on the 'upload' button below
                            </p>
                            <div>
                                <button className="text-white font-rocGroteskMedium text-sm bg-pacific-cyan rounded w-full py-2">
                                    Upload file
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <input
                    type={"file"}
                    name="fileUpload"
                    onChange={(event) => {
                        handleUpload(event.target.files[0].name, event.target.files[0]);
                    }}
                    className="w-full h-full absolute cursor-pointer opacity-0 top-0"
                    accept="*"
                />
            </div>
        );
    };

    const displayGridContent = () => {
        const foldersData = childContent?.filter((item) => Boolean(item?.folderName));
        const filesData = childContent?.filter((item) => Boolean(item?.fileName));

        return childContent && childContent.length > 0 ? (
            <div>
                {foldersData && foldersData.length > 0 && (
                    <div>
                        <p className="text-base font-rocGroteskMedium mb-5">Folders</p>
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr_1fr_1fr] max-sm:grid-cols-[1fr_1fr] gap-x-6 gap-y-10 max-sm:gap-x-10">
                            {foldersData?.map((content) => {
                                return (
                                    <div
                                        key={content?._id}
                                        onClick={() => {
                                            setSelectedFoldersArr((prev) => [...prev, content]);
                                            setStep((prev) => prev + 1);
                                            setSearchResults(null);
                                        }}
                                        className="h-[158px] w-[155px] max-sm:w-full max-sm:h-full cursor-pointer flex items-center p-4 relative rounded-sm hover:bg-mvx-light-blue bg-[#FAFBFC]"
                                    >
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute top-[-30px] right-[-30px] w-[60px] h-[60px] max-sm:h-[30px] max-sm:top-[-5px] max-sm:right-[-20px] rotate-45  bg-white"
                                        ></div>
                                        <div className="w-full">
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                                            >
                                                <Dropdown
                                                    value={""}
                                                    dropdown={
                                                        <span
                                                            onClick={() =>
                                                                setSelectedContent(content)
                                                            }
                                                            className="material-icons text-base"
                                                        >
                                                            more_vert
                                                        </span>
                                                    }
                                                    dropdownContainerClasses={
                                                        "max-sm:left-[-15px] shadow-dropdownShadow border-0 rounded !max-h-fit "
                                                    }
                                                    dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                                    name={"dropdown"}
                                                    dropdownOptions={displayOption("folder")}
                                                />
                                            </div>
                                            <div className="mt-7">
                                                <i
                                                    style={{ color: content?.colorLabel }}
                                                    className={`ri-folder-5-fill text-3xl folder-icon before:text-inherit folder-icon`}
                                                ></i>
                                            </div>
                                            <p className="text-xs font-rocGroteskMedium mt-3 mb-[2px]">
                                                {_.truncate(
                                                    content?.fileName || content?.folderName,
                                                    {
                                                        length: 20,
                                                    }
                                                )}
                                            </p>
                                            {content?.folderName && (
                                                <p className="text-[10px] font-rocGroteskMedium cursor-pointer w-fit text-mvx-neutral">
                                                    {content.files.length +
                                                        content.subFolders.length}{" "}
                                                    file
                                                    {content.files.length +
                                                        content.subFolders.length !==
                                                        1 && "s"}{" "}
                                                    |{" "}
                                                    {moment(content.updatedAt).format("DD.MM.YYYY")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {filesData && filesData.length > 0 && (
                    <div className="my-8">
                        <p className="text-base font-rocGroteskMedium mb-5">Files</p>
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr_1fr_1fr] max-sm:grid-cols-[1fr_1fr] gap-x-6 gap-y-10 max-sm:gap-x-10">
                            {filesData?.map((content) => {
                                return (
                                    <div
                                        key={content?._id}
                                        onClick={() => {
                                            setSelectedContent(content);
                                            setFileClicked(true);
                                        }}
                                        className="h-[158px] w-[155px] max-sm:w-full max-sm:h-full cursor-pointer flex items-center p-4 relative rounded-sm hover:bg-mvx-light-blue bg-[#FAFBFC]"
                                    >
                                        <div className="w-full">
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className=" flex items-center justify-end text-sm font-rocGroteskMedium text-gun-metal"
                                            >
                                                <Dropdown
                                                    value={""}
                                                    dropdown={
                                                        <span
                                                            className="material-icons text-base"
                                                            onClick={() =>
                                                                setSelectedContent(content)
                                                            }
                                                        >
                                                            more_horiz
                                                        </span>
                                                    }
                                                    dropdownContainerClasses={
                                                        "max-sm:left-[-130px] shadow-dropdownShadow border-0 rounded !max-h-fit "
                                                    }
                                                    dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                                    name={"dropdown"}
                                                    dropdownOptions={displayOption("file")}
                                                />
                                            </div>
                                            <div className="mt-7 flex justify-center">
                                                {displayFileIcon(content.fileExt)}
                                            </div>
                                            <p className="text-xs text-center font-rocGroteskMedium mt-7 mb-[2px]">
                                                {_.truncate(content?.fileName, {
                                                    length: 20,
                                                })}
                                            </p>
                                            {content?.folderName && (
                                                <p className="text-[10px] font-rocGroteskMedium cursor-pointer w-fit text-mvx-neutral">
                                                    {content.files.length +
                                                        content.subFolders.length}{" "}
                                                    file
                                                    {content.files.length +
                                                        content.subFolders.length !==
                                                        1 && "s"}{" "}
                                                    |{" "}
                                                    {moment(content.updatedAt).format("DD.MM.YYYY")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex justify-center relative">
                <div className="w-[20%] max-sm:w-[90%] max-lg:w-[40%] my-[60px] flex flex-col items-center justify-center">
                    <i className="ri-file-add-fill text-[45px] mb-4"></i>
                    <p className="font-rocGroteskBold text-center text-lg text-gun-metal mb-1">
                        {searchResults ? "No results found" : "No files yet"}
                    </p>
                    {!searchResults && (
                        <div>
                            <p className="font-rocGroteskRegular text-center text-sm text-gun-metal mb-6">
                                Drag & drop files here or Click on the 'upload' button below
                            </p>
                            <div>
                                <button className="text-white font-rocGroteskMedium text-sm bg-pacific-cyan rounded w-full py-2">
                                    Upload file
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <input
                    type={"file"}
                    name="fileUpload"
                    onChange={(event) => {
                        handleUpload(event.target.files[0].name, event.target.files[0]);
                    }}
                    className="w-full h-full absolute cursor-pointer opacity-0 top-0"
                    accept="*"
                />
            </div>
        );
    };

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

    useEffect(() => {
        if (!searchResults) {
            dispatch(
                folderActions.fetchFolderContent(
                    selectedFoldersArr[selectedFoldersArr.length - 1]?._id
                )
            );
        }

        dispatch(folderActions.resetDuplicateFileData());
        dispatch(folderActions.resetCopyFolderData());
    }, [dispatch, selectedFoldersArr, duplicateFileSuccess, copyFolderSuccess, searchResults]);

    useEffect(() => {
        if (Boolean(folderContentSuccess || searchResults)) {
            setChildContent(
                searchResults
                    ? [...searchResults?.folders, ...searchResults?.files]
                    : [
                          ...folderContentSuccess.data?.subFolderData,
                          ...folderContentSuccess.data?.filesData,
                      ]
            );
            dispatch(folderActions.resetFetchFolderData());
        }
    }, [dispatch, folderContentSuccess, searchResults]);

    useEffect(() => {
        if (Boolean(createFileSuccess)) {
            setChildContent((prev) => [createFileSuccess.file, ...prev]);
            dispatch(folderActions.resetCreateFileData());
            setDocumentLoading(false);
        }
    }, [dispatch, createFileSuccess]);

    useEffect(() => {
        if (Boolean(createFolderSuccess)) {
            setChildContent((prev) => [createFolderSuccess.folder, ...prev]);

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
        if (Boolean(deleteFileSuccess || deleteFolderSuccess)) {
            const childContentCopy = [...childContent];
            const updatedContentIdx = childContentCopy.findIndex(
                (item) => item._id === selectedContent?._id
            );

            if (updatedContentIdx !== -1) {
                childContentCopy.splice(updatedContentIdx, 1);
            }
            setChildContent(childContentCopy);
            dispatch(folderActions.resetDeleteFileData());
            dispatch(folderActions.resetDeleteFolderData());
            setDeleteModal(false);
        }
    }, [dispatch, deleteFileSuccess, deleteFolderSuccess, childContent, selectedContent?._id]);

    useEffect(() => {
        if (Boolean(updateFolderSuccess)) {
            const childContentCopy = [...childContent];
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
            setChildContent(childContentCopy);
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
        childContent,
        selectedFoldersArr,
        setSelectedFoldersArr,
        isOpenedFolder,
    ]);

    useEffect(() => {
        if (Boolean(updateFileSuccess)) {
            const childContentCopy = [...childContent];
            const updatedFileIdx = childContentCopy.findIndex(
                (item) => item._id === updateFileSuccess?.searchResult?._id
            );

            if (updatedFileIdx !== -1) {
                childContentCopy[updatedFileIdx] = updateFileSuccess?.searchResult;
            }
            setChildContent(childContentCopy);
            dispatch(folderActions.resetUpdateFileData());
            setRenameModal(false);
            setRenamedData("");
        }
    }, [dispatch, updateFileSuccess, childContent]);

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

    return (
        <div>
            <div className="px-[104px] max-sm:px-4 max-lg:px-10 relative">
                <div
                    className={`font-rocGroteskBold text-base mt-12 max-sm:hidden mb-4 flex flex-wrap items-center ${
                        searchResults && "!hidden"
                    }`}
                >
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                            setStep(0);
                            setSelectedFoldersArr([]);
                            setSearchResults(null);
                        }}
                    >
                        Folders
                    </span>
                    <span className="material-icons-outlined text-base">chevron_right</span>
                    {selectedFoldersArr.map((item, idx) => {
                        return (
                            <p key={item.folderName + idx} className="flex items-center">
                                <span
                                    onClick={() => {
                                        const selectedFoldersArrCopy = [...selectedFoldersArr];
                                        selectedFoldersArrCopy.splice(idx + 1);
                                        setSelectedFoldersArr(selectedFoldersArrCopy);
                                        setSearchResults(null);
                                    }}
                                    className="cursor-pointer hover:underline"
                                >
                                    {_.truncate(item?.folderName, {
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
                <div className={` mt-6 max-sm:block mb-4 hidden ${searchResults && "!hidden"}`}>
                    <div className="flex items-center justify-between">
                        <i
                            onClick={() => {
                                const selectedFoldersArrCopy = [...selectedFoldersArr];

                                if (selectedFoldersArrCopy?.length >= 2) {
                                    selectedFoldersArrCopy.pop();
                                    setSelectedFoldersArr(selectedFoldersArrCopy);
                                } else {
                                    setStep(0);
                                    setSelectedFoldersArr([]);
                                }

                                setSearchResults(null);
                            }}
                            className="ri-arrow-left-line text-lg cursor-pointer"
                        ></i>
                        <div>
                            <p className="font-rocGroteskBold text-lg m-auto text-center">
                                {_.truncate(
                                    selectedFoldersArr?.[selectedFoldersArr.length - 1]?.folderName,
                                    {
                                        length: 32,
                                    }
                                )}
                            </p>
                            <p className="text-sm font-rocGroteskMedium m-auto text-center w-fit text-mvx-neutral">
                                {selectedFoldersArr?.[selectedFoldersArr.length - 1]?.files
                                    ?.length +
                                    selectedFoldersArr?.[selectedFoldersArr.length - 1]?.subFolders
                                        ?.length}{" "}
                                file
                                {selectedFoldersArr?.[selectedFoldersArr.length - 1]?.files
                                    ?.length +
                                    selectedFoldersArr?.[selectedFoldersArr.length - 1]?.subFolders
                                        ?.length !==
                                    1 && "s"}{" "}
                                | Created:{" "}
                                {moment(
                                    selectedFoldersArr?.[selectedFoldersArr.length - 1]?.createdAt
                                ).format("MMM DD, YYYY")}
                            </p>
                        </div>
                        <div>
                            <Dropdown
                                value={""}
                                dropdown={
                                    <span
                                        onClick={() => {
                                            setSelectedContent(
                                                selectedFoldersArr[selectedFoldersArr.length - 1]
                                            );
                                            setIsOpenedFolder(true);
                                        }}
                                        className="material-icons text-base"
                                    >
                                        more_vert
                                    </span>
                                }
                                dropdownContainerClasses={
                                    "shadow-dropdownShadow left-[-160px] border-0 rounded !max-h-fit !py-0"
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
                                                folderActions.downloadFolder(selectedContent?._id)
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
                </div>
                <div
                    className={`flex justify-between items-center mb-6 ${
                        searchResults && "mt-12 max-sm:flex-col max-sm:items-start"
                    }`}
                >
                    <div
                        className={`flex items-center gap-3 max-sm:hidden ${
                            searchResults && "!hidden"
                        }`}
                    >
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
                                            selectedFoldersArr[selectedFoldersArr.length - 1]
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
                                            folderActions.downloadFolder(selectedContent?._id)
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
                    <div
                        className={`font-rocGroteskBold text-base hidden flex-wrap items-center ${
                            searchResults && "!flex max-sm:mb-6"
                        }`}
                    >
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                setStep(0);
                                setSelectedFoldersArr([]);
                                setSearchResults(null);
                                setActiveFilterChildOption(null);
                                setSearchField("");
                                setSearchInput("");
                            }}
                        >
                            Folders
                        </span>
                        <span className="material-icons-outlined text-base">chevron_right</span>
                        <span>Results</span>
                    </div>
                    <div className="flex items-center gap-2.5 max-sm:gap-0 max-sm:w-full max-sm:justify-between">
                        {isChildDirListMode ? (
                            <i
                                onClick={() => setIsChildDirListMode((prev) => !prev)}
                                className="ri-layout-grid-fill text-[20px] cursor-pointer"
                            ></i>
                        ) : (
                            <i
                                onClick={() => setIsChildDirListMode((prev) => !prev)}
                                className="ri-list-unordered text-[20px] cursor-pointer"
                            ></i>
                        )}
                        <div className="flex items-center relative">
                            <i className="ri-search-2-line absolute left-[14px] mt-[-2px] text-lg before:content-['\f0cd'] before:text-mvx-neutral "></i>
                            <input
                                type={"text"}
                                disabled={folderContentLoading || searchFoldersLoading}
                                value={searchInput}
                                onFocus={() => setSearchInFocus(true)}
                                onBlur={() => setSearchInFocus(false)}
                                className={`h-[40px] ${
                                    searchInFocus || searchField ? "lg:w-[350px]" : "w-[230px]"
                                } transition-[width] ease-in-out delay-150 duration-300 rounded border pl-[42px] pr-6 text-sm placeholder:text-sm placeholder:text-mvx-neutral flex items-center`}
                                placeholder="Search folders and files"
                                onInput={_.debounce((evt) => {
                                    setActiveFilterChildOption(null);
                                    setSearchField(evt.target.value);
                                }, 800)}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`${
                            !isChildDirListMode && "border-0"
                        } border rounded max-sm:border-none`}
                    >
                        <div
                            className={`${
                                !isChildDirListMode && "!hidden"
                            } max-sm:hidden w-full grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.2fr] gap-3 py-3 px-4 bg-[#FAFBFC]`}
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
                            {folderContentLoading || searchFoldersLoading ? (
                                <div>
                                    {isChildDirListMode && <hr></hr>}
                                    <div className="flex justify-center my-20">
                                        <Loader color="gun-metal" size={10} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {isChildDirListMode
                                        ? displayListContent()
                                        : displayGridContent()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="fixed bottom-20 right-6 hidden max-sm:block">
                    <Dropdown
                        value={""}
                        dropdown={
                            <div className="flex items-center justify-center rounded-full w-12 h-12 bg-pacific-cyan shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                <span className="material-icons text-white">add</span>
                            </div>
                        }
                        dropdownContainerClasses={
                            "!py-0 left-[-88px] !top-[-105px] shadow-dropdownShadow border-0 rounded"
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
                </div>
            </div>
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
                                <div
                                    className={`${
                                        createFolderData.isForShipment && "mb-6"
                                    } flex items-center gap-3.5`}
                                >
                                    <div>
                                        <label className="switch relative inline-block w-[38px] h-[25px]">
                                            <input
                                                type="checkbox"
                                                checked={createFolderData.isForShipment}
                                                className="opacity-0 w-0 h-0"
                                                name="isForShipment"
                                                onChange={(event) => {
                                                    setIsShipmentModal(true);
                                                    setSelectedId("");
                                                    setSelectedMvxId("");
                                                    handleChange(
                                                        event.target.name,
                                                        !createFolderData.isForShipment
                                                    );
                                                }}
                                            />
                                            <span
                                                className={`slider round absolute ${
                                                    createFolderData.isForShipment &&
                                                    "before:translate-x-[24px]"
                                                } ${
                                                    createFolderData.isForShipment
                                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                                    createFolderData.isForShipment
                                                        ? "before:left-[-9px]"
                                                        : "before:left-0"
                                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                                            ></span>
                                        </label>
                                    </div>

                                    <p className="text-sm font-rocGroteskMedium ">
                                        This folder is for a shipment
                                    </p>
                                </div>
                                {createFolderData.isForShipment && (
                                    <div className="">
                                        <p className="text-sm mb-1 font-rocGroteskMedium ">
                                            Shipment ID
                                        </p>
                                        <input
                                            value={"TA" + selectedMvxId}
                                            type="text"
                                            className="border border-gray-200 p-3 rounded outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                            placeholder="TA10993"
                                            required
                                            name="shipmentId"
                                            disabled={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t border-r px-3`}
                                onClick={() => {
                                    setCreateFolderModal(false);
                                    setSelectedId("");
                                    setSelectedMvxId("");
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
                                        {_.truncate(
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
            {createFolderData.isForShipment && isShipmentModal && (
                <ModalContainer tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]">
                    <div className="bg-white rounded-lg overflow-hidden [&*]:font-rocGrotesk">
                        <div className="my-6 flex flex-col justify-center items-center">
                            <p className="text-[20px] font-rocGroteskBold mb-1">
                                Select a shipment
                            </p>
                            <p className="text-sm">Select a shipment to add your quotation</p>
                        </div>
                        <div className="mb-6">
                            <CreateToCustomer
                                {...{
                                    isPendingShipmentsLoading,
                                    searchShipment,
                                    searched,
                                    selectedId,
                                    setSearched,
                                    setSelectedId,
                                    shipments,
                                }}
                                setSelectedMvxId={setSelectedMvxId}
                                hideCreateNewShipment={true}
                            />
                        </div>

                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-t  px-3`}
                                onClick={() => {
                                    handleChange("isForShipment", false);
                                    setIsShipmentModal(false);
                                    setSelectedId("");
                                    setSelectedMvxId("");
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsShipmentModal(false);
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default ChildDirectory;
