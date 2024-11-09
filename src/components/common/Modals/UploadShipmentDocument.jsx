import React, { useRef, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { firebaseService } from "services/firebaseService";
import { useMutation } from "@tanstack/react-query";
import { shipmentService } from "services";
import { useDispatch } from "react-redux";
import { shipmentActions } from "actions";

const UploadShipmentDocument = ({ isOpen, onClose, shipmentId }) => {
    const [progress, setProgress] = useState({
        progress: 0,
    });
    const progressRef = useRef(null);
    const dispatch = useDispatch();

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => shipmentService.uploadShipmentDocument(shipmentId, data),
        onSuccess: () => {
            dispatch(shipmentActions.fetchFFSingleShipment(shipmentId));
            onClose?.();
        },
    });

    const handleUpload = (fileName, file) => {
        const dateStamp = new Date();

        firebaseService.uploadFile(
            `${shipmentId}/${dateStamp}${fileName}`,
            file,
            (url) => {
                mutate({ document: [{ filename: fileName, path: url }] });
            },
            345,
            setProgress
        );
    };

    return (
        <ModalWrapper
            closeModal={onClose}
            isOpen={isOpen}
            tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
        >
            {(progress?.progress || isPending) && (
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
            )}
            {!progress?.progress && (
                <div className="bg-white rounded-lg shadow-modalShadow">
                    <div className="relative">
                        <div className="p-6 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F4F5F7] mb-6">
                                <i className="ri-upload-2-line before:content-['\f24a'] before:text-mvx-neutral text-3xl"></i>
                            </div>
                            <p className="text-lg mb-1 font-rocGroteskBold text-gun-metal">
                                Add files to your Shipment
                            </p>
                            <p className="text-sm mb-1 font-rocGroteskRegular px-4 text-center text-gun-metal">
                                Drag and drop files right into this place or upload them directly
                                from your device
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
                            onClick={onClose}
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
            )}
        </ModalWrapper>
    );
};

export default UploadShipmentDocument;
