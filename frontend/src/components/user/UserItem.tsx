import styled from 'styled-components';
import { userType } from 'store/apis/user';

interface IProps {
  user: userType;
  clicked: React.MouseEventHandler<HTMLDivElement>;
}

const UserItem = ({ user, clicked }: IProps) => {
  return (
    <Wrapper onClick={clicked}>
      <ProfileImage src={process.env.REACT_APP_API_IMAGE + user.image} />
      <Nickname>{user.nickname}</Nickname>
    </Wrapper>
  );
};

export default UserItem;

const Wrapper = styled.div`
  width: 240px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px 10px;
  font-size: 18px;
  font-weight: 600;
  font-family: NanumSquareR;
  cursor: pointer;
  box-shadow: 0px 0px 2px 2px #bbbbbb78;
  transition: box-shadow 0.15s linear;
  &:hover {
    box-shadow: 0px 0px 2px 2px #94a2f1cc;
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
