import LandingFooter from "./components/LandingFooter";
import LandingNav from "./components/LandingNav";
import FaqAccordion from "./components/FaqAccordion";
import ContactSection from "./components/ContactSection";
import { useMemo, useState } from "react";
import Dropdown from "components/common/Dropdown";
import CookiePrompt from "./components/CookiePrompt";

const FAQs = () => {
    const [faqSection, setFaqSection] = useState("Product");
    const [activeIdx, setActiveIdx] = useState(null);

    const toggleAccordion = (idx) => {
        setActiveIdx((prev) => (prev === idx ? null : idx));
    };
    const [searchPhrase, setSearchPhrase] = useState("");

    const faqs = useMemo(() => {
        const results = [];

        for (const category in FAQS_OBJ) {
            const categoryData = FAQS_OBJ[category];

            for (const item of categoryData) {
                if (item.title.toLowerCase().includes(searchPhrase.toLowerCase())) {
                    results.push({ category, ...item });
                } else if (typeof item.content === "object") {
                    if (item.content.title.toLowerCase().includes(searchPhrase.toLowerCase())) {
                        results.push({ category, ...item });
                    } else if (Array.isArray(item.content.items)) {
                        const matchedItems = item.content.items.filter((item) =>
                            item.toLowerCase().includes(searchPhrase.toLowerCase())
                        );
                        if (matchedItems.length > 0) {
                            results.push({ category, ...item });
                        }
                    }
                } else if (typeof item.content === "string") {
                    if (item.content.toLowerCase().includes(searchPhrase.toLowerCase())) {
                        results.push({ category, ...item });
                    }
                }
            }
        }

        const filteredFaqs = {};

        const categories = [...new Set(results.map(({ category }) => category))];

        categories.forEach((category) => (filteredFaqs[category] = []));

        results.forEach(({ category, content, title }) =>
            filteredFaqs[category].push({ title, content })
        );
        setFaqSection(categories[0]);

        return filteredFaqs;
    }, [searchPhrase]);

    return (
        <div className="bg-landing-black">
            <LandingNav />
            <header className="text-center pt-[150px] 520:pt-44 pb-20 520:pb-24 [&_*]:text-white px-3 400:px-4 sm:px-16 1100:px-[100px]">
                <h1 className="text-xl 400:text-2xl 520:text-5xl 900:text-[52px] leading-[28.8px] 520:leading-[49.9px] font-rocGroteskBold">
                    Hi. Let's Help You Get Started
                </h1>
                <p className="text-sm 520:text-lg mt-2 mb-10 max-900:w-[70%] max-900:mx-auto">
                    All your questions about how Fleet+ works answered in one place
                </p>
                <div className="flex flex-col max-sm:items-stretch px-3 sm:grid grid-cols-[70%,1fr] sm:h-[48px] sm:w-[60%] 800:w-[50%] xl:w-[45%] mx-auto rounded">
                    <input
                        className="placeholder:text-[#6B778C] px-2 text-[15px] max-sm:h-[48px] bg-landing-black border sm:border-r-0 focus:border-r-0 focus:border-gray-50/75 rounded sm:rounded-r-none text-mvx-light-blue placeholder:font-rocGroteskMedium font-rocGroteskMedium"
                        placeholder="What are you looking for?"
                        onInput={(evt) => setSearchPhrase(evt.target.value.toLowerCase())}
                    />
                    <button
                        disabled
                        className="bg-pacific-cyan font-rocGroteskMedium !text-gun-metal  sm:rounded-l-none max-sm:h-[48px] max-sm:mt-5"
                    >
                        Search
                    </button>
                </div>
            </header>

            <section className="bg-white 900:grid grid-cols-[190px,1fr] px-3 400:px-4 sm:px-16 1100:px-[100px] 2xl:px-44 1750:px-56  pt-20 sm:pt-24 pb-20 sm:pb-28">
                <aside className="h-max sticky top-[100px] hidden 900:block">
                    <p className="font-rocGroteskBold text-lg mb-2">ON THIS PAGE</p>
                    <div className="h-[302px] overflow-y-auto">
                        {Object.keys(faqs).map((title, idx) => (
                            <p
                                key={title}
                                className={`transition-colors ${
                                    title === faqSection
                                        ? "font-rocGroteskMedium "
                                        : "!text-mvx-neutral"
                                } text-[15px] py-1.5 cursor-pointer`}
                                onClick={() => setFaqSection(title)}
                            >
                                {title}
                            </p>
                        ))}
                    </div>
                </aside>

                <div className="900:hidden">
                    <Dropdown
                        dropdown={
                            <div className="h-[50px] border border-black rounded flex justify-between items-center px-4 font-rocGroteskMedium text-sm sm:text-base">
                                {faqSection}
                                <i className="ri-arrow-down-s-line text-2xl !font-normal" />
                            </div>
                        }
                        handleChange={(_, value) => setFaqSection(value)}
                        dropdownClassname={"!w-full !mb-10 !-mt-7"}
                        dropdownContainerClasses={
                            "shadow-dropdownShadow border-0 rounded !max-h-fit"
                        }
                        dropdownItemsClasses={`!py-2 sm:[&_*]:!text-base`}
                        name={"faq-dropdown"}
                        dropdownOptions={Object.keys(faqs).map((title) => ({
                            label: title,
                            value: title,
                            disabled: title === faqSection,
                        }))}
                    />
                </div>

                <main className="xl:ml-32 xl:mr-16">
                    {faqs[faqSection] &&
                        faqs[faqSection].length > 0 &&
                        faqs[faqSection].map((faq, idx) => (
                            <FaqAccordion
                                idx={idx}
                                faqPage
                                title={faq.title}
                                content={faq.content}
                                key={idx + faq.title}
                                toggleAccordion={toggleAccordion}
                                activeIdx={activeIdx}
                            />
                        ))}
                </main>
            </section>

            <div className="pt-16 md:pt-14">
                <ContactSection />
            </div>

            <LandingFooter />
            <CookiePrompt />
        </div>
    );
};
export default FAQs;

