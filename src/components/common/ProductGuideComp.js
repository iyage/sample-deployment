import React from "react";

const ProductGuideComp = ({ title, text, mediaUrl, learnMoreFunc, okayFunc }) => {
    return (
        <div className="bg-white w-[354px] h-[448px] rounded-t shadow-modalShadow">
            <div className="w-full h-full ">
                <div
                    style={{ backgroundImage: `url(${mediaUrl})` }}
                    className={`w-full h-[57%] rounded-t  bg-cover `}
                ></div>
                <div className="w-full bg-white p-6 rounded-b">
                    <div className="mb-6">
                        <p className="text-lg font-rocGroteskBold mb-1">{title}</p>
                        <p className="text-[13px] font-rocGroteskMedium">{text}</p>
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <button
                            onClick={() => {
                                learnMoreFunc?.();
                            }}
                            className="w-fit bg-mvx-light-blue py-2 px-4 rounded text-sm text-gun-metal font-rocGroteskMedium"
                        >
                            Learn more
                        </button>
                        <button
                            onClick={() => {
                                okayFunc?.();
                            }}
                            className="w-fit bg-pacific-cyan py-2 px-4 rounded text-sm text-white font-rocGroteskMedium"
                        >
                            Okay, got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGuideComp;
