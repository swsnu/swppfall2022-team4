import styled from 'styled-components';

interface IProps {
  content: string;
  clicked: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Button3 = ({ content, clicked, style }: IProps) => {
  return (
    <Wrapper onClick={clicked} style={style}>
      {content}
    </Wrapper>
  );
};

export default Button3;

const Wrapper = styled.button`
  width: 120px;
  height: 40px;
  background-color: #d7efe3;
  border: 1px solid #646464;
  border-radius: 5px;
  padding-top: 8px;
  font-size: 17px;
  font-weight: 600;
  font-family: NanumSqaureR;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #aae5c7;
  }
`;
