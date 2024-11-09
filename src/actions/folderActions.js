import CustomToast from "components/common/CustomToast";
import { folderConstants } from "constants";
import toast from "react-hot-toast";
import { folderService } from "services";

export const folderActions = {
    fetchFolderContent,
    resetFetchRootFolderData,
    fetchRootFolder,
    createFolder,
    resetCreateFolderData,
    resetFetchFolderData,
    resetCreateFileData,
    createFile,
    updateFolder,
    resetUpdateFolderData,
    deleteFolder,
    resetDeleteFolderData,
    copyFolder,
    resetCopyFolderData,
    deleteFile,
    resetDeleteFileData,
    updateFile,
    resetUpdateFileData,
    duplicateFile,
    resetDuplicateFileData,
    downloadFolder,
    resetDownloadFolderData,
    searchFolders,
    resetSearchFolderData,
    fetchFolderAndFilesByShipmentId,
};

function fetchFolderContent(folderId) {
    return (dispatch) => {
        dispatch(request(folderConstants.FETCH_FOLDER_CONTENT_REQUEST));
        folderService.fetchFolderContent(folderId).then(
            (res) => {
                dispatch(success(folderConstants.FETCH_FOLDER_CONTENT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    console.error(error.message);
                    // toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.FETCH_FOLDER_CONTENT_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchRootFolder(page, startDate, endDate, countPerPage) {
    return (dispatch) => {
        dispatch(request(folderConstants.FETCH_ROOT_FOLDER_REQUEST));
        folderService.fetchRootFolder(page, startDate, endDate, countPerPage).then(
            (res) => {
                dispatch(success(folderConstants.FETCH_ROOT_FOLDER_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.FETCH_ROOT_FOLDER_FAILURE, error.message));
                }
            }
        );
    };
}

function createFolder(data) {
    return (dispatch) => {
        dispatch(request(folderConstants.CREATE_FOLDER_REQUEST));
        folderService.createFolder(data).then(
            (res) => {
                dispatch(success(folderConstants.CREATE_FOLDER_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"Folder created successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.CREATE_FOLDER_FAILURE, error.message));
                }
            }
        );
    };
}

function createFile(data) {
    return (dispatch) => {
        dispatch(request(folderConstants.CREATE_FILE_REQUEST));
        folderService.createFile(data).then(
            (res) => {
                dispatch(success(folderConstants.CREATE_FILE_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"File created successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.CREATE_FILE_FAILURE, error.message));
                }
            }
        );
    };
}

function updateFolder(data, folderId) {
    return (dispatch) => {
        dispatch(request(folderConstants.UPDATE_FOLDER_REQUEST));
        folderService.updateFolder(data, folderId).then(
            (res) => {
                dispatch(success(folderConstants.UPDATE_FOLDER_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"Folder updated successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.UPDATE_FOLDER_FAILURE, error.message));
                }
            }
        );
    };
}

function deleteFolder(folderId) {
    return (dispatch) => {
        dispatch(request(folderConstants.DELETE_FOLDER_REQUEST));
        folderService.deleteFolder(folderId).then(
            (res) => {
                dispatch(success(folderConstants.DELETE_FOLDER_SUCCESS, res));
                toast.custom((t) => (
                    <CustomToast t={t} message={"Folder deleted successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.DELETE_FOLDER_FAILURE, error.message));
                }
            }
        );
    };
}

function copyFolder(data) {
    return (dispatch) => {
        dispatch(request(folderConstants.COPY_FOLDER_REQUEST));
        folderService.copyFolder(data).then(
            (res) => {
                dispatch(success(folderConstants.COPY_FOLDER_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"Folder duplicated successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.COPY_FOLDER_FAILURE, error.message));
                }
            }
        );
    };
}

function deleteFile(fileId) {
    return (dispatch) => {
        dispatch(request(folderConstants.DELETE_FILE_REQUEST));
        folderService.deleteFile(fileId).then(
            (res) => {
                dispatch(success(folderConstants.DELETE_FILE_SUCCESS, res));
                toast.custom((t) => (
                    <CustomToast t={t} message={"File deleted successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.DELETE_FILE_FAILURE, error.message));
                }
            }
        );
    };
}

function updateFile(data, fileId) {
    return (dispatch) => {
        dispatch(request(folderConstants.UPDATE_FILE_REQUEST));
        folderService.updateFile(data, fileId).then(
            (res) => {
                dispatch(success(folderConstants.UPDATE_FILE_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"File updated successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.UPDATE_FILE_FAILURE, error.message));
                }
            }
        );
    };
}

function duplicateFile(data) {
    return (dispatch) => {
        dispatch(request(folderConstants.DUPLICATE_FILE_REQUEST));
        folderService.duplicateFile(data).then(
            (res) => {
                dispatch(success(folderConstants.DUPLICATE_FILE_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"File duplicated successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.DUPLICATE_FILE_FAILURE, error.message));
                }
            }
        );
    };
}

function downloadFolder(folderId) {
    return (dispatch) => {
        dispatch(request(folderConstants.DOWNLOAD_FOLDER_REQUEST));
        folderService.downloadFolder(folderId).then(
            (res) => {
                dispatch(success(folderConstants.DOWNLOAD_FOLDER_SUCCESS, res));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.DOWNLOAD_FOLDER_FAILURE, error.message));
                }
            }
        );
    };
}

function searchFolders(data) {
    return (dispatch) => {
        dispatch(request(folderConstants.SEARCH_FOLDERS_REQUEST));
        folderService.searchFolders(data).then(
            (res) => {
                dispatch(success(folderConstants.SEARCH_FOLDERS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(folderConstants.SEARCH_FOLDERS_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchFolderAndFilesByShipmentId(shipmentId) {
    return (dispatch) => {
        dispatch(request(folderConstants.FETCH_FOLDERS_BY_SHIPMENT_REQUEST));
        folderService.fetchFolderAndFilesByShipmentId(shipmentId).then(
            (res) => {
                dispatch(success(folderConstants.FETCH_FOLDERS_BY_SHIPMENT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    // toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(folderConstants.FETCH_FOLDERS_BY_SHIPMENT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function resetFetchRootFolderData() {
    return { type: folderConstants.RESET_FETCH_ROOT_FOLDER_SUCCESS };
}

function resetSearchFolderData() {
    return { type: folderConstants.RESET_SEARCH_FOLDERS_SUCCESS };
}

function resetDownloadFolderData() {
    return { type: folderConstants.RESET_DOWNLOAD_FOLDER_SUCCESS };
}

function resetDuplicateFileData() {
    return { type: folderConstants.RESET_DUPLICATE_FILE_SUCCESS };
}

function resetUpdateFileData() {
    return { type: folderConstants.RESET_UPDATE_FILE_SUCCESS };
}

function resetDeleteFileData() {
    return { type: folderConstants.RESET_DELETE_FILE_SUCCESS };
}

function resetCreateFolderData() {
    return { type: folderConstants.RESET_CREATE_FOLDER_SUCCESS };
}

function resetUpdateFolderData() {
    return { type: folderConstants.RESET_UPDATE_FOLDER_SUCCESS };
}

function resetCreateFileData() {
    return { type: folderConstants.RESET_CREATE_FILE_SUCCESS };
}

function resetFetchFolderData() {
    return { type: folderConstants.RESET_FETCH_FOLDER_CONTENT_SUCCESS };
}

function resetDeleteFolderData() {
    return { type: folderConstants.RESET_DELETE_FOLDER_SUCCESS };
}

function resetCopyFolderData() {
    return { type: folderConstants.RESET_COPY_FOLDER_SUCCESS };
}

function request(type) {
    return { type: type };
}
function success(type, data) {
    return { type: type, payload: data };
}
function failure(type, error) {
    return { type: type, payload: error ?? "" };
}
