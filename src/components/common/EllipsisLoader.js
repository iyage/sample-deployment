import styled, { keyframes } from "styled-components";

const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 12px }
  100% { margin-bottom: 0 }
`;
const DotWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    margin: 0 10px;
`;
const Dot = styled.div`
    background-color: #6b778c;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    margin: 0 4px;
    animation: ${BounceAnimation} 0.5s linear infinite;
    animation-delay: ${(props) => props.delay};
`;
const EllipsisLoader = () => {
    return (
        <DotWrapper>
            <Dot delay="0s" />
            <Dot delay=".1s" />
            <Dot delay=".2s" />
        </DotWrapper>
    );
};

export default EllipsisLoader;
