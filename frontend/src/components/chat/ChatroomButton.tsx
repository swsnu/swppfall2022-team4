import styled from 'styled-components';

interface IProps {
  user: {
    username: string;
    nickname: string;
    image: string;
  } | null;
  clicked: React.MouseEventHandler<HTMLDivElement>;
  active: boolean;
}

const ChatroomButton = ({ user, clicked, active }: IProps) => {
  return (
    <Wrapper onClick={clicked} active={active}>
      <ProfileImage src={process.env.REACT_APP_API_IMAGE + (user ? user.image : 'profile_default.png')} />
      <Nickname>{user ? user.nickname : '(알수없음)'}</Nickname>
    </Wrapper>
  );
};

export default ChatroomButton;

const Wrapper = styled.div<{ active: boolean }>`
  width: 250px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 5px 0;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px 10px;
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
