const FaqAccordion = ({ title, content, idx, faqPage, activeIdx, toggleAccordion }) => {
    return (
        <>
            <p
                className={`font-rocGroteskBold text-lg sm:text-xl flex justify-between items-center cursor-pointer transition-all ${
                    faqPage ? `px-4 ${!idx && "rounded-t-md"}` : "px-3 "
                } ${
                    activeIdx !== idx
                        ? "border-b border-b-gun-metal/40 pt-8 pb-4"
                        : `${faqPage ? "bg-mvx-light-blue" : "bg-[#E7FFF9]"} pt-4 pb-0.5`
                } `}
                onClick={() => toggleAccordion(idx)}
            >
                {title}
                <span
                    className={`material-icons pointer-events-none transition-all duration-300 ${
                        activeIdx === idx ? "rotate-180" : "rotate-0"
                    }`}
                >
                    expand_more
                </span>
            </p>

            <div
                className={`font-rocGroteskRegular ${
                    faqPage ? "px-4 pb-[25px] pt-1.5" : "px-3 pt-1 pb-3"
                } ${
                    activeIdx === idx
                        ? `block ${
                              faqPage ? "bg-mvx-light-blue" : "bg-[#E7FFF9]"
                          } border-b border-b-gun-metal/40`
                        : "hidden"
                } text-sm sm:text-base leading-[29px]`}
            >
                {content?.title ?? content}

                {content?.items && (
                    <ul className={`list-disc mt-2 leading-[29px] ${faqPage ? "px-4" : "px-3 "}`}>
                        {content.items.map((item, idx) => (
                            <li key={item + idx}>{item}</li>
                        ))}
                    </ul>
                )}
            </div>
            <></>
        </>
    );
};

export default FaqAccordion;
