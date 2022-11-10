import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { IoIosNotifications, IoIosNotificationsOutline } from 'react-icons/io';
import {
  HiOutlineDocumentReport,
  HiUserGroup,
  HiOutlineAnnotation,
  HiPhotograph,
  HiInformationCircle,
} from 'react-icons/hi';
import styled from 'styled-components';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { chatActions } from 'store/slices/chat';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const notificationRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { user, notice, where } = useSelector((state: RootState) => ({
    user: state.user.user,
    notice: state.user.notice,
    where: state.chat.where,
  }));

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationRef]);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setInfoOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [infoRef]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setNotificationOpen(false);
    setInfoOpen(false);
  }, [location]);

  const ws: React.MutableRefObject<WebSocket | null> = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(`ws://${process.env.REACT_APP_API_SOCKET_URL}/ws/chat/${user && user.username}/`);
    ws.current.onopen = () => {
      console.log(`CONNECTED`);
      dispatch(chatActions.setSocket(ws.current));
    };
    ws.current.onclose = () => {
      console.log(`DISCONNECTED`);
    };
    ws.current.onerror = error => {
      console.log(`CONNECTION ERROR`);
      console.log(error);
    };
    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
      console.log(data, where, data.where.toString());
      if (data.type === 'CHAT') {
        if (where === null) {
          console.log('ignore...');
        } else if (where !== data.where.toString()) {
          console.log('update list...');
          dispatch(chatActions.getChatroomList(user?.username || ''));
        } else {
          console.log('update list and message...');
          dispatch(chatActions.getChatroomList(user?.username || ''));
          dispatch(chatActions.addMessage(data.data));
        }
      }
    };

    return () => {
      console.log('CLOSE');
      if (ws && ws.current) ws.current.close();
    };
  }, []);
  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.type === 'CHAT') {
        if (where === null) {
          console.log('ignore...');
        } else if (where !== data.where.toString()) {
          console.log('update list...');
          dispatch(chatActions.getChatroomList(user?.username || ''));
        } else {
          console.log('update list and message...');
          dispatch(chatActions.getChatroomList(user?.username || ''));
          dispatch(chatActions.addMessage(data.data));
        }
      }
    };
  }, [where]);

  const onLogout = () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      dispatch(userActions.logout());
    }
  };

  if (!user) return <div>no user</div>;
  return (
    <>
      <Wrapper>
        <Title to="/">
          <TitleText1>FIT</TitleText1>
          <TitleText2>ogether</TitleText2>
        </Title>

        <CategoryWrapper>
          <Category to="/workout" className={({ isActive }) => (isActive ? 'active' : '')}>
            기록
          </Category>
          <Category to="/group" className={({ isActive }) => (isActive ? 'active' : '')}>
            그룹
          </Category>
          <Category to="/post" className={({ isActive }) => (isActive ? 'active' : '')}>
            커뮤니티
          </Category>
          <Category to="/place" className={({ isActive }) => (isActive ? 'active' : '')}>
            장소
          </Category>
          <Category to="/information" className={({ isActive }) => (isActive ? 'active' : '')}>
            운동정보
          </Category>
          <CategoryIcon to="/workout" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiOutlineDocumentReport />
          </CategoryIcon>
          <CategoryIcon to="/group" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiUserGroup />
          </CategoryIcon>
          <CategoryIcon to="/post" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiOutlineAnnotation />
          </CategoryIcon>
          <CategoryIcon to="/place" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiPhotograph />
          </CategoryIcon>
          <CategoryIcon to="/information" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiInformationCircle />
          </CategoryIcon>
        </CategoryWrapper>

        <IconWrapper>
          <NotificationWrapper ref={notificationRef}>
            {notice.length > 0 ? (
              <IoIosNotifications
                onClick={() => setNotificationOpen(!notificationOpen)}
                data-testid="notificationIcon"
              />
            ) : (
              <IoIosNotificationsOutline
                onClick={() => setNotificationOpen(!notificationOpen)}
                data-testid="notificationIcon"
              />
            )}
            <Notification open={notificationOpen}>{<div>알림</div>}</Notification>
          </NotificationWrapper>
          <InfoWrapper ref={infoRef}>
            <HeaderImage
              src={process.env.REACT_APP_API_IMAGE + user.image}
              alt="profile"
              onClick={() => setInfoOpen(!infoOpen)}
              data-testid="infoIcon"
            />
            <InfoPopUpWrapper open={infoOpen}>
              <InfoImage src={process.env.REACT_APP_API_IMAGE + user.image} alt="profile" />
              <InfoPopUpSmallWrapper>
                <InfoPopUpNickname>{user.nickname}</InfoPopUpNickname>
                {infoOpen && (
                  <div style={{ display: 'flex' }}>
                    <MypageButton onClick={() => navigate(`/profile/${user.username}`)} data-testid="mypageButton">
                      <AiFillHome />
                    </MypageButton>
                    <ChatButton onClick={() => navigate(`/chat`)} data-testid="chatButton">
                      <BsFillChatDotsFill />
                    </ChatButton>
                    <LogoutButton onClick={onLogout} data-testid="logoutButton">
                      Logout
                    </LogoutButton>
                  </div>
                )}
              </InfoPopUpSmallWrapper>
            </InfoPopUpWrapper>
          </InfoWrapper>
        </IconWrapper>
      </Wrapper>
      <FakeHeader />
    </>
  );
};

