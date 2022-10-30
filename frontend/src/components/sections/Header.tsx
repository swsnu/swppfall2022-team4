import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import useCheckAuth from 'hooks/useCheckAuth';
import { IoIosNotifications, IoIosNotificationsOutline } from 'react-icons/io';
import { HiOutlineDocumentReport, HiUserGroup, HiOutlineAnnotation, HiInformationCircle } from 'react-icons/hi';
import styled from 'styled-components';

const Header = () => {
  useCheckAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const notificationRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { user, notice } = useSelector((state: RootState) => ({
    user: state.user.user,
    notice: state.user.notice,
  }));

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
    setNotificationOpen(false);
    setInfoOpen(false);
  }, [location]);

  if (!user) return <div>no user</div>;
  return (
    <>
      <Wrapper>
        <Title to="/">
          <TitleText1>FIT</TitleText1>
          <TitleText2>ogether</TitleText2>
        </Title>

        <CategoryWrapper>
          <Category to="/record" className={({ isActive }) => (isActive ? 'active' : '')}>
            기록
          </Category>
          <Category to="/group" className={({ isActive }) => (isActive ? 'active' : '')}>
            그룹
          </Category>
          <Category to="/post" className={({ isActive }) => (isActive ? 'active' : '')}>
            커뮤니티
          </Category>
          <Category to="/information" className={({ isActive }) => (isActive ? 'active' : '')}>
            운동정보
          </Category>
          <CategoryIcon to="/record" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiOutlineDocumentReport />
          </CategoryIcon>
          <CategoryIcon to="/group" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiUserGroup />
          </CategoryIcon>
          <CategoryIcon to="/post" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiOutlineAnnotation />
          </CategoryIcon>
          <CategoryIcon to="/information" className={({ isActive }) => (isActive ? 'active' : '')}>
            <HiInformationCircle />
          </CategoryIcon>
        </CategoryWrapper>

        <IconWrapper>
          <NotificationWrapper ref={notificationRef}>
            {notice.length > 0 ? (
              <IoIosNotifications onClick={() => setNotificationOpen(!notificationOpen)} />
            ) : (
              <IoIosNotificationsOutline onClick={() => setNotificationOpen(!notificationOpen)} />
            )}
            <Notification open={notificationOpen}>{notificationOpen && <div>Notification!</div>}</Notification>
          </NotificationWrapper>
          <InfoWrapper ref={infoRef}>
            <img
              src={process.env.REACT_APP_API_IMAGE + user.image}
              alt="profile"
              onClick={() => setInfoOpen(!infoOpen)}
            />
            <Info open={infoOpen}>
              {infoOpen && (
                <>
                  <MypageButton onClick={() => navigate(`/mypage/${user.username}`)}>Mypage</MypageButton>
                  <LogoutButton onClick={() => dispatch(userActions.logout())}>Logout</LogoutButton>
                </>
              )}
            </Info>
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
  border-bottom: 2px solid #909090;
  padding: 0 20px;
  z-index: 100;
  position: fixed;
  top: 0;
  background-color: #ffffff;
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

  @media all and (max-width: 575px) {
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

  @media all and (max-width: 875px) {
    gap: 60px;
  }
  @media all and (max-width: 800px) {
    gap: 40px;
  }
  @media all and (max-width: 700px) {
    gap: 25px;
  }
  @media all and (max-width: 635px) {
    gap: 10px;
  }
  @media all and (max-width: 460px) {
    gap: 20px;
  }
  @media all and (max-width: 400px) {
    gap: 10px;
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

  @media all and (max-width: 460px) {
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

  @media all and (max-width: 460px) {
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
  img {
    width: 36px;
    height: 36px;
    border-radius: 5px;
    cursor: pointer;
  }
`;
const Info = styled.div<{ open: boolean }>`
  position: absolute;
  background-color: #eaffe9;
  width: 120px;
  border-radius: 5px;
  top: 43px;
  right: -5px;
  height: fit-content;
  font-size: 18px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 7.5px;

  transition: opacity 0.15s, height 0.15s;
  opacity: ${props => (props.open ? '1' : '0')};
  width: 120px;
  height: ${props => (props.open ? '80px' : '0')};
  box-shadow: 1px 1px 2px 2px #646464;
  div {
    cursor: pointer;
  }

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const MypageButton = styled.div`
  width: 100%;
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
const LogoutButton = styled(MypageButton)`
  background-color: #9c3434;
  &:hover {
    background-color: #c74e4e;
  }
`;
