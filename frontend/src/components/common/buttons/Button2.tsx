import styled from 'styled-components';

interface IProps {
  content: string;
  clicked: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Button2 = ({ content, clicked, style }: IProps) => {
  return (
    <Wrapper onClick={clicked} style={style}>
      {content}
    </Wrapper>
  );
};

export default Button2;

const Wrapper = styled.button`
  border: 0;
  background-color: transparent;
  color: #606060;
  font-size: 21px;
  font-family: IBMPlexSansThaiLooped;
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: color 0.15s linear;
  &:hover {
    color: #000000;
  }
`;
