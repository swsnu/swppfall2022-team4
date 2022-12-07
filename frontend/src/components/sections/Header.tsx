/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { IoIosNotifications, IoIosNotificationsOutline } from 'react-icons/io';
import { HiOutlineDocumentReport, HiUserGroup, HiOutlineAnnotation, HiInformationCircle } from 'react-icons/hi';
import styled from 'styled-components';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { chatActions } from 'store/slices/chat';
import { notificationActions } from 'store/slices/notification';
import NotificationItem from 'components/chat/NotificationItem';

const CATEGORY = [
  { to: '/workout', text: '기록', icon: <HiOutlineDocumentReport /> },
  { to: '/group', text: '그룹', icon: <HiUserGroup /> },
  { to: '/post', text: '커뮤니티', icon: <HiOutlineAnnotation /> },
  { to: '/information', text: '운동정보', icon: <HiInformationCircle /> },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const notificationRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { user, notificationList, where } = useSelector((state: RootState) => ({
    user: state.user.user,
    notificationList: state.notification.notificationList,
    where: state.chat.where,
  }));

  useEffect(() => {
    if (user) dispatch(notificationActions.getNotificationList());
    if (!user) navigate('/login');
  }, [user]);
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
    dispatch(chatActions.setWhere(location.pathname));
    window.scrollTo(0, 0);
    setNotificationOpen(false);
    setInfoOpen(false);
  }, [dispatch, location]);
  const ws: React.MutableRefObject<WebSocket | null> = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(
      (process.env.REACT_APP_MODE === 'development' ? `ws` : `wss`) +
        `://${process.env.REACT_APP_API_SOCKET_URL}/ws/chat/${user && user.username}/`,
    );
    ws.current.onopen = () => dispatch(chatActions.setSocket(ws.current));
    ws.current.onmessage = onMessage;
    return () => {
      if (ws && ws.current) ws.current.close();
    };
  }, []);
  useEffect(() => {
    if (ws.current) ws.current.onmessage = onMessage;
  }, [where]);

  const onMessage = (e: any) => {
    const data = JSON.parse(e.data);
    if (data.type === 'CHAT' && where.substring(0, 5) === '/chat') {
      dispatch(chatActions.getChatroomList());
      if (where === `/chat/${data.where}` || where === `/chat/${data.where}/`) {
        dispatch(chatActions.addMessage(data.message));
      }
    } else if (
      data.type === 'GROUP_CHAT' &&
      (where === `/group/chat/${data.where}` || where === `/group/chat/${data.where}/`)
    ) {
      dispatch(chatActions.addMessage(data.message));
    } else if (data.type === 'NOTIFICATION') {
      dispatch(notificationActions.getNotificationList());
    }
  };
  const onLogout = () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      dispatch(userActions.logout());
    }
  };
  const nav = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

  if (!user) return <div>no user</div>;
  return (
    <>
      <Wrapper>
        <Title to="/">
          <TitleText1>FIT</TitleText1>
          <TitleText2>ogether</TitleText2>
        </Title>

        <CategoryWrapper>
          {CATEGORY.map(x => (
            <Category key={x.text} to={x.to} className={nav}>
              {x.text}
            </Category>
          ))}
          {CATEGORY.map(x => (
            <CategoryIcon key={x.text} to={x.to} className={nav}>
              {x.icon}
            </CategoryIcon>
          ))}
        </CategoryWrapper>

        <IconWrapper>
          <NotificationWrapper ref={notificationRef}>
            {notificationList.length > 0 ? (
              <>
                <IoIosNotifications
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  data-testid="notificationIcon"
                />
                <New>{Math.min(notificationList.length, 99)}</New>
              </>
            ) : (
              <IoIosNotificationsOutline
                onClick={() => setNotificationOpen(!notificationOpen)}
                data-testid="notificationIcon"
              />
            )}

            <Notification open={notificationOpen}>
              {notificationOpen && (
                <>
                  <NotificationText>알림</NotificationText>
                  {notificationList.slice(0, 4).map(x => (
                    <NotificationItem
                      key={x.id}
                      content={x.content}
                      image={x.image}
                      created={x.created}
                      clicked={() => {
                        navigate(x.link);
                        dispatch(notificationActions.deleteNotification(x.id));
                      }}
                      clickedDelete={() => dispatch(notificationActions.deleteNotification(x.id))}
                    />
                  ))}
                  {notificationList.length === 0 ? (
                    <div>새로운 알림이 없습니다.</div>
                  ) : (
                    <MoreNotification onClick={() => navigate('/notification')}>더 보기</MoreNotification>
                  )}
                </>
              )}
            </Notification>
          </NotificationWrapper>

          <InfoWrapper ref={infoRef}>
            <HeaderImage
              src={process.env.REACT_APP_API_IMAGE + user.image}
              alt="profile"
              onClick={() => setInfoOpen(!infoOpen)}
              data-testid="infoIcon"
            />
            <InfoPopUpWrapper open={infoOpen}>
              {infoOpen && (
                <>
                  <InfoImage src={process.env.REACT_APP_API_IMAGE + user.image} alt="profile" />
                  <InfoPopUpSmallWrapper>
                    <InfoPopUpNickname>{user.nickname}</InfoPopUpNickname>
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
                  </InfoPopUpSmallWrapper>
                </>
              )}
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
  display: grid;
  grid-template-columns: 10fr 80fr 10fr;
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
  justify-content: center;
  align-items: center;
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
  justify-content: flex-end;
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
const New = styled.div`
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 20px;
  background-color: #db5353;
  color: white;
  text-align: center;
  font-size: 11px;
  padding-top: 2px;
  top: -5px;
  right: -3px;
`;
const Notification = styled.div<{ open: boolean }>`
  position: absolute;
  background-color: #f3fdf3;
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
const NotificationText = styled.div`
  font-size: 20px;
  font-weight: 600;
  font-family: NanumSquareR;
  padding-bottom: 10px;
  border-bottom: 1px solid #a7a7a7;
  margin-bottom: 10px;
`;
const MoreNotification = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-family: NanumSquareR;
  cursor: pointer;
  margin-top: 15px;
  color: #363636;
  transition: color 0.15s linear;
  &:hover {
    color: #000000;
    font-weight: 600;
  }
`;

const InfoWrapper = styled.div`
  position: relative;
`;
const HeaderImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 5px;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
`;
const InfoPopUpWrapper = styled.div<{ open: boolean }>`
  position: absolute;
  background-color: #f2fff2;
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
  background-color: white;
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
