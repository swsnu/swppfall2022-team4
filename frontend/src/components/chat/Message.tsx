import styled from 'styled-components';
import { userType } from 'store/apis/user';
import { timeAgoFormat } from 'utils/datetime';

interface IProps {
  message: {
    author: userType | null;
    content: string;
    created: string;
  };
}

export const MyMessage = ({ message }: IProps) => {
  return (
    <Wrapper my={true}>
      <TopWrapper>
        <Created>{timeAgoFormat(new Date(), new Date(message.created))}</Created>
      </TopWrapper>
      <ContentWrapper my={true}>{message.content}</ContentWrapper>
    </Wrapper>
  );
};

export const OtherMessage = ({ message }: IProps) => {
  return (
    <Wrapper my={false}>
      <TopWrapper>
        <Nickname>{message.author ? message.author.nickname : '(알수없음)'}</Nickname>
        <Created>{timeAgoFormat(new Date(), new Date(message.created))}</Created>
      </TopWrapper>
      <ContentWrapper my={false}>{message.content}</ContentWrapper>
    </Wrapper>
  );
};

export const OtherGroupMessage = ({ message }: IProps) => {
  return (
    <Wrapper my={false}>
      <TopWrapper>
        <Image
          src={message.author ? process.env.REACT_APP_API_IMAGE + message.author.image : 'profile_default.png'}
          alt="profile"
        />
        <Nickname>{message.author ? message.author.nickname : '(알수없음)'}</Nickname>
        <Created>{timeAgoFormat(new Date(), new Date(message.created))}</Created>
      </TopWrapper>
      <ContentWrapper my={false}>{message.content}</ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ my: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.my ? 'flex-end' : 'flex-start')};
  padding: 10px 15px;
  margin: 5px 0;
`;
const TopWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
`;
const Image = styled.img`
  width: 40px;
  height: 40px;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  margin-right: 8px;
  background-color: #ffffff;
`;
const Nickname = styled.div`
  font-size: 20px;
  font-family: NanumSquareR;
  margin-right: 10px;
`;
const Created = styled.div`
  font-size: 14px;
  margin-bottom: 2px;
  color: #707070;
`;
const ContentWrapper = styled.div<{ my: boolean }>`
  width: 100%;
  max-width: 400px;
  background-color: ${props => (props.my ? '#feffb1' : '#ffffff')};
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 2px 2px #797979;
  line-height: normal;
  word-break: break-all;

  @media all and (max-width: 435px) {
    max-width: 280px;
  }
`;
