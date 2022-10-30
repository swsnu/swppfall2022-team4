import styled from 'styled-components';

interface IProps {
  content: string;
  clicked: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Button1 = ({ content, clicked, style }: IProps) => {
  return (
    <Wrapper onClick={clicked} style={style}>
      {content}
    </Wrapper>
  );
};

export default Button1;

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
`;
