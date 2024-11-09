import { cn } from "helpers/utils";
import styled from "styled-components";

const SkeletonWrapper = styled.div`
    position: relative;
    overflow: hidden;
    border-radius: 2px;

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
        );
        animation: shimmer 1.5s infinite;
        content: "";
    }

    @keyframes shimmer {
        100% {
            transform: translateX(100%);
        }
    }
`;

const Skeleton = ({ className, children, dataLoaded }) => {
    if (!dataLoaded) {
        return <SkeletonWrapper className={cn("bg-[#dfe1e6]", className)}></SkeletonWrapper>;
    }

    return children;
};

export default Skeleton;
