import { websiteService } from "services";
import Loader from "components/common/Loader";
import { useState } from "react";

const ContactSection = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contactFormData, setContactFormData] = useState({
        fullName: "",
        email: "",
        reason: "",
    });
    return (
        <section className="[&_*]:!text-gun-metal max-lg:mx-6 max-sm:mt-6 mx-[85px] 2xl:mx-44 1750:mx-56 mb-[74px] md:mb-[120px] md:mt-10 rounded-lg lg:rounded-[15px] min-h-[554px] overflow-hidden bg-mvx-light-blue max-lg:px-2.5 py-10 lg:p-24 lg:pt-16">
            <h2 className="text-[45px] max-md:text-2xl max-md:pt-2 font-rocGroteskBold text-center mb-7 md:mb-[54px]">
                Contact us
            </h2>
            <div className="flex gap-10 max-md:flex-col max-md:justify-center justify-between">
                <div className="w-[44%] max-lg:w-1/2 max-md:w-full">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687177600/Web%20App/website/contact-us-form_fdesx6.jpg"
                        }
                        alt="Contact us"
                        className="h-[467px] max-md:h-[231px] w-full object-cover rounded-lg"
                    />
                </div>
                <div className="w-[49%] max-lg:w-1/2 max-md:w-full">
                    <form
                        onSubmit={(evt) => {
                            evt.preventDefault();
                            websiteService.contactUs(
                                contactFormData,
                                setContactFormData({ email: "", fullName: "", reason: "" }),
                                setIsSubmitting
                            );
                        }}
                    >
                        <h4 className="font-rocGroteskBold max-md:text-center text-base md:text-xl leading-[28.8px] md:w-[90%]">
                            Please fill out this form and an Ally will respond within 24 hours!
                        </h4>

                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mt-9 md:mt-[34px]">
                            <div>
                                <p className="font-rocGroteskMedium text-[13px] mb-1">Full name</p>
                                <input
                                    type={"text"}
                                    className={`rounded h-[48px] w-full text-[13px] font-rocGroteskMedium px-3 border placeholder:text-sm md:placeholder:text-[13px] placeholder:text-mvx-neutral bg-white`}
                                    placeholder={"Enter first and last name"}
                                    required
                                    name="fullName"
                                    value={contactFormData.fullName}
                                    onChange={(e) => {
                                        setContactFormData((prev) => ({
                                            ...prev,
                                            [e.target.name]: e.target.value,
                                        }));
                                    }}
                                />
                            </div>
                            <div>
                                <p className="font-rocGroteskMedium text-[13px] mb-1">
                                    Email address
                                </p>
                                <input
                                    type={"email"}
                                    className={`rounded h-[48px] w-full text-[13px] font-rocGroteskMedium px-3 border placeholder:text-sm md:placeholder:text-[13px] placeholder:text-mvx-neutral bg-white`}
                                    placeholder={"Enter email address"}
                                    name="email"
                                    required
                                    value={contactFormData.email}
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    title="Please fill in a valid email"
                                    onChange={(e) => {
                                        setContactFormData((prev) => ({
                                            ...prev,
                                            [e.target.name]: e.target.value,
                                        }));
                                    }}
                                />
                            </div>
                        </div>

                        <p className="font-rocGroteskMedium text-[13px] mb-1 mt-5">
                            Reason for contacting
                        </p>
                        <textarea
                            className={`rounded appearance-none outline-0 w-full text-[13px] font-rocGroteskMedium px-3 py-[10px] border placeholder:text-sm md:placeholder:text-[13px] placeholder:text-mvx-neutral bg-white resize-none`}
                            placeholder={"Enter message"}
                            required
                            rows={7}
                            name="reason"
                            value={contactFormData.reason}
                            onChange={(e) => {
                                setContactFormData((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }));
                            }}
                        />

                        <button className="bg-pacific-cyan font-rocGroteskMedium rounded py-[13px] max-md:text-sm max-md:w-full px-6 mt-[15px] md:mt-[14px]">
                            {isSubmitting ? <Loader color={"white"} size={5} /> : "Send message"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
