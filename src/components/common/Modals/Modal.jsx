import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Modal = ({ show, children, onClose, clickAway }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={classNames(
                        "fixed top-0 left-0 bottom-0 right-0 bg-gun-metal/20 flex items-center justify-center !z-[9000]",
                        {
                            "h-screen w-screen": show,
                            "h-0 w-0 opacity-0": !show,
                        }
                    )}
                >
                    <div className="">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
