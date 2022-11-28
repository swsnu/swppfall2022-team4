import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import Button4 from 'components/common/buttons/Button4';
import Loading from 'components/common/Loading';
import { FitElement } from 'components/fitelement/FitElement';

const GroupDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { group_id } = useParams<{ group_id: string }>();
  const groupActionStatus = useSelector(({ group }: RootState) => group.groupAction.status);
  const group_detail = useSelector(({ group }: RootState) => group.groupDetail.group);
  const group_detail_error = useSelector(({ group }: RootState) => group.groupDetail.error);
  const member_status = useSelector(({ group }: RootState) => group.groupMemberStatus.member_status);
  const groupDeleteStatus = useSelector(({ group }: RootState) => group.groupDelete);

  const [done, setDone] = useState(false);
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getGroupDetail(group_id));
    }
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);
  useEffect(() => {
    if (groupActionStatus && group_id) {
      dispatch(groupActions.stateRefresh());
      dispatch(groupActions.getGroupDetail(group_id));
    }
  }, [groupActionStatus]);
  useEffect(() => {
    if (group_id && group_detail) {
      dispatch(groupActions.checkMemberStatus(group_id));
      if (group_detail.end_date && group_detail.end_date < date) setDone(true);
    }
  }, [group_detail]);
  useEffect(() => {
    if (group_detail_error && group_detail_error.response?.status === 404) {
      navigate('/not_found');
    }
  }, [navigate, group_detail_error]);
  useEffect(() => {
    if (groupDeleteStatus) navigate('/group');
  }, [groupDeleteStatus]);

  const joinOnClick = () => {
    if (group_detail?.number == group_detail?.member_number) {
      alert('정원이 모두 찬 그룹입니다.');
    } else if (group_id) {
      dispatch(groupActions.joinGroup(group_id));
    }
  };
  const exitOnClick = () => {
    if (group_id) {
      dispatch(groupActions.exitGroup(group_id));
    }
  };
  const deleteOnClick = () => {
    if (confirm('삭제하시겠습니까?') == true) {
      if (group_id) dispatch(groupActions.deleteGroup(group_id));
    }
  };

  if (!group_id || !group_detail) return <Loading />;
  return (
    <Wrapper>
      <GroupDetailHeader className={done ? 'end' : 'ing'}>
        <Button4 content="Back" clicked={() => navigate(`/group`)} style={{ alignSelf: 'start' }} />
        <GroupName>{group_detail.group_name}</GroupName>
        {group_detail.start_date ? (
          <GroupDate>{`${group_detail.start_date} ~ ${group_detail.end_date}`}</GroupDate>
        ) : (
          <GroupDate>기간 없음</GroupDate>
        )}
        {group_detail.number ? (
          <GroupNumber>{`인원수: ${group_detail.member_number}명 / ${group_detail.number}명`}</GroupNumber>
        ) : (
          <GroupNumber>{`인원수: ${group_detail.member_number}명`}</GroupNumber>
        )}
        {group_detail.address ? (
          <GroupPlace>{`장소: ${group_detail.address}`}</GroupPlace>
        ) : (
          <GroupPlace>{`장소: 장소 없음`}</GroupPlace>
        )}
        {group_detail.free ? <GroupFree>자유가입 O</GroupFree> : <GroupFree>자유가입 X</GroupFree>}
      </GroupDetailHeader>
      <div style={{ display: 'flex', gap: '15px', paddingLeft: '40%', paddingTop: '15px' }}>
        {member_status === 'group_leader' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/group/detail/${group_id}/cert`)}>
              Cert
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/chat/${group_id}`)}>
              Chat
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/group/detail/${group_id}/member`)}>
              Member
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/group/detail/${group_id}/joinReq`)}>
              Join Req
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={deleteOnClick}>
              Delete
            </Button>
          </div>
        )}
        {member_status === 'group_member' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/group/detail/${group_id}/cert`)}>
              Cert
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/chat/${group_id}`)}>
              Chat
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={() => navigate(`/group/detail/${group_id}/member`)}>
              Member
            </Button>
            <Button className={done ? 'end' : 'ing'} onClick={exitOnClick}>
              Leave
            </Button>
          </div>
        )}
        {member_status === 'not_member' && (
          <div style={{ display: 'flex', gap: '15px', paddingLeft: '160%' }}>
            <Button className={done ? 'disabled' : 'ing'} onClick={joinOnClick} disabled={done}>
              Join
            </Button>
          </div>
        )}
        {member_status === 'request_member' && (
          <div style={{ display: 'flex', gap: '15px', paddingLeft: '160%' }}>
            <Button className="disabled" disabled={done}>
              Pending
            </Button>
          </div>
        )}
      </div>
      <GroupAboutWrapper>
        <GroupAboutText>About</GroupAboutText>
        <ProfileImage
          src={process.env.REACT_APP_API_IMAGE + group_detail.group_leader.image}
          alt="profile"
          onClick={() => navigate(`/profile/${group_detail.group_leader.username}`)}
        />
        <div style={{ display: 'flex' }}>
          <GroupAboutSmallText>그룹장:</GroupAboutSmallText>
          <GroupAboutNickname>{group_detail.group_leader.nickname}</GroupAboutNickname>
        </div>
        <GroupAboutDescription>{group_detail.description}</GroupAboutDescription>
      </GroupAboutWrapper>

      {group_detail.lat && group_detail.lng && (
        <GroupAboutWrapper>
          <GroupAboutText>Place</GroupAboutText>
          <GroupDetailDate>장소 : {group_detail.address || '주소명을 불러오지 못했습니다.'}</GroupDetailDate>
          <Map // 로드뷰를 표시할 Container
            center={{
              lat: group_detail.lat,
              lng: group_detail.lng,
            }}
            style={{
              width: '60%',
              height: '350px',
            }}
            level={3}
          >
            <MapMarker position={{ lat: group_detail.lat, lng: group_detail.lng }}>
              {group_detail.address && <div style={{ color: '#000' }}>{group_detail.address}</div>}
            </MapMarker>
          </Map>
        </GroupAboutWrapper>
      )}

      <GroupSpecificationWrapper>
        <GroupAboutText>Specification</GroupAboutText>
        <GroupDetailDate>시작일 : {group_detail.start_date ?? '기한없음'}</GroupDetailDate>
        <GroupDetailDate>마감일 : {group_detail.end_date ?? '기한없음'}</GroupDetailDate>
        <GoalListWrapper>
          <FitHeader>
            <div style={{ paddingLeft: '5%' }}>WorkoutCategory</div>
            <div style={{ paddingLeft: '6%' }}>WorkoutType</div>
            <div style={{ paddingLeft: '16%' }}>Weight</div>
            <div style={{ paddingLeft: '12%' }}>Rep</div>
            <div style={{ paddingLeft: '8%' }}>Set</div>
            <div style={{ paddingLeft: '12%' }}>Time</div>
          </FitHeader>
          {group_detail.goal.map((goal, index) => {
            console.log(goal);
            return (
              <FitElement
                key={index}
                id={index + 1}
                type={goal.type}
                workout_type={goal.workout_type}
                category={goal.category}
                weight={goal.weight}
                rep={goal.rep}
                set={goal.set}
                time={goal.time}
              />
            );
          })}
        </GoalListWrapper>
      </GroupSpecificationWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 50px 0;
