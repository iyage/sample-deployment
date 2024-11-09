import React from "react";
import { Link } from "react-router-dom";
import GetOnAndroid from "assets/images/externalPages/getOnGooglePlay.png";
import GetOnIos from "assets/images/externalPages/getOnAppleStore.png";

const Footer = () => {
    return (
        <div className="w-full px-[112px] max-lg:px-8 text-mvx-black pt-12 pb-[54px] bg-mvx-light-blue">
            <div className="w-[38%] max-sm:w-full">
                <p className="text-2xl font-rocGroteskBold mb-3">Fleet+</p>
                <p className="text-base text-mvx-neutral mb-6">
                    Book, track and manage your shipments all in one place. Get the Fleet+ app on
                    any device
                </p>
                <div className="flex gap-2 mb-[42px]">
                    <Link to={"#"}>
                        <img src={GetOnAndroid} alt="download on android" />
                    </Link>
                    <Link to={"#"} target={"_blank"}>
                        <img src={GetOnIos} alt="download on ios" />
                    </Link>
                </div>
                <p className="text-sm font-rocGroteskMedium">
                    © 2022 Fleet+, Inc. · Privacy · Terms · Sitemap
                </p>
            </div>
        </div>
    );
};

export default Footer;
