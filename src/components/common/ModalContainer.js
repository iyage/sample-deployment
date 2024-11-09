import React from "react";

const ModalContainer = ({ children, closeModal, tailwindClassName, showCloseIcon, modalRef }) => {
    return (
        <div
            id="modal"
            ref={modalRef}
            onClick={closeModal}
            className="bg-gun-metal/20 fixed left-0 top-0 w-full h-full flex items-center justify-center !z-[9000]"
        >
            <div className={`${tailwindClassName}`} onClick={(evt) => evt.stopPropagation()}>
                {children}
            </div>
            {showCloseIcon && (
                <span className="material-icons text-white text-3xl absolute right-4 sm:right-9 top-6 cursor-pointer font-bold bg-opacity-100">
                    close
                </span>
            )}
        </div>
    );
};

export default ModalContainer;
