// import {
// AudioIcon,
// DocumentIcon,
// GenericIcon,
// GifIcon,
// ImageUploadedIcon,
// PdfUploadedIcon,
// PptxIcon,
// SpreadsheetIcon,
// VideoIcon,
// WordIcon,
// } from "assets/arts";

export const displayFileIcon = (ext, mode) => {
    switch (ext.toLowerCase()) {
        case "pdf":
            return (
                // <PdfUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/pdf_uploaded_icon_rudnrd.svg"
                    }
                    alt="pdf Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "png":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "jpg":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "jpeg":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "svg":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "tif":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "tiff":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "bmp":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "eps":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "psd":
            return (
                // <ImageUploadedIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687191068/Web%20App/external_pages/icons/image_uploaded_icon_wogklv.svg"
                    }
                    alt="pictorial Uploaded Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "gif":
            return (
                // <GifIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/gif_yibt0r.svg"
                    }
                    alt="gif icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "pptx":
            return (
                // <PptxIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/pptx_fu4jbp.svg"
                    }
                    alt="pptx icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "ppt":
            return (
                // <PptxIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/pptx_fu4jbp.svg"
                    }
                    alt="pptx icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "odp":
            return (
                // <PptxIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/pptx_fu4jbp.svg"
                    }
                    alt="pptx icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "ods":
            return (
                // <SpreadsheetIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/spreadsheet_uysqjn.svg"
                    }
                    alt="spreadsheet icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "odt":
            return (
                // <DocumentIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/document_ilemow.svg"
                    }
                    alt="Document Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "rtf":
            return (
                // <DocumentIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/document_ilemow.svg"
                    }
                    alt="Document Icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "xls":
            return (
                // <SpreadsheetIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/spreadsheet_uysqjn.svg"
                    }
                    alt="spreadsheet icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "xlsx":
            return (
                // <SpreadsheetIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/spreadsheet_uysqjn.svg"
                    }
                    alt="spreadsheet icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "doc":
            return (
                // <WordIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264153/Web%20App/dashboard/shipment_folder/word_awev5o.svg"
                    }
                    alt="word icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "docx":
            return (
                // <WordIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264153/Web%20App/dashboard/shipment_folder/word_awev5o.svg"
                    }
                    alt="word icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "mp3":
            return (
                // <AudioIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/audio_ik5vee.svg"
                    }
                    alt="audio icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "wav":
            return (
                // <AudioIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/audio_ik5vee.svg"
                    }
                    alt="audio icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "aiff":
            return (
                // <AudioIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/audio_ik5vee.svg"
                    }
                    alt="audio icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "aac":
            return (
                // <AudioIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/audio_ik5vee.svg"
                    }
                    alt="audio icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "wma":
            return (
                // <AudioIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/audio_ik5vee.svg"
                    }
                    alt="audio icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "ogg":
            return (
                // <AudioIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264156/Web%20App/dashboard/shipment_folder/audio_ik5vee.svg"
                    }
                    alt="audio icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "mp4":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "mov":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "wmv":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "flv":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "avi":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "avchd":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "webm":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "mkv":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        case "mpeg-2":
            return (
                // <VideoIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/video_spgf60.svg"
                    }
                    alt="video icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );

        default:
            return (
                // <GenericIcon
                //     className={`${
                //         mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                //     }`}
                // />
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687264154/Web%20App/dashboard/shipment_folder/generic_qv04dx.svg"
                    }
                    alt="generic icon"
                    className={`${
                        mode ? "w-4 h-4 max-sm:w-6 max-sm:h-6 max-sm:ml-[3px]" : "w-8 h-8"
                    }`}
                />
            );
    }
};
