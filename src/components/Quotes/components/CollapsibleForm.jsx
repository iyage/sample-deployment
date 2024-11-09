import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useToggle } from "usehooks-ts";

const CollapsibleForm = ({ title = "Title", children }) => {
    const [isOpen, toggle] = useToggle(false);

    return (
        <div>
            <div
                className="px-4 py-2 flex items-center justify-between bg-neutral-n-20 rounded cursor-pointer"
                onClick={toggle}
            >
                <h1 className="text-gun-metal font-rocGroteskMedium text-sm cursor-pointer">
                    {title}
                </h1>
                <span className="material-icons !text-lg font-semibold fill-mvx-black transition-all duration-300 cursor-pointer">
                    {isOpen ? "remove" : "add"}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleForm;
