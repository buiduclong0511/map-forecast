import React from "react";
import styled from "styled-components";

interface IProps {
    value: string;
    placeholder?: string;
    onChange: (e?: React.ChangeEvent<HTMLInputElement>) => any;
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => any;
    onFocus?: (e?: React.FocusEvent<HTMLInputElement>) => any;
}

export const Input: React.FC<IProps> = ({
    value,
    onChange,
    placeholder = "",
    onBlur = () => {},
    onFocus = () => {},
}) => {
    return (
        <Wrapper>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    input {
        outline: none;
        padding: 5px 10px;
        min-width: 250px;
    }
`;
