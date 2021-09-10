import styled from "styled-components";

export const MarkerIcon: React.FC<{ imgPath: string }> = ({ imgPath }) => {
    return (
        <Wrapper>
            <img src={imgPath} alt="" />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 20px;
    cursor: pointer;

    img {
        width: 100%;
    }
`;
