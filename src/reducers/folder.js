import { folderConstants } from "constants";

const initialState = {
    folderContentLoading: false,
    folderContentSuccess: null,
    folderContentError: "",
    rootFolderLoading: false,
    rootFolderSuccess: null,
    rootFolderError: "",
    createFolderLoading: false,
    createFolderSuccess: null,
    createFolderError: "",
    createFileLoading: false,
    createFileSuccess: null,
    createFileError: "",
    updateFolderLoading: false,
    updateFolderSuccess: null,
    updateFolderError: "",
    deleteFolderLoading: false,
    deleteFolderSuccess: null,
    deleteFolderError: "",
    copyFolderLoading: false,
    copyFolderSuccess: null,
    copyFolderError: "",
    deleteFileLoading: false,
    deleteFileSuccess: null,
    deleteFileError: "",
    updateFileLoading: false,
    updateFileSuccess: null,
    updateFileError: "",
    duplicateFileLoading: false,
    duplicateFileSuccess: null,
    duplicateFileError: "",
    downloadFolderLoading: false,
    downloadFolderSuccess: null,
    downloadFolderError: "",
    searchFoldersLoading: false,
    searchFoldersSuccess: null,
    searchFoldersError: "",
    shipmentFilesAndFoldersLoading: false,
    shipmentFilesAndFoldersSuccess: null,
    shipmentFilesAndFoldersError: "",
};

