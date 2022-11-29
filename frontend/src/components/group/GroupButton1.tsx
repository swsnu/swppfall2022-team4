import styled from 'styled-components';
import React from 'react';

interface IProps {
  content: string;
  clicked: React.MouseEventHandler<HTMLButtonElement>;
  disable: boolean;
  style?: React.CSSProperties;
}

const GroupButton1 = ({ content, clicked, style, disable }: IProps) => {
  return (
    <Wrapper className={disable ? 'disabled' : 'ing'} onClick={clicked} style={style} disabled={disable}>
      {content}
    </Wrapper>
  );
};

export default GroupButton1;

const Wrapper = styled.button`
  width: 120px;
  height: 45px;
  border: 0;
  border-radius: 5px;
  background-color: #349c66;
  color: white;
  font-size: 20px;
  font-family: FugazOne;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }

  &&.end {
    color: black;
    background-color: silver;
  }

  &&.disabled {
    color: black;
    background-color: silver;
    cursor: default;
  }
`;
