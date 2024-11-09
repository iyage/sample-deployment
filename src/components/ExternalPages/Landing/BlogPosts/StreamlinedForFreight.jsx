import React from "react";
import LandingNav2 from "../components/LandingNav2";
import FooterSubscribe from "../components/FooterSubscribe";
import LandingFooter2 from "../components/LandingFooter2";

const StreamlinedForFreight = () => {
    const blogLinks = [
        { logo: "/img/landing/twitter.svg", alt: "Twitter" },
        { logo: "/img/landing/instagram.svg", alt: "Instagram" },
        { logo: "/img/landing/linkedin.svg", alt: "Linkedin" },
        { logo: "/img/landing/blog-mail.svg", alt: "Mail" },
        { logo: "/img/landing/whatsapp.svg", alt: "Whatsapp" },
        { logo: "/img/landing/facebook.svg", alt: "Facebook" },
        { logo: "/img/landing/blog-link.svg", alt: "Link" },
    ];
    return (
        <div>
            <LandingNav2 />
            <div className="pb-10 lg:pb-20 lg:pt-[120px] pt-[80px]">
                {/* <h1 className="uppercase text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
    LOGISTICS
</h1> */}
                <p className="text-center mt-4 mb-3 font-rocGroteskBold text-[38px] lg:text-[50px] text-[#000918] px-5">
                    Fleet+: The Streamlining Superhero for Freight <br />
                    Forwarders and Logistics Operators
                </p>
                <p className="text-center text-[#888F9C] font-inter uppercase">
                    24th November, 2023
                </p>
            </div>

            <div className="lg:w-[89vw] mx-auto lg:px-[26px] px-10">
                <img
                    src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433922/Image_from_iOS_3_oak3lv.jpg"
                    alt="Resource Sample"
                    className="w-full max-h-[250px] lg:max-h-[450px] object-cover"
                />
                <div className="mt-10 lg:mt-[80px] grid lg:grid-cols-[1fr_80px] gap-[60px] lg:gap-[120px]">
                    <div>
                        {/* <h1 className="text-[#03B5D1] text-lg font-inter font-bold tracking-[2px]">
            LABEL
        </h1> */}
                        {/* <h1 className="font-rocGroteskBold text-[36px] text-[#000918] mb-3">
            Gathering Cyber Threat Intelligence on the Dark Web: Guidance for the
            Private Sector
        </h1> */}

                        <div className="space-y-2">
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                In the fast-paced world of logistics, efficiency is king. Freight
                                forwarders and logistics operators are constantly juggling complex
                                tasks, tight deadlines, and ever-changing regulations. This is where
                                Fleet+ comes in, your trusty sidekick ready to streamline your
                                processes and optimize your operations for maximum efficiency and
                                profitability.
                                <br />
                                Let's dive into how Fleet+ empowers you to conquer the logistics
                                landscape:
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    1. Visibility is Power: Real-time Tracking and Transparency
                                </span>{" "}
                                Imagine a world where you know exactly where every shipment is, at
                                any given moment. With Fleet+, that world is now a reality. Its
                                advanced tracking system provides real-time visibility into your
                                entire supply chain, from origin to destination. You can see the
                                location of your trucks, containers, and even individual packages,
                                giving you the power to proactively address any delays or
                                disruptions.
                                <br />
                                This enhanced visibility fosters trust and transparency with your
                                clients, who can track their shipments themselves and receive
                                automatic updates. No more frantic phone calls or endless email
                                threads – Fleet+ puts everyone on the same page, reducing stress and
                                improving communication.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    2. Slash Paperwork with Automated Documentation
                                </span>{" "}
                                Manual paperwork is the bane of every logistics professional's
                                existence. It's time-consuming, prone to errors, and a major drain
                                on productivity. Fleet+ says goodbye to papercuts and hello to
                                automation! Its intelligent system handles all your documentation
                                needs, from bills of lading and customs forms to invoices and
                                insurance certificates.
                                <br />
                                Fleet+ automatically generates and verifies all necessary documents,
                                ensuring accuracy and compliance. This not only saves you countless
                                hours but also minimizes the risk of errors and delays at customs.
                                Imagine the freedom of focusing on your core business instead of
                                wrestling with endless paperwork – that's the Fleet+ difference.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    3. Optimize Routes and Reduce Costs with AI-powered Planning
                                </span>{" "}
                                Fuel costs eating into your profits? Traffic snarls causing delivery
                                delays? Fleet+ is here to the rescue! Its AI-powered planning engine
                                analyzes real-time traffic data, weather conditions, and vehicle
                                capacity to optimize your routes for maximum efficiency.
                                <br />
                                By choosing the most efficient routes, you can reduce fuel
                                consumption, minimize delivery times, and even lower your carbon
                                footprint. Fleet+ helps you make the most of your resources, saving
                                you money and improving your environmental impact – a win-win
                                situation for everyone.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    4. Communication is Key: Seamless Collaboration and Instant
                                    Updates
                                </span>{" "}
                                In logistics, communication is critical. Fleet+ facilitates seamless
                                collaboration between all stakeholders involved in your operations.
                                Its built-in communication tools allow you to instantly share
                                updates, documents, and real-time shipment information with your
                                team, clients, and partners.
                                <br />
                                No more chasing down information or playing phone tag. Fleet+ keeps
                                everyone in the loop, ensuring everyone is on the same page and
                                working towards the same goal – efficient and timely delivery.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    5. Data-Driven Decisions for a Brighter Future
                                </span>{" "}
                                Gone are the days of gut instinct and guesswork. Fleet+ empowers you
                                with data-driven insights to make informed decisions that optimize
                                your operations and boost your bottom line. Its comprehensive
                                reporting tools provide detailed analysis of your performance,
                                highlighting areas for improvement and pinpointing potential cost
                                savings.
                                <br />
                                By understanding your data, you can identify trends, optimize
                                pricing strategies, and even predict future demand. Fleet+ equips
                                you with the knowledge and insights you need to stay ahead of the
                                curve and navigate the ever-changing logistics landscape with
                                confidence.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                Fleet+ is more than just software; it's your logistics partner in
                                crime, your efficiency champion, and your path to a smoother, more
                                profitable future.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                Ready to streamline your operations and conquer the logistics world?
                                Visit Fleet+ today and start your free trial!
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                P.S. Stay tuned for more blog articles where we'll delve deeper into
                                specific Fleet+ features and showcase how they can solve your unique
                                logistics challenges.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                Remember, with Fleet+, the road to logistics success is paved with
                                efficiency, visibility, and data-driven decisions.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                Let's get shipping!
                            </p>
                        </div>
                    </div>
                    <div className="flex lg:flex-col items-center lg:items-start lg:pt-10 lg:space-y-7 flex-wrap justify-center lg:justify-start gap-6 lg:gap-0">
                        {blogLinks?.map((b) => (
                            <div
                                key={b?.alt}
                                className="w-[72px] h-[72px] bg-[#F8F8F8] border border-[#0000001A] rounded-full flex items-center justify-center"
                            >
                                <img src={b?.logo} alt={b?.alt} className="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FooterSubscribe />
            <LandingFooter2 />
        </div>
    );
};

export default StreamlinedForFreight;
