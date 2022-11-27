import styled from 'styled-components';
import { userType } from 'store/apis/user';

interface IProps {
  user: userType | null;
  newChat: boolean;
  recentMessage: string;
  clicked: React.MouseEventHandler<HTMLDivElement>;
  active: boolean;
}

const ChatroomButton = ({ user, newChat, recentMessage, clicked, active }: IProps) => {
  return (
    <Wrapper onClick={clicked} active={active}>
      {newChat && <New />}
      <ProfileImage src={process.env.REACT_APP_API_IMAGE + (user ? user.image : 'profile_default.png')} />
      <ContentWrapper>
        <Nickname>{user ? user.nickname : '(알수없음)'}</Nickname>
        <RecentMessage>{recentMessage}</RecentMessage>
      </ContentWrapper>
    </Wrapper>
  );
};

export default ChatroomButton;

const Wrapper = styled.div<{ active: boolean }>`
  width: 250px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 8px 0;
  padding: 7.5px 10px;
  font-size: 18px;
  font-weight: 600;
  font-family: NanumSquareR;
  cursor: pointer;
  box-shadow: ${props => (props.active ? '1px 1px 2px 2px #00a767' : '1px 1px 1px 1px #d1d1d1')};
  transition: box-shadow 0.15s linear;
  &:hover {
    box-shadow: ${props => (props.active ? '1px 1px 2px 2px #00a767' : '1px 1px 1px 1px #90bb96')};
  }
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const New = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #db5353;
  top: -6px;
  right: -6px;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border: 1px solid #646464;
  border-radius: 10px;
  margin-right: 15px;
`;
const Nickname = styled.div`
  width: 150px;
  text-align: center;
`;
const RecentMessage = styled.div`
  width: 150px;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Noto Sans KR', sans-serif;
  color: #777777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-top: 7.5px;
  line-height: normal;
`;
