/* eslint-disable react-hooks/exhaustive-deps */
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
import GroupButton1 from 'components/group/GroupButton1';
import GroupButton2 from 'components/group/GroupButton2';
import { TagBubble } from 'components/tag/tagbubble';

const GroupDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { group_id } = useParams<{ group_id: string }>();
  const user = useSelector(({ user }: RootState) => user.user);
  const socket = useSelector(({ chat }: RootState) => chat.socket);
  const groupActionStatus = useSelector(({ group }: RootState) => group.groupAction.status);
  const group_detail = useSelector(({ group }: RootState) => group.groupDetail.group);
  const group_detail_error = useSelector(({ group }: RootState) => group.groupDetail.error);
  const member_status = useSelector(({ group }: RootState) => group.groupMemberStatus.member_status);
  const groupDeleteStatus = useSelector(({ group }: RootState) => group.groupDelete);

  const [done, setDone] = useState(false);
  const today = new Date();
  const date =
    today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

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
    if (group_detail?.number === group_detail?.member_number) {
      alert('정원이 모두 찬 그룹입니다.');
    } else if (group_id) {
      if (user && socket && group_detail) {
        socket.send(
          JSON.stringify({
            type: 'notification',
            data: {
              category: 'group',
              info: group_detail.group_leader.username,
              content: `${user.nickname}님이 내 그룹에 참여를 신청했습니다.`,
              image: user.image,
              link: `/group/detail/${group_id}/`,
            },
          }),
        );
      }
      dispatch(groupActions.joinGroup(group_id));
    }
  };
  const exitOnClick = () => {
    if (group_id) {
      if (user && socket && group_detail) {
        socket.send(
          JSON.stringify({
            type: 'notification',
            data: {
              category: 'group',
              info: group_detail.group_leader.username,
              content: `${user.nickname}님이 내 그룹에서 탈퇴했습니다.`,
              image: user.image,
              link: `/group/detail/${group_id}/`,
            },
          }),
        );
      }
      dispatch(groupActions.exitGroup(group_id));
    }
  };
  const deleteOnClick = () => {
    // eslint-disable-next-line no-restricted-globals
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm('정말 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    ) {
      if (group_id) dispatch(groupActions.deleteGroup(group_id));
    }
  };

  if (!group_id || !group_detail) return <Loading />;
  return (
    <Wrapper>
      <Button4 content="" clicked={() => navigate(`/group`)} style={{ alignSelf: 'start' }} />
      <MainWrapper>
        <GroupWrapper className={done ? 'end' : 'ing'}>
          <GroupContentWrapper>
            <GroupAboutText>{group_detail.group_name}</GroupAboutText>
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
            <div>
              <TagBubbleWrapper>
                {group_detail.tags.map(tags => {
                  return (
                    <TagBubble
                      key={tags.id}
                      color={tags.color}
                      isPrime={group_detail.prime_tag && tags.id === group_detail.prime_tag.id}
                    >
                      {tags.name}
                    </TagBubble>
                  );
                })}
              </TagBubbleWrapper>
            </div>
          </GroupContentWrapper>
          <GroupContentWrapper>
            <ProfileImage
              src={process.env.REACT_APP_API_IMAGE + group_detail.group_leader.image}
              alt="profile"
              style={{ marginTop: '20%' }}
              onClick={() => navigate(`/profile/${group_detail.group_leader.username}`)}
            />
            <div style={{ display: 'flex' }}>
              <GroupAboutSmallText>그룹장 👑 :</GroupAboutSmallText>
              <GroupAboutNickname>{group_detail.group_leader.username}</GroupAboutNickname>
            </div>
            <GroupAboutDescription>{group_detail.description}</GroupAboutDescription>
          </GroupContentWrapper>
        </GroupWrapper>

        {group_detail.lat && group_detail.lng && group_detail.address && (
          <GroupWrapper>
            <GroupContentWrapper1>
              <GroupAboutText>Place</GroupAboutText>
              <GroupDetailDate>장소 : {group_detail.address}</GroupDetailDate>
            </GroupContentWrapper1>
            <GroupContentWrapper2>
              <Map // 로드뷰를 표시할 Container
                center={{
                  lat: group_detail.lat,
                  lng: group_detail.lng,
                }}
                style={{
                  width: '100%',
                  height: '350px',
                }}
                level={3}
              >
                <MapMarker
                  position={{
                    lat: group_detail.lat,
                    lng: group_detail.lng,
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      backgroundColor: 'white',
                      padding: '3px',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontFamily: 'NanumSquareR',
                      border: '1px solid',
                    }}
                  >
                    {group_detail.address}
                  </div>
                </MapMarker>
              </Map>
            </GroupContentWrapper2>
          </GroupWrapper>
        )}

        <GroupWrapper2>
          <GroupContentWrapper1>
            <GroupAboutText>Goal</GroupAboutText>
            <GroupDetailDate>시작일 : {group_detail.start_date ?? '기한없음'}</GroupDetailDate>
            <GroupDetailDate>마감일 : {group_detail.end_date ?? '기한없음'}</GroupDetailDate>
          </GroupContentWrapper1>
          <GroupContentWrapper2>
            <GoalListWrapper>
              <FitHeader>
                <div style={{ paddingLeft: '5%' }}>부위</div>
                <div style={{ paddingLeft: '15%' }}>종류</div>
                <div style={{ paddingLeft: '16%' }}>강도</div>
                <div style={{ paddingLeft: '10%' }}>반복</div>
                <div style={{ paddingLeft: '6%' }}>세트</div>
                <div style={{ paddingLeft: '10%' }}>시간</div>
              </FitHeader>
              {group_detail.goal.map((goal, index) => {
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
          </GroupContentWrapper2>
        </GroupWrapper2>
      </MainWrapper>
      <SideWrapper>
        {member_status === 'group_leader' && (
          <>
            <GroupButton2 content="운동 인증" end={done} clicked={() => navigate(`/group/detail/${group_id}/cert`)} />
            <GroupButton2 content="그룹 채팅" end={done} clicked={() => navigate(`/group/chat/${group_id}`)} />
            <GroupButton2 content="그룹 멤버" end={done} clicked={() => navigate(`/group/detail/${group_id}/member`)} />
            <GroupButton2 content="커뮤니티" end={done} clicked={() => navigate(`/group/detail/${group_id}/post`)} />
            <GroupButton2
              content="멤버 요청"
              end={done}
              clicked={() => navigate(`/group/detail/${group_id}/joinReq`)}
            />
            <GroupButton2 content="그룹 삭제" end={done} clicked={deleteOnClick} />
          </>
        )}
        {member_status === 'group_member' && (
          <>
            <GroupButton2 content="운동 인증" end={done} clicked={() => navigate(`/group/detail/${group_id}/cert`)} />
            <GroupButton2 content="그룹 채팅" end={done} clicked={() => navigate(`/group/chat/${group_id}`)} />
            <GroupButton2 content="그룹 멤버" end={done} clicked={() => navigate(`/group/detail/${group_id}/member`)} />
            <GroupButton2 content="커뮤니티" end={done} clicked={() => navigate(`/group/detail/${group_id}/post`)} />
            <GroupButton2 content="그룹 탈퇴" end={done} clicked={exitOnClick} />
          </>
        )}
        {member_status === 'not_member' && (
          <>
            <GroupButton1 content="그룹 가입" clicked={joinOnClick} disable={done} />
          </>
        )}
        {member_status === 'request_member' && (
          <>
            <GroupButton1 content="승인 대기" clicked={joinOnClick} disable={true} />
          </>
        )}
      </SideWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin-top: 5%;
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 0 0 50px 0;
`;

const MainWrapper = styled.div`
  width: 85%;
  height: 100%;
  margin-left: 60px;
  margin-right: 15px;
  background-color: #eafff5;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border-radius: 10px;
`;

const SideWrapper = styled.div`
  width: 10%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 15px;
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

const GroupWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #727272;
`;
const GroupWrapper2 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;
const GroupContentWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;
const GroupContentWrapper1 = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 40px;
`;
const GroupContentWrapper2 = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 40px;
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
  background-color: #ffffff;
`;

const TagBubbleWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
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
  border: 3px solid #d1d1d1;
  border-radius: 20px;
  background-color: #ffffff;
`;

const GroupDetailDate = styled.div`
  font-size: 18px;
  margin: 5px 0;
`;

export default GroupDetail;
