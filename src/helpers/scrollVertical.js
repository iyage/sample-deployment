const scrollVertical = (elm, direction) => {
    elm?.scrollTo({
        top: direction === "bottom" ? elm.scrollHeight : 0,
        behavior: "smooth",
    });
};

export default scrollVertical;
