import styled from 'styled-components';

interface IProps {
  password: string;
  passwordConfirm: string;
  passwordWarning: { color: string; content: string };
  passwordConfirmWarning: { color: string; content: string };
  changed: React.ChangeEventHandler<HTMLInputElement>;
}

const Passwords = ({ password, passwordConfirm, passwordWarning, passwordConfirmWarning, changed }: IProps) => {
  return (
    <>
      <InputItem>
        <NormalInput type="password" placeholder="Password" name="password" value={password} onChange={changed} />
        <Warning color={passwordWarning.color}>{passwordWarning.content}</Warning>
      </InputItem>
      <InputItem>
        <NormalInput
          type="password"
          placeholder="Password Confirm"
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={changed}
        />
        <Warning color={passwordConfirmWarning.color}>{passwordConfirmWarning.content}</Warning>
      </InputItem>
    </>
  );
};

export default Passwords;

const InputItem = styled.div`
  width: 100%;
  height: 70px;
  margin: 3px 0;
`;
const NormalInput = styled.input`
  width: 100%;
  height: 48px;
  border: 2px solid #565656;
  padding: 0px 8px;
  font-size: 18px;
`;
const Warning = styled.div<{ color: string }>`
  font-size: 15px;
  font-family: 'Noto Sans KR', sans-serif;
  letter-spacing: -1px;
  margin-top: 2px;
  color: ${props => props.color};
`;
