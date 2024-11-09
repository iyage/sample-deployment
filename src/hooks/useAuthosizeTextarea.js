import { useEffect, useRef } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (value) => {
    const textAreaRef = useRef();

    useEffect(() => {
        const textarea = textAreaRef.current;

        if (textarea) {
            textarea.style.height = "0px";
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