export default Header;

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 2px solid #909090;
  padding: 0 20px;
  z-index: 100;
  position: fixed;
  top: 0;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const FakeHeader = styled.div`
  width: 100%;
  height: 60px;
  min-height: 60px;
`;

const Title = styled(Link)`
  font-family: FugazOne;
  display: flex;
  align-items: flex-end;
`;
const TitleText1 = styled.div`
  font-size: 42px;
  letter-spacing: -2.5px;
  color: #1c6758;
`;
const TitleText2 = styled.div`
  margin-left: -2px;
  font-size: 36px;
  letter-spacing: -2px;
  color: #349c66;

  @media all and (max-width: 600px) {
    display: none;
  }
`;

const CategoryWrapper = styled.div`
  display: flex;
  font-size: 18px;
  font-weight: 600;
  font-family: NanumSquareR;
  color: #404040;
  svg {
    width: 24px;
    height: 24px;
    color: #404040;
  }
  gap: 80px;

  @media all and (max-width: 950px) {
    gap: 60px;
  }
  @media all and (max-width: 840px) {
    gap: 40px;
  }
  @media all and (max-width: 740px) {
    gap: 25px;
  }
  @media all and (max-width: 670px) {
    gap: 10px;
  }
  @media all and (max-width: 600px) {
    gap: 20px;
  }
  @media all and (max-width: 530px) {
    gap: 10px;
  }
  @media all and (max-width: 485px) {
    gap: 20px;
  }
  @media all and (max-width: 415px) {
    gap: 10px;
  }
  @media all and (max-width: 360px) {
    gap: 3px;
  }
`;
const Category = styled(NavLink)`
  transition: color 0.15s linear;
  &:hover {
    color: #000000;
  }
  &.active {
    color: #1c6758;
  }

  @media all and (max-width: 485px) {
    display: none;
  }
`;
const CategoryIcon = styled(NavLink)`
  display: none;
  transition: color 0.15s linear;
  &:hover {
    svg {
      color: #000000;
    }
  }
  &.active {
    svg {
      color: #1c6758;
    }
  }

  @media all and (max-width: 485px) {
    display: block;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
const NotificationWrapper = styled.div`
  position: relative;
  svg {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
`;
const Notification = styled.div<{ open: boolean }>`
  position: absolute;
  background-color: #eaffe9;
  width: 270px;
  border-radius: 5px;
  top: 40px;
  right: -56px;
  height: fit-content;
  font-size: 15px;

  transition: opacity 0.15s, height 0.15s, padding 0.15s;
  z-index: ${props => (props.open ? '1' : '-100')};
  opacity: ${props => (props.open ? '1' : '0')};
  height: ${props => (props.open ? 'fit-content' : '0')};
  padding: ${props => (props.open ? '15px' : '0')};
  box-shadow: 1px 1px 2px 2px #646464;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const InfoWrapper = styled.div`
  position: relative;
`;
const HeaderImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 5px;
  border: 1px solid black;
  cursor: pointer;
`;
const InfoPopUpWrapper = styled.div<{ open: boolean }>`
  position: absolute;
  background-color: #eaffe9;
  width: 250px;
  border-radius: 5px;
  top: 43px;
  right: -5px;
  height: fit-content;
  font-size: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding: 8px;

  transition: opacity 0.15s, height 0.15s;
  z-index: ${props => (props.open ? '1' : '-100')};
  opacity: ${props => (props.open ? '1' : '0')};
  height: ${props => (props.open ? '90px' : '0')};
  box-shadow: 1px 1px 2px 2px #646464;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const InfoImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 5px;
  border: 1px solid #b1b1b1;
`;
const InfoPopUpSmallWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 80px);
  height: 60px;
  margin-top: 12px;
`;
const InfoPopUpNickname = styled.div`
  font-size: 20px;
  font-weight: 600;
  font-family: NanumSquareR;
`;
const MypageButton = styled.div`
  width: 30px;
  height: 30px;
  background-color: #349c66;
  color: white;
  border: 0;
  border-radius: 5px;
  font-family: FugazOne;
  font-size: 18px;
  padding-top: 5.5px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }
`;
const ChatButton = styled(MypageButton)`
  background-color: #3f6cd1;
  &:hover {
    background-color: #5b84df;
  }
  margin: 0 6px;
`;
const LogoutButton = styled.div`
  width: 80px;
  height: 30px;
  background-color: #349c66;
  color: white;
  border: 0;
  border-radius: 5px;
  font-family: FugazOne;
  font-size: 18px;
  padding-top: 5.5px;
  text-align: center;
  cursor: pointer;
  background-color: #9c3434;
  &:hover {
    background-color: #c74e4e;
  }
`;
