import LandingFooter from "./components/LandingFooter";
import LandingNav from "./components/LandingNav";
import { useRef } from "react";
import ContactSection from "./components/ContactSection";

const About = () => {
    const contactRef = useRef(null);

    return (
        <div className="bg-landing-black [&_*]:text-white">
            <LandingNav />

            <header className="max-lg:px-6 px-[100px] pb-28 pt-48 max-lg:pt-32 flex max-lg:flex-col max-lg:justify-center justify-between items-center">
                <div className="w-full max-lg:w-full max-lg:mb-[39px] text-center">
                    <h1 className="text-6xl max-sm:text-[32px] max-sm:leading-[46px] leading-[86.4px] font-rocGroteskBold relative">
                        TradAlly’s Cookie Policy
                    </h1>
                    <p className="text-lg max-sm:text-[13px] leading-[29px] max-sm:leading-[19px] mb-[33px] mt-4">
                        All your questions about how Fleet+ uses cookies to enhance your experience
                        are answered here
                    </p>
                </div>
            </header>

            <section className="max-lg:px-6 px-[100px] pb-24 pt-[105px] flex max-lg:flex-col gap-x-16 justify-between items-center [&_*]:!text-gun-metal bg-white">
                <div className="w-full max-lg:w-full max-lg:mb-8">
                    <h3 className="font-rocGroteskBold text-xl mb-6">What are Cookies?</h3>

                    <p className="text-lg leading-[29px]">
                        Cookies are small text files stored on your device (computer, smartphone, or
                        tablet) when you visit a website. They enable the website to remember your
                        actions and preferences (such as login information, language selection, font
                        size, and other display preferences) over a period of time, so you don't
                        have to keep re-entering them whenever you come back to the site or browse
                        different pages. <br />
                        <br />
                        <strong>Types of cookies we use: </strong>
                        <ol className="list-decimal ml-5">
                            <li>
                                Essential Cookies: These cookies are necessary for the website to
                                function properly. They enable basic features such as page
                                navigation, secure areas, and user authentication. Without these
                                cookies, the website may not perform as expected.
                            </li>
                            <li>
                                Analytical Cookies: We use analytical cookies to gather information
                                about how visitors interact with our website. This helps us analyze
                                website traffic, improve our website's performance, and understand
                                user preferences. The data collected is aggregated and anonymized.
                            </li>
                            <li>
                                Functional Cookies: Functional cookies enable enhanced functionality
                                and personalization on our website. They remember your preferences
                                and choices to provide a more tailored and personalized experience.
                                These cookies may be set by us or by third-party service providers.
                            </li>
                        </ol>
                        <br />
                        <strong>Managing cookies:</strong> Most web browsers allow you to control
                        and manage cookies through their settings. You can adjust your browser
                        settings to accept or reject cookies, delete cookies, or be notified when
                        cookies are being sent. Please note that blocking or disabling certain
                        cookies may impact the functionality of our website.Third-party cookies:We
                        may also use cookies from trusted third-party service providers, such as
                        analytics and advertising partners. These cookies may collect information
                        about your browsing habits across different websites and enable targeted
                        advertising. Please refer to the respective privacy policies of these third
                        parties for more information about their practices.Your consent:By
                        continuing to use our website, you consent to the use of cookies as
                        described in this Cookie Disclaimer.
                    </p>
                </div>
            </section>

            <div ref={contactRef}>
                <ContactSection />
            </div>

            <LandingFooter />
        </div>
    );
};

export default About;
