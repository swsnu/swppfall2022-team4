import { BiArrowBack } from 'react-icons/bi';
import styled from 'styled-components';

interface IProps {
  content: string;
  clicked: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Button4 = ({ content, clicked, style }: IProps) => {
  return (
    <Wrapper onClick={clicked} style={style}>
      <BiArrowBack />
      {content}
    </Wrapper>
  );
};

export default Button4;

const Wrapper = styled.button`
  border: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-family: 'Press Start 2P', cursive;
  color: #9b9b9b;
  svg {
    width: 30px;
    height: 30px;
    margin: 0 10px 1.5px 0;
  }
  cursor: pointer;
  transition: color 0.2s linear;
  &:hover {
    color: black;
  }
`;
