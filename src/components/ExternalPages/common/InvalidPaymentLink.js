import React from "react";

const InvalidPaymentLink = ({ hideFooter, error }) => {
    return (
        <div className="h-[calc(100vh-65px)] flex flex-col justify-between items-center">
            <div className="mt-12 px-4">
                {error && (
                    <div className="flex justify-center mb-2">
                        <span className="material-icons-outlined text-6xl text-red-600">
                            error_outline
                        </span>
                    </div>
                )}
                <p className="text-[28px] font-rocGroteskBold text-mvx-black text-center mb-4">
                    {error ? "An error occurred" : "This payment link is not valid"}
                </p>
                <p className="text-sm font-rocGroteskMedium text-mvx-black text-center">
                    {error
                        ? "An error occurred while trying to fetch payment information, you can try refreshing the page or contact support below"
                        : "To make payment, you'll need to ask the person who originally sent you for a new link."}
                </p>
                <div className="flex justify-center">
                    <a
                        href="mailto:hello@fleetplus.io"
                        className={`mt-8 text-white text-base font-rocGroteskMedium flex items-center justify-center bg-pacific-cyan disabled:opacity-40 py-3 px-6`}
                    >
                        Contact Support
                    </a>
                </div>
            </div>

            {!hideFooter && (
                <div className="flex mt-[73px] mb-6 text-sm font-rocGroteskMedium text-mvx-neutral">
                    <p className="pr-4 border-r mr-4">
                        <span>Powered by</span>{" "}
                        <span className="font-rocGroteskMedium">Fleet+</span>
                    </p>
                    <p className="flex gap-4">
                        <span className="text-mvx-neutral">Terms</span>
                        <span className="text-mvx-neutral">Privacy</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default InvalidPaymentLink;
