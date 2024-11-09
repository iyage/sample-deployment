import tempImg from "assets/images/landing/temp-image.svg";

const Partners = () => {
    return (
        <section className="px-3 max-lg:px-6 1100:px-[100px] pb-24 pt-12 bg-mvx-light-blue">
            <h3 className="uppercase !text-gun-metal text-xl text-center mb-[52px]">
                trusted by hundreds of freight forwarders
            </h3>
            <div className="grid grid-cols-7">
                {[34, 42, 424, 3244123, 1313, 313225, 6464].map((partner, idx) => (
                    <img src={tempImg} alt={"Partner " + idx} className="h-[78px]" key={idx} />
                ))}
            </div>
        </section>
    );
};

export default Partners;