export function folder(state = initialState, { type, payload }) {
    switch (type) {
        case folderConstants.FETCH_FOLDER_CONTENT_REQUEST:
            return {
                ...state,
                folderContentLoading: true,
                folderContentSuccess: null,
                folderContentError: "",
            };
        case folderConstants.FETCH_FOLDER_CONTENT_SUCCESS:
            return {
                ...state,
                folderContentLoading: false,
                folderContentSuccess: payload,
                folderContentError: "",
            };
        case folderConstants.FETCH_FOLDER_CONTENT_FAILURE:
            return {
                ...state,
                folderContentLoading: false,
                folderContentSuccess: null,
                folderContentError: payload,
            };

        case folderConstants.FETCH_ROOT_FOLDER_REQUEST:
            return {
                ...state,
                rootFolderLoading: true,
                rootFolderSuccess: null,
                rootFolderError: "",
            };
        case folderConstants.FETCH_ROOT_FOLDER_SUCCESS:
            return {
                ...state,
                rootFolderLoading: false,
                rootFolderSuccess: payload,
                rootFolderError: "",
            };
        case folderConstants.FETCH_ROOT_FOLDER_FAILURE:
            return {
                ...state,
                rootFolderLoading: false,
                rootFolderSuccess: null,
                rootFolderError: payload,
            };

        case folderConstants.CREATE_FOLDER_REQUEST:
            return {
                ...state,
                createFolderLoading: true,
                createFolderSuccess: null,
                createFolderError: "",
            };
        case folderConstants.CREATE_FOLDER_SUCCESS:
            return {
                ...state,
                createFolderLoading: false,
                createFolderSuccess: payload,
                createFolderError: "",
            };
        case folderConstants.CREATE_FOLDER_FAILURE:
            return {
                ...state,
                createFolderLoading: false,
                createFolderSuccess: null,
                createFolderError: payload,
            };

        case folderConstants.CREATE_FILE_REQUEST:
            return {
                ...state,
                createFileLoading: true,
                createFileSuccess: null,
                createFileError: "",
            };
        case folderConstants.CREATE_FILE_SUCCESS:
            return {
                ...state,
                createFileLoading: false,
                createFileSuccess: payload,
                createFileError: "",
            };
        case folderConstants.CREATE_FILE_FAILURE:
            return {
                ...state,
                createFileLoading: false,
                createFileSuccess: null,
                createFileError: payload,
            };

        case folderConstants.UPDATE_FOLDER_REQUEST:
            return {
                ...state,
                updateFolderLoading: true,
                updateFolderSuccess: null,
                updateFolderError: "",
            };
        case folderConstants.UPDATE_FOLDER_SUCCESS:
            return {
                ...state,
                updateFolderLoading: false,
                updateFolderSuccess: payload,
                updateFolderError: "",
            };
        case folderConstants.UPDATE_FOLDER_FAILURE:
            return {
                ...state,
                updateFolderLoading: false,
                updateFolderSuccess: null,
                updateFolderError: payload,
            };

        case folderConstants.DELETE_FOLDER_REQUEST:
            return {
                ...state,
                deleteFolderLoading: true,
                deleteFolderSuccess: null,
                deleteFolderError: "",
            };
        case folderConstants.DELETE_FOLDER_SUCCESS:
            return {
                ...state,
                deleteFolderLoading: false,
                deleteFolderSuccess: payload,
                deleteFolderError: "",
            };
        case folderConstants.DELETE_FOLDER_FAILURE:
            return {
                ...state,
                deleteFolderLoading: false,
                deleteFolderSuccess: null,
                deleteFolderError: payload,
            };

        case folderConstants.COPY_FOLDER_REQUEST:
            return {
                ...state,
                copyFolderLoading: true,
                copyFolderSuccess: null,
                copyFolderError: "",
            };
        case folderConstants.COPY_FOLDER_SUCCESS:
            return {
                ...state,
                copyFolderLoading: false,
                copyFolderSuccess: payload,
                copyFolderError: "",
            };
        case folderConstants.COPY_FOLDER_FAILURE:
            return {
                ...state,
                copyFolderLoading: false,
                copyFolderSuccess: null,
                copyFolderError: payload,
            };

        case folderConstants.DELETE_FILE_REQUEST:
            return {
                ...state,
                deleteFileLoading: true,
                deleteFileSuccess: null,
                deleteFileError: "",
            };
        case folderConstants.DELETE_FILE_SUCCESS:
            return {
                ...state,
                deleteFileLoading: false,
                deleteFileSuccess: payload,
                deleteFileError: "",
            };
        case folderConstants.DELETE_FILE_FAILURE:
            return {
                ...state,
                deleteFileLoading: false,
                deleteFileSuccess: null,
                deleteFileError: payload,
            };

        case folderConstants.UPDATE_FILE_REQUEST:
            return {
                ...state,
                updateFileLoading: true,
                updateFileSuccess: null,
                updateFileError: "",
            };
        case folderConstants.UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFileLoading: false,
                updateFileSuccess: payload,
                updateFileError: "",
            };
        case folderConstants.UPDATE_FILE_FAILURE:
            return {
                ...state,
                updateFileLoading: false,
                updateFileSuccess: null,
                updateFileError: payload,
            };

        case folderConstants.DUPLICATE_FILE_REQUEST:
            return {
                ...state,
                duplicateFileLoading: true,
                duplicateFileSuccess: null,
                duplicateFileError: "",
            };
        case folderConstants.DUPLICATE_FILE_SUCCESS:
            return {
                ...state,
                duplicateFileLoading: false,
                duplicateFileSuccess: payload,
                duplicateFileError: "",
            };
        case folderConstants.DUPLICATE_FILE_FAILURE:
            return {
                ...state,
                duplicateFileLoading: false,
                duplicateFileSuccess: null,
                duplicateFileError: payload,
            };

        case folderConstants.DOWNLOAD_FOLDER_REQUEST:
            return {
                ...state,
                downloadFolderLoading: true,
                downloadFolderSuccess: null,
                downloadFolderError: "",
            };
        case folderConstants.DOWNLOAD_FOLDER_SUCCESS:
            return {
                ...state,
                downloadFolderLoading: false,
                downloadFolderSuccess: payload,
                downloadFolderError: "",
            };
        case folderConstants.DOWNLOAD_FOLDER_FAILURE:
            return {
                ...state,
                downloadFolderLoading: false,
                downloadFolderSuccess: null,
                downloadFolderError: payload,
            };

        case folderConstants.SEARCH_FOLDERS_REQUEST:
            return {
                ...state,
                searchFoldersLoading: true,
                searchFoldersSuccess: null,
                searchFoldersError: "",
            };
        case folderConstants.SEARCH_FOLDERS_SUCCESS:
            return {
                ...state,
                searchFoldersLoading: false,
                searchFoldersSuccess: payload,
                searchFoldersError: "",
            };
        case folderConstants.SEARCH_FOLDERS_FAILURE:
            return {
                ...state,
                searchFoldersLoading: false,
                searchFoldersSuccess: null,
                searchFoldersError: payload,
            };

        case folderConstants.FETCH_FOLDERS_BY_SHIPMENT_REQUEST:
            return {
                ...state,
                shipmentFilesAndFoldersLoading: true,
                shipmentFilesAndFoldersSuccess: null,
                shipmentFilesAndFoldersError: "",
            };
        case folderConstants.FETCH_FOLDERS_BY_SHIPMENT_SUCCESS:
            return {
                ...state,
                shipmentFilesAndFoldersLoading: false,
                shipmentFilesAndFoldersSuccess: payload,
                shipmentFilesAndFoldersError: "",
            };
        case folderConstants.FETCH_FOLDERS_BY_SHIPMENT_FAILURE:
            return {
                ...state,
                shipmentFilesAndFoldersLoading: false,
                shipmentFilesAndFoldersSuccess: null,
                shipmentFilesAndFoldersError: payload,
            };

        case folderConstants.RESET_FETCH_ROOT_FOLDER_SUCCESS:
            return {
                ...state,
                rootFolderLoading: false,
                rootFolderSuccess: null,
                rootFolderError: "",
            };
        case folderConstants.RESET_CREATE_FOLDER_SUCCESS:
            return {
                ...state,
                createFolderLoading: false,
                createFolderSuccess: null,
                createFolderError: "",
            };
        case folderConstants.RESET_CREATE_FILE_SUCCESS:
            return {
                ...state,
                createFileLoading: false,
                createFileSuccess: null,
                createFileError: "",
            };
        case folderConstants.RESET_FETCH_FOLDER_CONTENT_SUCCESS:
            return {
                ...state,
                folderContentLoading: false,
                folderContentSuccess: null,
                folderContentError: "",
            };
        case folderConstants.RESET_UPDATE_FOLDER_SUCCESS:
            return {
                ...state,
                updateFolderLoading: false,
                updateFolderSuccess: null,
                updateFolderError: "",
            };
        case folderConstants.RESET_DELETE_FOLDER_SUCCESS:
            return {
                ...state,
                deleteFolderLoading: false,
                deleteFolderSuccess: null,
                deleteFolderError: "",
            };
        case folderConstants.RESET_COPY_FOLDER_SUCCESS:
            return {
                ...state,
                copyFolderLoading: false,
                copyFolderSuccess: null,
                copyFolderError: "",
            };
        case folderConstants.RESET_DELETE_FILE_SUCCESS:
            return {
                ...state,
                deleteFileLoading: false,
                deleteFileSuccess: null,
                deleteFileError: "",
            };
        case folderConstants.RESET_UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFileLoading: false,
                updateFileSuccess: null,
                updateFileError: "",
            };
        case folderConstants.RESET_DUPLICATE_FILE_SUCCESS:
            return {
                ...state,
                duplicateFileLoading: false,
                duplicateFileSuccess: null,
                duplicateFileError: "",
            };
        case folderConstants.RESET_DOWNLOAD_FOLDER_SUCCESS:
            return {
                ...state,
                downloadFolderLoading: false,
                downloadFolderSuccess: null,
                downloadFolderError: "",
            };

        case folderConstants.RESET_SEARCH_FOLDERS_SUCCESS:
            return {
                ...state,
                searchFoldersLoading: false,
                searchFoldersSuccess: null,
                searchFoldersError: "",
            };

        default:
            return state;
    }
}
