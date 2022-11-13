import styled from 'styled-components';

interface IProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  changed: React.ChangeEventHandler<HTMLInputElement>;
  keyPressed?: React.KeyboardEventHandler<HTMLInputElement>;
  style?: React.CSSProperties;
}

const Input1 = ({ type, placeholder, name, value, changed, keyPressed, style }: IProps) => {
  return (
    <Wrapper
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={changed}
      onKeyDown={keyPressed}
      style={style}
    />
  );
};

export default Input1;

const Wrapper = styled.input`
  width: 300px;
  height: 48px;
  border: 2px solid #565656;
  padding: 0px 8px;
  font-size: 18px;
`;