`;

const GroupDetailHeader = styled.div`
  width: 100%;
  height: 285px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #d7efe3;
  padding: 15px 15px 40px 15px;

  &&.end {
    background-color: silver;
  }
`;
const GroupName = styled.div`
  font-size: 40px;
  font-weight: 600;
  font-family: NanumSquareR;
  margin-bottom: 35px;
`;
const GroupDate = styled.div`
  font-size: 20px;
  font-family: FugazOne;
  margin-bottom: 20px;
`;
const GroupNumber = styled.div`
  font-size: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  margin-bottom: 20px;
`;

const GroupPlace = styled.div`
  font-size: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  margin-bottom: 20px;
`;

const GroupFree = styled.div`
  font-size: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  margin-bottom: 20px;
`;

const GroupAboutWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px 20px 15px;
  border-bottom: 1px solid #727272;
`;
const GroupAboutText = styled.div`
  font-size: 45px;
  font-weight: 600;
  font-family: FugazOne;
  margin-bottom: 20px;
`;
const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 30px;
  margin-bottom: 15px;
`;
const GroupAboutSmallText = styled.div`
  font-size: 21px;
  font-weight: 600;
`;
const GroupAboutNickname = styled.div`
  font-size: 18px;
  margin-left: 6px;
  font-family: 'Noto Sans KR', sans-serif;
`;
const GroupAboutDescription = styled.div`
  width: 100%;
  max-width: 600px;
  white-space: pre-wrap;
  text-align: center;
  margin: 30px 0;
  border: 2px solid #d1d1d1;
  border-radius: 20px;
  padding: 20px;
  line-height: normal;
`;

const GroupDetailWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px 50px 15px;
  border-bottom: 1px solid #727272;
  margin-bottom: 40px;
`;

const GroupSpecificationWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px 50px 15px;
  margin-bottom: 40px;
`;

const FitHeader = styled.div`
  width: 100%;
  font-size: 14px;
  padding: 15px;
  display: flex;
`;

const GoalListWrapper = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #d1d1d1;
  border-radius: 20px;
`;

const GroupDetailDate = styled.div`
  font-size: 18px;
  margin: 5px 0;
`;

const Button = styled.button`
  width: 120px;
  height: 45px;
  border: 0;
  border-radius: 5px;
  background-color: #349c66;
  color: white;
  font-size: 20px;
  font-family: FugazOne;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }

  &&.end {
    color: black;
    background-color: silver;
  }

  &&.disabled {
    color: black;
    background-color: silver;
    cursor: default;
  }
`;

export default GroupDetail;
