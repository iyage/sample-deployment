import { useState } from "react";

const Input = ({ placeHolder, type, rows, className }) => {
    const [first, setfirst] = useState(false);
    return (
        <>
            {type === "textArea" ? (
                <textarea
                    className={`rounded appearance-none outline-0 w-full text-[13px] font-rocGroteskMedium px-3 py-[10px] border placeholder:text-[13px] placeholder:text-mvx-neutral bg-white resize-none ${className}`}
                    placeholder={placeHolder ?? ""}
                    rows={rows ?? 3}
                />
            ) : (
                <input
                    type={type ?? "text"}
                    className={`rounded h-[48px] w-full text-[13px] font-rocGroteskMedium px-3 border placeholder:text-[13px] placeholder:text-mvx-neutral bg-white ${className}`}
                    placeholder={placeHolder ?? ""}
                />
            )}
            <p>{}</p>
        </>
    );
};

export default Input;
