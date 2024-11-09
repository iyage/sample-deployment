import React, { useEffect, useState } from "react";

const CookiePrompt = () => {
    const cookies = localStorage.getItem("cookies");
    const [showPrompt, setShowPrompt] = useState(cookies ?? false);

    useEffect(() => {
        setShowPrompt(cookies);
    }, [cookies]);

    return !showPrompt ? (
        <div className="py-[30px] max-sm:px-[25px] px-[46px] bg-white sticky bottom-0 z-[1002] shadow-dropdownShadow">
            <div>
                <p className="text-base !text-gun-metal font-rocGroteskRegular mb-6">
                    We use cookies to enhance your experience on our website. By continuing to
                    browse this site, you consent to the use of cookies. For more information, check
                    out our <br className="max-lg:hidden" />
                    <a
                        href="/cookie-policy"
                        className="underline font-rocGroteskRegular !text-[#0054C2]"
                    >
                        cookie policy.
                    </a>
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setShowPrompt(true);
                            localStorage.setItem("cookies", true);
                        }}
                        className="bg-pacific-cyan text-white py-4 px-[43px] max-sm:px-[20px] text-sm font-rocGroteskBold"
                    >
                        Accept cookies
                    </button>

                    <a href="/cookie-policy">
                        <button className="bg-mvx-light-blue !text-gun-metal py-4 px-[43px] max-sm:px-[20px] text-sm font-rocGroteskBold">
                            Learn more
                        </button>
                    </a>
                </div>
            </div>
        </div>
    ) : null;
};

export default CookiePrompt;
