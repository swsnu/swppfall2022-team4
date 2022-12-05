/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { notificationActions } from 'store/slices/notification';

import Button4 from 'components/common/buttons/Button4';
import NotificationDetail from 'components/chat/NotificationDetail';

const Notification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, notificationList } = useSelector(({ user, notification }: RootState) => ({
    user: user.user,
    notificationList: notification.notificationList,
  }));

  useEffect(() => {
    if (user) dispatch(notificationActions.getNotificationList());
  }, [user]);

  const onDeleteAll = () => {
    if (window.confirm('알림을 모두 삭제하시겠습니까?')) {
      dispatch(notificationActions.deleteAllNotification());
    }
  };

  if (!user) return <div>no user</div>;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="Home" clicked={() => navigate(`/`)} />
        <Title>알림</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>
      <UtilWrapper>
        <CountText>{`알림 ${notificationList.length}개`}</CountText>
        <DeleteAllButton onClick={onDeleteAll}>모두 삭제</DeleteAllButton>
      </UtilWrapper>
      <ContentWrapper>
        {notificationList.map(x => (
          <NotificationDetail
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
      </ContentWrapper>
    </Wrapper>
  );
};

export default Notification;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 60px 15px;
`;
const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0 50px 0;
  padding: 0 20px;

  @media all and (max-width: 620px) {
    margin: 40px 0;
  }
`;
const Title = styled.div`
  margin-top: 20px;
  font-size: 45px;
  font-family: NanumSquareR;

  @media all and (max-width: 450px) {
    display: none;
  }
`;
const UtilWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
`;
const CountText = styled.div`
  font-size: 24px;
  font-weight: 600;
  font-family: NanumSquareR;
`;
const DeleteAllButton = styled.div`
  font-size: 21px;
  font-family: NanumSquareR;
  color: #d35a5a;
  cursor: pointer;
  transition: color 0.15s linear;
  &:hover {
    color: #da2020;
    font-weight: 600;
  }
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  height: 600px;
  max-height: 600px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  box-shadow: 0 0 2px 2px #a0bd8f;
  border-radius: 10px;
  padding: 20px;

  /* Scroll Shadow */
  background-image: linear-gradient(to top, #f7f7f7, #f7f7f7), linear-gradient(to top, #f7f7f7, #f7f7f7),
    linear-gradient(to top, rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0)),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0));
  background-position: bottom center, top center, bottom center, top center;
  background-color: #f7f7f7;
  background-repeat: no-repeat;
  background-size: 100% 30px, 100% 30px, 100% 30px, 100% 30px;
  background-attachment: local, local, scroll, scroll;
`;
