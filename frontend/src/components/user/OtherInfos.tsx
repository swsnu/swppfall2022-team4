import { BsCheck2Circle, BsCircle } from 'react-icons/bs';
import styled from 'styled-components';

interface IProps {
  nickname: string;
  gender: string;
  height: string;
  weight: string;
  age: string;
  nicknameWarning: { color: string; content: string };
  bodyWarning: { color: string; content: string };
  changed: React.ChangeEventHandler<HTMLInputElement>;
  stateDispatch: React.Dispatch<{
    name: string;
    value: string;
  }>;
}

const OtherInfos = ({
  nickname,
  gender,
  height,
  weight,
  age,
  nicknameWarning,
  bodyWarning,
  changed,
  stateDispatch,
}: IProps) => {
  return (
    <>
      <InputItem>
        <SmallInputWrapper>
          <NicknameInput type="text" placeholder="Nickname" name="nickname" value={nickname} onChange={changed} />
          <GenderWrapper>
            <GenderText>Gender</GenderText>
            <CheckboxWrapper>
              <div>Male</div>
              {gender === 'male' ? (
                <BsCheck2Circle style={{ marginRight: '6px' }} data-testid="maleCheck2box" />
              ) : (
                <BsCircle
                  style={{ marginRight: '6px' }}
                  onClick={() => stateDispatch({ name: 'gender', value: 'male' })}
                  data-testid="maleCheckbox"
                />
              )}
              <div>Female</div>
              {gender === 'female' ? (
                <BsCheck2Circle data-testid="femaleCheck2box" />
              ) : (
                <BsCircle
                  onClick={() => stateDispatch({ name: 'gender', value: 'female' })}
                  data-testid="femaleCheckbox"
                />
              )}
            </CheckboxWrapper>
          </GenderWrapper>
        </SmallInputWrapper>
        <Warning color={nicknameWarning.color}>{nicknameWarning.content}</Warning>
      </InputItem>
      <InputItem>
        <SmallInputWrapper>
          <HeightInput type="text" placeholder="Height" name="height" value={height} onChange={changed} />
          <HeightInput type="text" placeholder="Weight" name="weight" value={weight} onChange={changed} />
          <AgeText>Age</AgeText>
          <AgeInput type="text" placeholder="Age" name="age" value={age} onChange={changed} />
        </SmallInputWrapper>
        <Warning color={bodyWarning.color}>{bodyWarning.content}</Warning>
      </InputItem>
    </>
  );
};

export default OtherInfos;

const InputItem = styled.div`
  width: 100%;
  height: 70px;
  margin: 3px 0;
`;
const Warning = styled.div<{ color: string }>`
  font-size: 15px;
  font-family: 'Noto Sans KR', sans-serif;
  letter-spacing: -1px;
  margin-top: 2px;
  color: ${props => props.color};
`;
const NormalInput = styled.input`
  width: 100%;
  height: 48px;
  border: 2px solid #565656;
  padding: 0px 8px;
  font-size: 18px;
`;
const SmallInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const NicknameInput = styled(NormalInput)`
  width: 180px;
`;
const HeightInput = styled(NormalInput)`
  width: 100px;
`;
const AgeText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin: 0 -2px 0 2px;
`;
const AgeInput = styled(NormalInput)`
  width: 60px;
`;
const GenderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: IBMPlexSansThaiLooped;
`;
const GenderText = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;
const CheckboxWrapper = styled.div`
  display: flex;
  div {
    margin-right: 2px;
  }
`;
