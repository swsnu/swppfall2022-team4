import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import Button1 from 'components/common/buttons/Button1';
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

  if (!group_id || !group_detail) return <Loading />;
  return (
    <Wrapper>
      <GroupDetailHeader>
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
      </GroupDetailHeader>
      <div style={{ display: 'flex', gap: '15px', paddingLeft: '60%', paddingTop: '15px' }}>
        {member_status === 'group_leader' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Button1 content="Cert" clicked={() => navigate(`/group/detail/${group_id}/cert`)} />
            <Button1 content="Member" clicked={() => navigate(`/group/detail/${group_id}/member`)} />
            <Button1 content="Delete" clicked={() => dispatch(groupActions.deleteGroup(group_id))} />
          </div>
        )}
        {member_status === 'group_member' && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Button1 content="Cert" clicked={() => navigate(`/group/detail/${group_id}/cert`)} />
            <Button1 content="Member" clicked={() => navigate(`/group/detail/${group_id}/member`)} />
            <Button1 content="Leave" clicked={exitOnClick} />
          </div>
        )}
        {member_status === 'not_member' && <Button1 content="Join" clicked={joinOnClick} />}
      </div>
      <GroupAboutWrapper>
        <GroupAboutText>About</GroupAboutText>
        <ProfileImage src={process.env.REACT_APP_API_IMAGE + group_detail.group_leader.image} alt="profile" />
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

      <GroupDetailWrapper>
        <GroupAboutText>Specification</GroupAboutText>
        <GroupDetailDate>시작일 : {group_detail.start_date ?? '기한없음'}</GroupDetailDate>
        <GroupDetailDate>마감일 : {group_detail.end_date ?? '기한없음'}</GroupDetailDate>
        {group_detail.goal.map((goal, index) => (
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
        ))}
      </GroupDetailWrapper>
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
  height: 245px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #d7efe3;
  padding: 15px 15px 40px 15px;
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
`;

const GroupDetailWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px 50px 15px;
  border-bottom: 1px solid #727272;
  margin-bottom: 40px;
`;
const GroupDetailDate = styled.div`
  font-size: 18px;
  margin: 5px 0;
`;

export default GroupDetail;
