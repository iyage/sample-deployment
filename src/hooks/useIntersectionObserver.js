import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = (options) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [unObserve, setUnObserve] = useState(false);

    const callbackFunction = (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    useEffect(() => {
        const element = containerRef.current;

        const observer = new IntersectionObserver(callbackFunction, options);
        if (element) observer.observe(element);
        if (element && unObserve) observer.unobserve(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [containerRef, options, unObserve]);

    return [containerRef, isVisible, setUnObserve];
};

export default useIntersectionObserver;