const FAQS_OBJ = {
    Product: [
        {
            title: "What does Fleet+ offer to freight forwarders?",
            content: `Fleet+ is a user-first software that makes it simple for freight forwarders to automate partner  management processes, connect with global freight partners, and scale their business operations. It enables forwarder-to-forwarder collaboration for small and mid-sized freight brokers.
`,
        },
        {
            title: "How can Fleet+ streamline my freight forwarding operations?",
            content: {
                title: "Fleet+ helps you streamline your business processes by;",
                items: [
                    "Allow you to collaborate with Global partners in 190+ Countries which helps you to grow your business.",
                    "Have access to business performance and intelligence reports on your dashboard, know your business performance at your fingertips.",
                    "Transfer your documents from paper and safely store them on different shipment folders.",
                    "On the Fleet+ app, you can easily track your cargo on any shipping carrier or airline. All you need is your tracking number and you can find real-time updates on your cargo, wherever it is around the globe.",
                ],
            },
        },
        {
            title: "What features are included in Fleet+?",
            content: {
                title: "As a Freight Forwarder on Fleet+, you have the freedom to streamline your business processes using these feature;",
                items: [
                    "Quote Management",
                    "Shipment Management",
                    "Document Management",
                    "Rate Management",
                    "Payment",
                    "Communication and Customer Management",
                ],
            },
        },
        {
            title: "Can I customize Fleet+ to suit my specific business needs?",
            content: `Yes, by creating a Fleet+ account, you automatically create a business profile for your freight business which can be shared with customers. That business profile is a functioning business page, at no extra cost!`,
        },
    ],

    Payments: [
        {
            title: "What payment methods are accepted for Fleet+?",
            content: `There are different payment options available toFleet+ users namely Bank Transfer, Pay with Card. we are also adding other options like Pay with USSD capability in the near future.`,
        },

        {
            title: "Is there a free trial period for Fleet+?",
            content: `Yes, there is a 30-Day free trial period on Fleet+ where you can access all the features available on both the Web and Mobile App from Shipment and Quote Management to Document Folder and Rate Management.`,
        },
        {
            title: "Can I pay in any quote or rate currency?",
            content: `Yes, our platform has multi-currency capabilities, however, limited to USD, Pounds, Euro while we are working on adding other currencies going forward. You can also choose to convert your local currency to either one of the Currencies currently on offer and make payment to Global partners.`,
        },
        {
            title: "Can I cancel my subscription at any time?",
            content: `Yes, you can cancel your subscription at any time. If you had made payment on an active subscription. Your subscription will automatically be canceled however, you will not be refunded your subscription payment since it is already active. If payment is made for a subscription and it is not yet active, a request can be made for the refund before the day the subscription will become active. You can send your request to Billings@Fleet+.io.`,
        },
        {
            title: "Are there any additional fees or charges associated with using Fleet+?",
            content: `Yes, there are additional fees arising from the use of Fleet+. Those fees are stated clearly in the Invoice or Quote shared with you as a user on the platform. Fees like Platform fees, Sourcing and Procurement fees. In a case that those fees do not apply to the transaction, the fees will not be charged or assigned to you.`,
        },
    ],

    "Account Creation": [
        {
            title: "How do I create an account with Fleet+?",
            content: `Simply signup to the platform if you are using the web platform or download the Mobile App either on Google or Apple Play store and sign up using your Business email, Phone number and Country location and Address. Your Account will be confirmed after you have added Trade Lanes, Mode of Shipment and also Business registration details or documents.`,
        },
        {
            title: "What information do I need to provide during the account creation process?",
            content: {
                title: "Creating an account on Fleet+ is a simple process and the required information are;",
                items: [
                    "Business registration documents",
                    "Identification Card of the Principal Director or Administrator",
                    "GIT insurance and Customs License",
                ],
            },
        },
        {
            title: "Can I have multiple users under one account?",
            content:
                "No, you cannot have multiple accounts on Fleet+. You can only have one account on the platform but can add Team members on that single account to collaborate with on Fleet+.",
        },
        {
            title: "Can I change my account details later?",
            content:
                "Yes, but to an extent. You can change the Company profile and some aspect on your account but not all account details.",
        },
    ],
};
