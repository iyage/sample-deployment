import React from "react";
import LandingNav2 from "./components/LandingNav2";
import Button from "components/common/Button";
import ScheduleSection from "./components/ScheduleSection";
import { truncateWord } from "helpers/utils";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import LandingFooter2 from "./components/LandingFooter2";

const ResourcesPage = () => {
    const navigate = useNavigate();
    const blogPosts = [
        {
            title: "Revolutionizing Logistics: How Fleet+ Enhances Freight Forwarders' Efficiency",
            link: "/resources/revolutionizing-logistics",
            photo: "https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433923/Image_from_iOS_2_q7w1z3.jpg",
            description:
                "In the fast-paced world of logistics, efficiency is key. Freight forwarders face the challenge of managing complex supply chains while ensuring timely and cost-effective deliveries. Enter Fleet+, a cutting-edge solution designed to streamline and optimize logistics processes for freight forwarders.",
        },
        {
            title: "Mastering Logistics Complexity with Fleet+: A Game-Changer for Operators",
            link: "/resources/mastering-logistics",
            photo: "https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433922/Image_from_iOS_1_os7mge.jpg",
            description:
                "Logistics operators face a myriad of challenges in managing the intricate web of supply chains, shipments, and regulatory compliance. Fleet+ emerges as a game-changer, offering comprehensive solutions to master the complexities of logistics operations.",
        },
        {
            title: "Secure and Seamless: Fleet+ Transforming Freight Management",
            link: "/resources/secure-freight-management",
            photo: "https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433922/Image_from_iOS_t6gcgd.jpg",
            description:
                "Freight management is a complex task that demands precision, security, and seamless coordination. Fleet+ emerges as the go-to solution, transforming freight management for businesses by ensuring security, efficiency, and operational excellence.",
        },
        {
            title: "Fleet+: The Streamlining Superhero for Freight Forwarders and Logistics Operators",
            link: "/resources/streamlined-for-freight-forwarders",
            photo: "https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433922/Image_from_iOS_3_oak3lv.jpg",
            description:
                "In the fast-paced world of logistics, efficiency is king. Freight forwarders and logistics operators are constantly juggling complex tasks, tight deadlines, and ever-changing regulations. This is where Fleet+ comes in, your trusty sidekick ready to streamline your processes and optimize your operations for maximum efficiency and profitability.",
        },
    ];
    const blogOne = blogPosts?.at(0);
    return (
        <div>
            <LandingNav2 />
            <div className="h-[70vh] lg:h-[75vh] w-full min-h-[500px] max-h-[800px] about-us-hero bg-[#00255E] px-10">
                <h1 className="text-center pt-[100px] lg:pt-[150px] text-[40px] lg:text-[65px] font-rocGroteskBold text-white leading-tight">
                    Stay in the know of trends in <br className="lg:block hidden" />
                    <span className="text-[#B3F00D]">the logistics sector</span>
                </h1>
                <div className="max-w-[600px] mx-auto flex items-stretch border-2 border-white mt-5 lg:mt-10 rounded-lg h-[50px] w-full">
                    <input
                        type="text"
                        className="w-full bg-transparent h-full px-6 font-inter text-sm lg:text-lg font-semibold"
                        placeholder="Your email address..."
                    />
                    <Button className="!w-[110px] lg:!w-[180px] bg-white flex-shrink-0 text-[#000918] font-inter text-sm lg:text-lg font-semibold !rounded-none">
                        Subscribe
                    </Button>
                </div>
            </div>
            <div className="lg:w-[89vw] mx-auto lg:px-[26px] px-10 pt-16 lg:pt-[120px] pb-20">
                <div className="flex lg:gap-[60px] lg:flex-row flex-col">
                    <img
                        src={blogOne?.photo}
                        alt={blogOne?.title}
                        className="lg:w-[480px] lg:h-[360px] w-full h-[232px] rounded-lg"
                    />
                    <div className="">
                        {/* <h1 className="font-inter text-xl text-[#03B5D1] font-bold tracking-[2px]">
                            LOGISTICS
                        </h1> */}
                        <p className="mt-5 text-2xl lg:text-[36px] font-rocGroteskBold cursor-pointer">
                            {blogOne?.title}
                        </p>
                        <p className="font-inter py-3 text-[#00091850] lg:text-base text-sm">
                            {truncateWord(blogOne?.description, 300)}
                        </p>
                        {/* <p className="lg:text-base text-xs">24th November, 2023</p> */}
                        <div
                            className="flex items-center gap-1 cursor-pointer mt-3"
                            onClick={() => navigate(blogOne?.link)}
                        >
                            <h3 className="text-[#00255E] font-semibold text-sm lg:text-lg font-inter">
                                Read More
                            </h3>
                            <HiOutlineArrowSmRight className="fill-[#00255E]" size="20" />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 mt-10 lg:mt-16 gap-10 lg:gap-12">
                    {blogPosts?.slice(1)?.map((bl) => (
                        <div key={bl?.title}>
                            <img
                                src={bl?.photo}
                                alt={bl?.title}
                                className="rounded-lg h-[280px] w-full object-cover"
                            />
                            <h1 className="mt-4 font-rocGroteskBold text-[#000918] text-2xl lg:text-3xl cursor-pointer">
                                {truncateWord(bl?.title, 40)}
                            </h1>
                            <p className="my-3 font-inter text-opacity-50 text-[#000918] text-sm lg:text-lg font-medium">
                                {truncateWord(bl?.description, 150)}
                            </p>
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => navigate(bl?.link)}
                            >
                                <h3 className="text-[#00255E] font-semibold text-sm lg:text-lg font-inter">
                                    Read More
                                </h3>
                                <HiOutlineArrowSmRight className="fill-[#00255E]" size="20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ScheduleSection />
            <LandingFooter2 />
        </div>
    );
};

export default ResourcesPage;
