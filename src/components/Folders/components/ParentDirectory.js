/* eslint-disable react-hooks/exhaustive-deps */
import { folderActions, shipmentActions } from "actions";
import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { firebaseService } from "services/firebaseService";
import CreateToCustomer from "components/common/CreateQuote/CreateToCustomer";
import toast from "react-hot-toast";
import CustomToast from "components/common/CustomToast";
import { isMobile } from "helpers";

const ParentDirectory = ({
    setStep,
    setSelectedFolder,
    selectedFolder,
    setSelectedFoldersArr,
    isListMode,
    setIslistMode,
    setSearchResults,
    setSearchField,
    searchInput,
    setSearchInput,
    setActiveFilterOption,
    activeFilterOption,
    setActiveFilterChildOption,
    activeFilterChildOption,
}) => {
    const filterRef = useRef(null);
    const [searchInFocus, setSearchInFocus] = useState(false);
    const [createFolderModal, setCreateFolderModal] = useState(false);
    const [addFilesModal, setAddFilesModal] = useState(false);
    const [isShipmentModal, setIsShipmentModal] = useState(false);
    const [renameModal, setRenameModal] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [colorLabelModal, setColorLabelModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openFilterChild, setOpenFilterChild] = useState(false);
    const [parentFolders, setParentFolders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [createFolderData, setCreateFolderData] = useState({
        name: "",
        labelColor: "",
        service: [],
        isForShipment: false,
        shipmentId: "",
    });
    const [renamedFolder, setRenamedFolder] = useState("");
    const [changedFolderColor, setChangedFolderColor] = useState("");
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
        rootFolderLoading,
        rootFolderSuccess,
        createFolderSuccess,
        createFolderLoading,
        createFileSuccess,
        updateFolderSuccess,
        updateFolderLoading,
        deleteFolderLoading,
        deleteFolderSuccess,
        copyFolderSuccess,
        downloadFolderSuccess,
        searchFoldersLoading,
        duplicateFileLoading,
    } = useSelector((state) => state.folder);
    const { ffProfile } = useSelector((state) => state.auth);

    const filterOptions = [
        {
            label: "File type",
            value: "fileType",
            children: [
                {
                    label: "Docs",
                    value: "doc",
                },
                {
                    label: "PDF",
                    value: "pdf",
                },
                {
                    label: "Excel",
                    value: "ppt",
                },
                {
                    label: "CSV",
                    value: "csv",
                },
                {
                    label: "PNG",
                    value: "png",
                },
                {
                    label: "JPG",
                    value: "jpg",
                },
            ],
        },
        {
            label: "Date",
            value: "date",
            children: [
                {
                    label: "Today",
                    value: 0,
                },
                {
                    label: "Last 7 days",
                    value: 7,
                },
                {
                    label: "Last 30 days",
                    value: 30,
                },
                {
                    label: "Last 90 days",
                    value: 90,
                },
                {
                    label: "Last year",
                    value: 365,
                },
            ],
        },
    ];

    const displayOptions = [
        {
            label: "Open folder",
            value: "Open folder",
            icon: <i className="ri-book-open-line text-base"></i>,
            action: () => {
                setSelectedFoldersArr((prev) => [...prev, selectedFolder]);
                setStep(1);
            },
        },
        {
            label: "Download folder",
            value: "Download folder",
            icon: <i className="ri-download-line text-base"></i>,
            action: () => {
                setDownloading(true);
                dispatch(folderActions.downloadFolder(selectedFolder?._id));
            },
        },
        {
            label: "Duplicate folder",
            value: "Duplicate folder",
            icon: <i className="ri-file-copy-fill text-base"></i>,
            action: () => {
                dispatch(folderActions.copyFolder({ folderId: selectedFolder?._id }));
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
                setRenamedFolder(selectedFolder?.folderName);
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
    ];

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
                    alink.download = selectedFolder?.folderName;
                    alink.click();

                    setDownloading(false);
                });
            });
        },
        [selectedFolder?.folderName, dispatch]
    );

    const handleUpload = (fileName, file) => {
        setAddFilesModal(false);
        setDocumentLoading(true);
        const dateStamp = new Date();
        const fileNameSplit = fileName.split(".");

        firebaseService.uploadFile(
            `relay_app/${process.env.REACT_APP_STAGE === "production" ? "production" : "staging"}/${
                ffProfile?.result?._id
            }/${parentFolders[0]?._id}/${dateStamp}${fileName}`,
            file,
            (url) => {
                const body = {
                    fileName: fileName,
                    folderId: parentFolders[0]?._id,
                    fileExt: fileNameSplit[fileNameSplit.length - 1],
                    url: url,
                    path: `relay_app/${
                        process.env.REACT_APP_STAGE === "production" ? "production" : "staging"
                    }/${ffProfile?.result?._id}/${parentFolders[0]?._id}/${dateStamp}${fileName}`,
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
            path: `relay_app/${
                process.env.REACT_APP_STAGE === "production" ? "production" : "staging"
            }/${ffProfile?.result?._id}`,
        };

        if (createFolderData.isForShipment) {
            body.shipmentId = selectedId;
        }

        return dispatch(folderActions.createFolder(body));
    };

    const displayFolders = () => {
        return parentFolders && parentFolders?.length > 0 ? (
            parentFolders
                .sort((a, b) => {
                    return moment(b.createdAt) - moment(a.createdAt);
                })
                ?.map((folder) => {
                    return (
                        <div key={folder?._id}>
                            {isListMode ? (
                                <>
                                    <div>
                                        <hr className="max-sm:hidden" />
                                        <div
                                            onClick={() => {
                                                setSelectedFoldersArr((prev) => [...prev, folder]);
                                                setCurrentPage(1);
                                                setStep(1);
                                                setSearchResults(null);
                                                setParentFolders([]);
                                            }}
                                            className="max-sm:hidden w-full grid grid-cols-[2.2fr_1.5fr_0.8fr_1fr_1fr_0.2fr] gap-3 py-3 px-4 cursor-pointer hover:bg-[#FAFBFC]"
                                        >
                                            <div className="flex items-center justify-start gap-2.5 text-sm font-rocGroteskMedium text-gun-metal">
                                                <i
                                                    style={{ color: folder?.colorLabel }}
                                                    className={`ri-folder-5-fill text-lg folder-icon before:text-inherit folder-icon`}
                                                ></i>
                                                <span className="text-inherit max-lg:block hidden">
                                                    {_.truncate(folder?.folderName, {
                                                        length: 20,
                                                    })}
                                                </span>
                                                <span className="text-inherit max-lg:hidden">
                                                    {_.truncate(folder?.folderName, {
                                                        length: 32,
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-inherit">
                                                        {_.truncate(folder?.admin?.fullName, {
                                                            length: 30,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="capitalize flex items-center justify-between text-sm font-rocGroteskMedium text-gun-metal pr-2">
                                                <span className="text-inherit">
                                                    {folder.files?.length +
                                                        folder.subFolders?.length}{" "}
                                                    file
                                                    {folder.files?.length +
                                                        folder.subFolders?.length !==
                                                        1 && "s"}
                                                </span>
                                            </div>

                                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {moment(folder.createdAt).format("MMM DD, YYYY")}
                                            </div>
                                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {moment(folder.updatedAt).format("MMM DD, YYYY")}
                                            </div>
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                                            >
                                                <Dropdown
                                                    value={""}
                                                    dropdown={
                                                        <span
                                                            className="material-icons text-base"
                                                            onClick={() => {
                                                                setSelectedFolder(folder);
                                                            }}
                                                        >
                                                            more_vert
                                                        </span>
                                                    }
                                                    dropdownContainerClasses={
                                                        "left-[-140px] shadow-dropdownShadow border-0 rounded !max-h-fit "
                                                    }
                                                    dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                                    name={"dropdown"}
                                                    dropdownOptions={displayOptions}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSelectedFoldersArr((prev) => [...prev, folder]);
                                                setCurrentPage(1);
                                                setStep(1);
                                                setSearchResults(null);
                                                setParentFolders([]);
                                            }}
                                            className="hidden max-sm:block cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 my-4 text-sm font-rocGroteskMedium text-gun-metal">
                                                    <div>
                                                        <i
                                                            style={{ color: folder?.colorLabel }}
                                                            className={`ri-folder-5-fill text-3xl folder-icon before:text-inherit folder-icon`}
                                                        ></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-rocGroteskMedium mb-1">
                                                            {_.truncate(folder?.folderName, {
                                                                length: 32,
                                                            })}
                                                        </p>
                                                        <p className="text-xs font-rocGroteskMedium w-fit text-mvx-neutral">
                                                            {folder.files?.length +
                                                                folder.subFolders?.length}{" "}
                                                            file
                                                            {folder.files?.length +
                                                                folder.subFolders?.length !==
                                                                1 && "s"}{" "}
                                                            | Created:{" "}
                                                            {moment(folder.createdAt).format(
                                                                "MMM DD, YYYY"
                                                            )}
                                                        </p>
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
                                                                className="material-icons text-base"
                                                                onClick={() => {
                                                                    setSelectedFolder(folder);
                                                                }}
                                                            >
                                                                more_vert
                                                            </span>
                                                        }
                                                        dropdownContainerClasses={
                                                            "left-[-160px] shadow-dropdownShadow border-0 rounded !max-h-fit"
                                                        }
                                                        dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                                        name={"dropdown"}
                                                        dropdownOptions={displayOptions}
                                                    />
                                                </div>
                                            </div>

                                            <hr />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div
                                    onClick={() => {
                                        setSelectedFoldersArr((prev) => [...prev, folder]);
                                        setCurrentPage(1);
                                        setStep(1);
                                        setSearchResults(null);
                                        setParentFolders([]);
                                    }}
                                    className="h-[158px] w-[155px] max-sm:w-full max-sm:h-full cursor-pointer  flex items-center p-4 relative rounded-sm hover:bg-mvx-light-blue bg-[#FAFBFC]"
                                >
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-[-30px] right-[-30px] w-[60px] h-[60px] max-sm:h-[30px] max-sm:top-[-5px] max-sm:right-[-20px] rotate-45 bg-white"
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
                                                        className="material-icons text-base"
                                                        onClick={() => {
                                                            setSelectedFolder(folder);
                                                        }}
                                                    >
                                                        more_vert
                                                    </span>
                                                }
                                                dropdownContainerClasses={
                                                    "max-sm:left-[-15px] shadow-dropdownShadow border-0 rounded !max-h-fit "
                                                }
                                                dropdownItemsClasses={`last:text-[#FF0000] last:hover:bg-[#FFF4F4] !py-2`}
                                                name={"dropdown"}
                                                dropdownOptions={displayOptions}
                                            />
                                        </div>
                                        <div className="mt-7">
                                            <i
                                                style={{ color: folder?.colorLabel }}
                                                className={`ri-folder-5-fill text-3xl folder-icon before:text-inherit folder-icon`}
                                            ></i>
                                        </div>
                                        <p className="text-xs font-rocGroteskMedium mt-3 mb-[2px]">
                                            {_.truncate(folder?.folderName, {
                                                length: 20,
                                            })}
                                        </p>
                                        <p className="text-[10px] font-rocGroteskMedium cursor-pointer w-fit text-mvx-neutral">
                                            {folder.files?.length + folder.subFolders?.length} file
                                            {folder.files?.length + folder.subFolders?.length !==
                                                1 && "s"}{" "}
                                            | {moment(folder.updatedAt).format("DD.MM.YYYY")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
        ) : (
            <div className="flex justify-center ">
                <div className="w-[20%] max-sm:w-[90%] max-lg:w-[40%] my-[60px] flex flex-col items-center justify-center">
                    <i className="ri-folder-upload-fill text-[45px] mb-4"></i>
                    <p className="font-rocGroteskBold text-center text-lg text-gun-metal mb-1">
                        No folders yet
                    </p>
                    <p className="font-rocGroteskRegular text-center text-sm text-gun-metal mb-6">
                        Click the button below to create a new folder
                    </p>
                    <button
                        onClick={() => setCreateFolderModal(true)}
                        className="text-white font-rocGroteskMedium text-sm bg-pacific-cyan rounded w-full py-2"
                    >
                        Create folder
                    </button>
                </div>
            </div>
        );
    };

    const onScroll = () => {
        let lastScrollTop = 0;
        let scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        let st = window.pageYOffset || document.documentElement.scrollTop;
        const condition = isMobile
            ? scrollTop + clientHeight >= scrollHeight - 65
            : scrollTop + clientHeight >= scrollHeight;

        if (condition && st > lastScrollTop) {
            if (pagination?.current < pagination?.number_of_pages) {
                setCurrentPage(() => pagination?.current + 1);
                setLoadMore(true);
            }
        }
    };

    useEffect(() => {
        dispatch(
            folderActions.fetchRootFolder(
                currentPage,
                typeof activeFilterChildOption === "number"
                    ? moment().subtract(activeFilterChildOption, "days").format("DD-MM-YYYY")
                    : null,
                typeof activeFilterChildOption === "number"
                    ? moment().add(1, "days").format("DD-MM-YYYY")
                    : null,
                28
            )
        );

        dispatch(folderActions.resetCopyFolderData());
    }, [dispatch, copyFolderSuccess, currentPage, activeFilterChildOption]);

    useEffect(() => {
        if (Boolean(rootFolderSuccess)) {
            if (currentPage > 1) {
                setParentFolders((prev) => _.uniqBy([...prev, ...rootFolderSuccess.data], "_id"));
            } else {
                setParentFolders(rootFolderSuccess.data);
            }
            setPagination(rootFolderSuccess?.pagination);
            setNumOfPages(rootFolderSuccess?.pagination?.number_of_pages);
            dispatch(folderActions.resetFetchRootFolderData());
            setTimeout(() => {
                setLoadMore(false);
            }, 800);
        }
    }, [rootFolderSuccess, activeFilterChildOption, currentPage, dispatch]);

    useEffect(() => {
        if (Boolean(createFolderSuccess)) {
            setParentFolders((prev) => [createFolderSuccess.folder, ...prev]);

            setCreateFolderModal(false);
            setCreateFolderData({
                name: "",
                labelColor: "",
                service: [],
                isForShipment: false,
                shipmentId: "",
            });
            setAddFilesModal(true);
            dispatch(folderActions.resetCreateFolderData());
        }
    }, [createFolderSuccess, dispatch]);

    useEffect(() => {
        if (Boolean(createFileSuccess)) {
            const folderCopy = [...parentFolders];
            folderCopy[0].files = [{}];
            setParentFolders(folderCopy);
            dispatch(folderActions.resetCreateFolderData());
            dispatch(folderActions.resetCreateFileData());
            setDocumentLoading(false);
            setAddFilesModal(false);
        }
    }, [dispatch, createFileSuccess, parentFolders]);

    useEffect(() => {
        if (Boolean(updateFolderSuccess)) {
            const parentFoldersCopy = [...parentFolders];
            const updatedFolderIdx = parentFoldersCopy.findIndex(
                (item) => item._id === updateFolderSuccess?.searchResult?._id
            );

            if (updatedFolderIdx !== -1) {
                parentFoldersCopy[updatedFolderIdx] = updateFolderSuccess?.searchResult;
            }
            setParentFolders(parentFoldersCopy);
            dispatch(folderActions.resetUpdateFolderData());
            setRenameModal(false);
            setColorLabelModal(false);
            setRenamedFolder("");
            setChangedFolderColor("");
            setChangedFolderColor("");
        }
    }, [dispatch, updateFolderSuccess, parentFolders]);

    useEffect(() => {
        if (Boolean(deleteFolderSuccess)) {
            const parentFoldersCopy = [...parentFolders];
            const updatedFolderIdx = parentFoldersCopy.findIndex(
                (item) => item._id === selectedFolder?._id
            );

            if (updatedFolderIdx !== -1) {
                parentFoldersCopy.splice(updatedFolderIdx, 1);
            }
            setParentFolders(parentFoldersCopy);
            dispatch(folderActions.resetDeleteFolderData());
            setDeleteModal(false);
        }
    }, [dispatch, deleteFolderSuccess, parentFolders, selectedFolder?._id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target) && openFilter) {
                setOpenFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef, openFilter]);

    useEffect(() => {
        let unSubscribe;

        if (downloadFolderSuccess && downloading) {
            firebaseService.downloadFolder(
                selectedFolder?._id,
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
    }, [downloadFolderSuccess, selectedFolder?._id, dispatch, downloading, handleDownloadFolder]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [onScroll]);

    return (
        <div>
            <div className="px-[104px] max-sm:px-4 max-lg:px-10 relative">
                <h2 className="font-rocGroteskBold text-[22px] mt-12 mb-4">Documents</h2>
                <div className="flex justify-between mb-10">
                    <div className="flex items-center gap-3 max-sm:hidden">
                        <button
                            onClick={() => setCreateFolderModal(true)}
                            disabled={rootFolderLoading}
                            className="bg-pacific-cyan rounded py-2 px-4 flex items-center justify-center gap-2"
                        >
                            <span className="text-sm font-rocGroteskMedium text-white">
                                Create Folder
                            </span>
                        </button>
                    </div>

                    <div
                        className={`flex items-center gap-2.5 max-sm:gap-0 max-sm:justify-between max-sm:w-full ${
                            parentFolders?.length === 0 && "!hidden"
                        }`}
                    >
                        {isListMode ? (
                            <i
                                onClick={() => setIslistMode((prev) => !prev)}
                                className="ri-layout-grid-fill text-[20px] cursor-pointer"
                            ></i>
                        ) : (
                            <i
                                onClick={() => setIslistMode((prev) => !prev)}
                                className="ri-list-unordered text-[20px] cursor-pointer"
                            ></i>
                        )}

                        <div className="flex items-center relative">
                            <i className="ri-search-2-line absolute left-[14px] mt-[-2px] text-lg before:content-['\f0cd'] before:text-mvx-neutral "></i>
                            <input
                                type={"text"}
                                disabled={rootFolderLoading}
                                value={searchInput}
                                onFocus={() => setSearchInFocus(true)}
                                onBlur={() => setSearchInFocus(false)}
                                className={`h-[40px] ${
                                    searchInFocus ? "lg:w-[350px]" : "w-[230px]"
                                } transition-[width] ease-in-out delay-150 duration-300 rounded border pl-[42px] pr-6 text-sm placeholder:text-sm placeholder:text-mvx-neutral flex items-center`}
                                placeholder="Search folders and files"
                                onInput={_.debounce((evt) => {
                                    setActiveFilterChildOption(null);
                                    setSearchField(evt.target.value);
                                }, 800)}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setOpenFilter(!openFilter);
                                    setOpenFilterChild(false);
                                }}
                                className="bg-mvx-light-blue rounded py-2 px-4 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-base">
                                    filter_list
                                </span>
                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                    Filter
                                </span>
                                {(Boolean(activeFilterChildOption) ||
                                    activeFilterChildOption === 0) && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenFilter(false);
                                            setOpenFilterChild(false);
                                            setActiveFilterOption(null);
                                            setActiveFilterChildOption(null);
                                            setCurrentPage(1);
                                        }}
                                        className="material-icons text-base"
                                    >
                                        cancel
                                    </span>
                                )}
                            </button>
                            {openFilter && (
                                <div
                                    ref={filterRef}
                                    className="absolute top-[38px] left-[-65px] max-lg:left-[-70px] max-lg:top-[40px]"
                                >
                                    <div
                                        className={`shadow-dropdownShadow rounded min-w-max py-2 bg-white relative w-full h-auto max-h-64 z-20 overflow-auto border `}
                                    >
                                        {filterOptions.map((option, idx) => {
                                            return (
                                                <div className="" key={idx}>
                                                    <div
                                                        onClick={() => {
                                                            setActiveFilterOption(option.value);
                                                            setOpenFilterChild(true);
                                                            if (
                                                                !option?.children &&
                                                                !option?.customChild
                                                            ) {
                                                                setOpenFilter(false);
                                                                setOpenFilterChild(false);
                                                                setActiveFilterChildOption(null);
                                                            }
                                                        }}
                                                        onMouseEnter={() => {
                                                            setActiveFilterOption(option.value);
                                                            setOpenFilterChild(true);
                                                            if (
                                                                !option?.children &&
                                                                !option?.customChild
                                                            ) {
                                                                setOpenFilter(false);
                                                                setOpenFilterChild(false);
                                                                setActiveFilterChildOption(null);
                                                            }
                                                        }}
                                                        className={`flex gap-8 items-center px-6 justify-between hover:bg-mvx-light-blue ${
                                                            option?.value === activeFilterOption &&
                                                            "bg-mvx-light-blue"
                                                        } cursor-pointer `}
                                                    >
                                                        <p
                                                            className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium text-inherit`}
                                                        >
                                                            {option?.icon && (
                                                                <span>{option?.icon}</span>
                                                            )}{" "}
                                                            <span className="text-inherit">
                                                                {option?.label}
                                                            </span>
                                                        </p>
                                                        {(option?.children ||
                                                            option?.customChild) && (
                                                            <span className="material-icons text-xl">
                                                                navigate_next
                                                            </span>
                                                        )}
                                                        {option?.value === activeFilterOption &&
                                                            !option?.children &&
                                                            !option?.customChild && (
                                                                <span className="material-icons text-mvx-black text-base">
                                                                    done
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {filterOptions.find((item) => item.value === activeFilterOption)
                                        ?.children &&
                                        filterOptions.find(
                                            (item) => item.value === activeFilterOption
                                        )?.children.length > 0 &&
                                        openFilterChild && (
                                            <div
                                                className={`shadow-dropdownShadow rounded min-w-max absolute py-2 bg-white absolute top-[30%] left-[-100%] w-full max-h-fit z-20 overflow-auto border `}
                                            >
                                                {filterOptions
                                                    .find(
                                                        (item) => item.value === activeFilterOption
                                                    )
                                                    .children.map(({ label, value, icon }) => {
                                                        return (
                                                            <div
                                                                key={value}
                                                                onClick={() => {
                                                                    setSearchField("");
                                                                    setActiveFilterChildOption(
                                                                        value
                                                                    );

                                                                    setOpenFilter(false);
                                                                }}
                                                                className={`flex gap-8 items-center pl-4 pr-1 justify-between hover:bg-mvx-light-blue ${
                                                                    value ===
                                                                        activeFilterChildOption &&
                                                                    "bg-mvx-light-blue"
                                                                } cursor-pointer `}
                                                            >
                                                                <p
                                                                    className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium text-inherit`}
                                                                >
                                                                    {icon && <span>{icon}</span>}{" "}
                                                                    <span className="text-inherit">
                                                                        {label}
                                                                    </span>
                                                                </p>

                                                                {value ===
                                                                    activeFilterChildOption && (
                                                                    <span className="material-icons text-mvx-black text-base">
                                                                        done
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    {filterOptions.find((item) => item.value === activeFilterOption)
                                        ?.customChild &&
                                        openFilterChild && (
                                            <div
                                                className={`shadow-dropdownShadow rounded min-w-max absolute py-2 bg-white absolute top-[32%] left-[-130%] max-lg:left-[-140%] w-full h-auto max-h-64 z-20 overflow-auto border `}
                                            >
                                                <div
                                                    className={`flex gap-8 items-center px-1 justify-between  cursor-pointer `}
                                                >
                                                    {
                                                        filterOptions.find(
                                                            (item) =>
                                                                item.value === activeFilterOption
                                                        ).customChild
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`${
                            !isListMode && "!border-0"
                        } border rounded max-sm:border-none mb-8`}
                    >
                        <div
                            className={`${
                                !isListMode && "!hidden"
                            } max-sm:hidden w-full grid grid-cols-[2.2fr_1.5fr_0.8fr_1fr_1fr_0.2fr] gap-3 py-3 px-4 bg-[#FAFBFC]`}
                        >
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                Folder name
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                created by
                            </div>

                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                no. of files
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                date created
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                last modified
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                        </div>
                        {(rootFolderLoading || duplicateFileLoading || searchFoldersLoading) &&
                        !loadMore ? (
                            <div>
                                {isListMode && <hr></hr>}
                                <div className="flex justify-center my-20">
                                    <Loader color="gun-metal" size={10} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={`${
                                        !isListMode &&
                                        parentFolders &&
                                        parentFolders?.length > 0 &&
                                        "grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-x-6 gap-y-10 max-lg:grid-cols-[1fr_1fr_1fr_1fr] max-sm:grid-cols-[1fr_1fr] max-sm:gap-x-10"
                                    }`}
                                >
                                    {displayFolders()}
                                </div>
                            </>
                        )}
                    </div>
                    {currentPage === numOfPages && (
                        <div className="flex w-full mt-2 justify-center">
                            <p className="text-sm font-rocGroteskMedium">End</p>
                        </div>
                    )}
                    {loadMore && rootFolderLoading && (
                        <div className="flex justify-center">
                            <Loader color="gun-metal" size={4} />
                        </div>
                    )}
                </div>
                <div className="fixed bottom-20 right-6 hidden max-sm:block">
                    <div
                        onClick={() => setCreateFolderModal(true)}
                        className="flex items-center justify-center rounded-full w-12 h-12 bg-pacific-cyan shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
                    >
                        <span className="material-icons text-white">add</span>
                    </div>
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
                                        <div onClick={() => setIsShipmentModal(true)}>
                                            <input
                                                value={"TA" + selectedMvxId}
                                                type="text"
                                                className="border border-gray-200 p-3 rounded outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                                placeholder="TA10993"
                                                name="shipmentId"
                                                disabled={true}
                                            />
                                        </div>
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
                                    Drag and drop files or folders right into this place or upload
                                    them directly from your device
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
                                    dispatch(folderActions.resetCreateFolderData());
                                    setAddFilesModal(false);
                                }}
                            >
                                skip
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
                                        Uploading ({((progress?.progress / 345) * 100).toFixed(0)}
                                        %)...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {renameModal && (
                <ModalContainer
                    showCloseIcon={false}
                    closeModal={() => {
                        setRenameModal(false);
                        setRenamedFolder("");
                    }}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="relative">
                            <div className="p-6">
                                <p className="text-[20px] mb-4 relative font-rocGroteskBold ">
                                    Rename folder
                                </p>
                                <div>
                                    <input
                                        value={renamedFolder}
                                        type="text"
                                        className="border border-gray-200 p-3 rounded outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                        placeholder="Folder name"
                                        name="renamedFolder"
                                        required
                                        onChange={({ target: { value } }) =>
                                            setRenamedFolder(value)
                                        }
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
                                    setRenamedFolder("");
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                disabled={!Boolean(renamedFolder)}
                                onClick={() => {
                                    dispatch(
                                        folderActions.updateFolder(
                                            { folderName: renamedFolder },
                                            selectedFolder?._id
                                        )
                                    );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                {updateFolderLoading ? (
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
                                            selectedFolder?._id
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
                                    Delete folder?
                                </p>
                                <p className="text-sm text-center px-4">
                                    Are you sure you want to delete{" "}
                                    <span className="font-rocGroteskMedium text-inherit">
                                        {_.truncate(selectedFolder?.folderName, {
                                            length: 40,
                                        })}
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
                                    dispatch(folderActions.deleteFolder(selectedFolder?._id));
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#EBECF0] py-5 border-t px-3`}
                            >
                                {deleteFolderLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Delete</p>
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

export default ParentDirectory;
