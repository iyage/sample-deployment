/* eslint-disable no-unused-vars */
// import { TestimonialArrowIcon } from "assets/arts";
import testimonialImg from "assets/images/landing/testimonial-user.jpg";
import { AnimatePresence, motion } from "framer-motion";
import move from "lodash-move";
import { useCallback, useEffect, useState } from "react";

const Testimonials = ({ home }) => {
    const [cards, setCards] = useState([
        {
            testimonialImg: testimonialImg,
            content:
                "Using Fleet+ has been very seamless. The mobile app has made ‘working on the go’ very easy and has reduced the stress of hauling my system from place to place. I enjoy using the Fleet+ app",
            author: "MVX",
            jobTitle: "",
            organization: "",
            color: "#FFF8EF",
        },
        {
            testimonialImg: testimonialImg,
            content:
                "I find the App easy to use and helps keeps details of my shipment easily. I don't have to spend money on Files, printing or documents etc",
            author: "Just In Time (JIT) Logistics",
            jobTitle: "",
            organization: "",
            color: "#E9FBF6",
        },
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const moveToEnd = useCallback(
        (from, to) => {
            setCards(move(cards, from, to));
        },
        [cards]
    );

    const CARD_OFFSET = 25;
    const SCALE_FACTOR = 0.07;

    const moveForward = () => {
        setIsLoading(false);
        moveToEnd(0, cards.length - 1);
        setTimeout(() => {
            setIsLoading(true);
        }, 100);
    };

    const moveBackward = () => {
        setIsLoading(false);
        moveToEnd(cards.length - 1, 0);
        setTimeout(() => {
            setIsLoading(true);
        }, 100);
    };

    useEffect(() => {
        let interval = setInterval(() => {
            moveToEnd(0, cards.length - 1);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [moveToEnd, cards.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [cards.length]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <section
            className={`max-lg:px-6 px-[100px] 2xl:px-44 1750:px-56 flex justify-between items-center max-lg:flex-col max-lg:justify-center pb-16 max-lg:mb-[79px] ${
                home ? "pt-[103px] gap-x-16" : "pt-20"
            }`}
        >
            <div className="flex flex-col justify-center w-1/2 max-lg:w-full max-lg:mb-[79px]">
                <h3 className="text-white font-rocGroteskBold text-[40px] max-sm:text-2xl leading-[64.8px]">
                    {home ? (
                        <>
                            Next-gen freight forwarders <br />
                            grow on Fleet+
                        </>
                    ) : (
                        <>
                            The App for the <br /> Smart Freight Forwarder
                        </>
                    )}
                </h3>

                <div className="h-[3px] w-[321px] rounded-[2px] bg-[#42526E] mt-[10px] mb-8">
                    {isLoading && <div className="loader-bar" />}
                </div>

                <div className="flex items-center">
                    <span
                        onClick={moveBackward}
                        className="rounded-full bg-white lg:hover:bg-[#253858] h-[32px] w-[34px] cursor-pointer mr-2 grid place-items-center"
                    >
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687265541/Web%20App/website/icons/testimonial-arrow_or8cpw.svg"
                            }
                            alt="testimonial left arrow Icon"
                            width={14}
                            height={10}
                        />
                    </span>
                    <span
                        onClick={moveForward}
                        className="rounded-full bg-white lg:hover:bg-[#253858] h-[32px] w-[34px] cursor-pointer grid place-items-center"
                    >
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687265541/Web%20App/website/icons/testimonial-arrow_or8cpw.svg"
                            }
                            alt="testimonial right arrow Icon"
                            className="rotate-180"
                            width={14}
                            height={10}
                        />
                    </span>
                </div>
            </div>

            <div className="w-1/2 max-lg:w-full">
                <div className="relative flex items-center justify-center">
                    <ul className="relative w-[451px] h-[529px] max-sm:h-[400px] [&>*:not(:first-child)]:!opacity-[0.5]">
                        <AnimatePresence>
                            {cards.map((testimonial, index) => {
                                return (
                                    <motion.li
                                        key={testimonial.content}
                                        className="absolute pl-8 pr-9 pt-[60px] max-sm:pt-[27px] w-full h-full rounded-lg origin-[top_center] list-none"
                                        style={{
                                            backgroundColor: testimonial.color,
                                        }}
                                        animate={{
                                            top: windowWidth <= 1024 ? index * 45 : index * 15,
                                            right: windowWidth <= 1024 ? 0 : index * -CARD_OFFSET,
                                            scale: 1 - index * SCALE_FACTOR,
                                            zIndex: cards.length - index,
                                        }}
                                        exit={{
                                            opacity: 0.5,
                                        }}
                                        transition={{ duration: 0.5 }}
                                        drag={false}
                                        dragConstraints={{
                                            top: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        {/* <img
                                            src={testimonial.testimonialImg}
                                            alt="Testimony Icon"
                                            className="rounded-full w-[69.39px] h-[69.39px] object-cover border-[3px] border-[#060B10]"
                                        /> */}
                                        <p className="font-rocGroteskMedium leading-[34.56px] text-[24px] max-sm:text-lg !text-gun-metal mt-12">
                                            <span className="block !text-gun-metal leading-3">
                                                “
                                            </span>
                                            {testimonial.content}
                                        </p>
                                        <p className="!text-[#000000] text-base max-sm:text-sm text-right mt-20 max-sm:mt-[58px]">
                                            - {testimonial.author}
                                        </p>
                                        {/* <p className="text-sm max-sm:text-xs !text-[#000000] text-right">
                                            {testimonial.jobTitle},{" "}
                                            <span className="!text-[#000000] font-rocGroteskBold">
                                                {testimonial.organization}
                                            </span>
                                        </p> */}
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
