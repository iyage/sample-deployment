// import { DashboardImage } from "assets/arts";
import superNewImg from "assets/images/Super-new.svg";
import scrollToElm from "helpers/scrollToElm";
import { useNavigate } from "react-router-dom";
import appleStore from "assets/images/externalPages/apple-play-store.svg";
import googleStore from "assets/images/externalPages/google-play-store.svg";

const LandingSubFooter = ({ shouldNavigate, hideOnMobile, onBoardType }) => {
    const navigate = useNavigate();

    return (
        <section
            className={`bg-[#E4FCF6] pt-20 ${
                hideOnMobile && "max-1100:hidden"
            } px-[70px] xl:px-[176px] flex justify-between max-800:flex-col-reverse max-lg:px-6`}
        >
            <div className="basis-[420px] mb-28 max-sm:relative max-sm:mb-16 max-sm:z-10 ">
                <h3 className="text-[44px] font-rocGroteskBold leading-[45px] mt-16">
                    Fleet+ is for
                    <br /> Rebels
                </h3>

                {onBoardType ? (
                    <>
                        {" "}
                        <p className="font-rocGroteskMedium text-lg mt-4 mb-7">
                            Fleet+ makes it simple for freight forwarders to utilize freight
                            management tools and connect with global freight partners to scale their
                            business operations.
                        </p>
                        <div className="flex mt-4 mb-7">
                            <img src={appleStore} alt="apple store" />

                            <a
                                href="https://play.google.com/store/apps/details?id=com.fleetplus"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {" "}
                                <img
                                    src={googleStore}
                                    alt="google store"
                                    className="ml-3 475:ml-5"
                                />
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        {" "}
                        <p className="font-rocGroteskMedium text-lg mt-4 mb-7">
                            We're changing the narrative, and giving you access to experience
                            simplicity in global trade. Join us. Sign up to our waitlist and be
                            first in line to use the Fleet+ app.
                        </p>
                        <button
                            className="bg-black text-white rounded py-3 px-6 font-rocGroteskMedium text-base"
                            onClick={() => {
                                if (shouldNavigate) return navigate("/waitlist");
                                return scrollToElm(document.getElementById("wishlist-form"));
                            }}
                        >
                            Join the waitlist
                        </button>
                    </>
                )}
            </div>

            <div className="basis-[430px] self-stretch relative -translate-x-11 max-xl:translate-x-0">
                {/* <DashboardImage className="relative z-10 w-full max-lg:w-[90%] max-lg:m-auto h-full object-cover shadow-[0px_687.117px_274.386px_rgba(0,0,0,0.01),0px_386.215px_231.729px_rgba(0,0,0,0.05),0px_171.779px_171.779px_rgba(0,0,0,0.09),0px_42.6566px_94.5362px_rgba(0,0,0,0.1),0px_0px_0px_rgba(0,0,0,0.1)]" /> */}
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687260663/Web%20App/Dashboard_q8uywx.svg"
                    }
                    alt="Dashboard"
                    className="relative z-10 w-full max-lg:w-[90%] max-lg:m-auto h-full object-cover shadow-[0px_687.117px_274.386px_rgba(0,0,0,0.01),0px_386.215px_231.729px_rgba(0,0,0,0.05),0px_171.779px_171.779px_rgba(0,0,0,0.09),0px_42.6566px_94.5362px_rgba(0,0,0,0.1),0px_0px_0px_rgba(0,0,0,0.1)]"
                />
                <div className="w-[120%] max-lg:w-full border-2 border-black h-full max-lg:h-[80%] rounded-tl-[380px] absolute -bottom-[16.5%] max-lg:bottom-[-0.5%] max-lg:right-0 -right-11"></div>
                <img
                    src={superNewImg}
                    alt="Super new"
                    className="relative bottom-[160px] w-[107px] h-[103.18px] max-sm:w-[74px] max-sm:h-[72px] max-lg:bottom-[110px] max-lg:left-0 -left-[73px] z-20"
                />
            </div>
        </section>
    );
};

export default LandingSubFooter;
