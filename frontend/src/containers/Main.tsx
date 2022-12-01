import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiFillLike } from 'react-icons/ai';
import { BsPencil, BsSignpost2, BsFillPersonFill, BsFillPeopleFill } from 'react-icons/bs';
import styled from 'styled-components';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { postActions } from 'store/slices/post';
import { groupActions } from 'store/slices/group';
import { workoutLogActions } from 'store/slices/workout';
import { timeAgoFormat } from 'utils/datetime';
import { LoadingComponent } from 'components/common/Loading';
import { WorkoutChart } from 'components/main/WorkoutChart';

export type chartData = {
  date: string;
  calories: number;
};

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, fitElements, posts, groups, calendarInfo } = useSelector((state: RootState) => ({
    user: state.user,
    fitElements: state.workout_log.daily_fit_elements,
    posts: state.post.main,
    groups: state.group.groupList.groups,
    calendarInfo: state.workout_log.calendar_info,
  }));
  const calories_map: chartData[] = [];

  useEffect(() => {
    dispatch(
      workoutLogActions.getCalendarInfo({
        username: user.user?.username!,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      }),
    );
    dispatch(
      workoutLogActions.getDailyLog({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        specific_date: new Date().getDate(),
        username: user.user?.username!,
        data: {
          username: user.user?.username!,
        },
      }),
    );
    dispatch(postActions.getPostsMain());
    dispatch(groupActions.getGroups());
    dispatch(userActions.getProfile(user.user?.username || ''));

    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  for (const child of calendarInfo) {
    let sMonth = String(child.month);
    let sDate = String(child.date);
    sMonth = sMonth.padStart(2, '0');
    sDate = sDate.padStart(2, '0');
    const dateStringFormat = sMonth + '-' + sDate;
    calories_map.push({
      date: dateStringFormat,
      calories: child.calories * (user.profile?.weight || 1),
    });
  }

  const get_image = (name: string | null) => {
    if (name) {
      const tag_class = ['등운동', '가슴운동', '어깨운동', '하체운동', '복근운동', '팔운동', '유산소', '기타운동'];
      const image_names = ['back', 'chest', 'deltoid', 'leg', 'abs', 'arm', 'cardio', 'etc'];
      return image_names[tag_class.indexOf(name)];
    } else {
      return 'example';
    }
  };

  return (
    <Wrapper>
      <BannerWrapper>
        <img src={require('assets/images/main/main_banner.jpg')} alt="mainBanner" />
        <BannerText>
          Fitness
          <br />
          Together
        </BannerText>
      </BannerWrapper>
      <ContentWrapper>
        <WorkoutWrapper>
          <SectionTitle style={{ marginBottom: '12px', fontSize: '24px' }}>이번 달 칼로리 차트</SectionTitle>
          <WorkoutChartWrapper>
            <WorkoutChart info={calories_map} />
          </WorkoutChartWrapper>
          <SectionTitle style={{ marginBottom: '24px' }}>오늘의 운동 기록</SectionTitle>
          <FitElementWrapper>
            {fitElements.slice(0, 4).map(x => (
              <FitElementItemWrapper key={x.data.id}>
                <FitElementImage
                  src={require(`assets/images/workout_log/fitelement_category/${get_image(x.data.category)}.png`)}
                />
                <FitElementCategory>{x.data.workout_type}</FitElementCategory>
                <FitElementContent>
                  {`${x.data.weight || '-'} / ${x.data.rep || '-'} / ${x.data.set || '-'} / ${x.data.time || '-'}`}
                </FitElementContent>
              </FitElementItemWrapper>
            ))}
            {fitElements.length === 0 && <NoFitElementsText>운동 기록이 없습니다.</NoFitElementsText>}
            {fitElements.length > 4 && <ManyFitElementsText>{`외 ${fitElements.length - 4}개`}</ManyFitElementsText>}
          </FitElementWrapper>
          <LinkText onClick={() => navigate('/workout')} style={{ marginTop: '25px' }}>
            <BsPencil />
            운동 기록 작성하러 가기
          </LinkText>
        </WorkoutWrapper>
        <RightWrapper>
          <SectionItemWrapper>
            <SectionTitle style={{ marginBottom: '0px' }}>인기 게시글</SectionTitle>
            <PostWrapper>
              {posts ? (
                <>
                  {posts.map(x => (
                    <PostItemWrapper key={x.post_id} onClick={() => navigate(`/post/${x.post_id}`)}>
                      <PostSmallWrapper1>
                        <PostTitle>{x.title}</PostTitle>
                        <PostAuthor>{x.author.nickname}</PostAuthor>
                      </PostSmallWrapper1>
                      <PostSmallWrapper2>
                        <div style={{ display: 'flex' }}>
                          <AiFillLike />
                          <div style={{ fontSize: '15px', fontFamily: 'Noto Sans KR' }}>{x.like_num}</div>
                        </div>
                        <div style={{ fontSize: '15px', fontFamily: 'Noto Sans KR', color: '#646464' }}>
                          {timeAgoFormat(new Date(), new Date(x.created))}
                        </div>
                      </PostSmallWrapper2>
                    </PostItemWrapper>
                  ))}
                  {posts.length === 0 && <NoFitElementsText>게시글이 없습니다.</NoFitElementsText>}
                </>
              ) : (
                <LoadingComponent r="80px" />
              )}
            </PostWrapper>
            <LinkText onClick={() => navigate('/post')}>
              <BsSignpost2 />
              게시글 더 보기
            </LinkText>
          </SectionItemWrapper>
          <SectionItemWrapper>
            <SectionTitle style={{ marginBottom: '0px' }}>최근 생성된 그룹</SectionTitle>
            <GroupWrapper>
              {groups ? (
                <>
                  {groups.slice(0, 3).map(x => (
                    <GroupItemWrapper key={x.id} onClick={() => navigate(`/group/detail/${x.id}`)}>
                      <GroupName>{x.group_name}</GroupName>
                      <GroupSmallWrapper>
                        <div style={{ display: 'flex' }}>
                          <BsFillPersonFill />
                          <div
                            style={{ fontSize: '15px', fontFamily: 'Noto Sans KR' }}
                          >{`멤버 ${x.member_number}명`}</div>
                        </div>
                        <div style={{ fontSize: '15px', fontFamily: 'Noto Sans KR' }}>
                          {x.start_date ? `${x.start_date} ~ ${x.end_date}` : ``}
                        </div>
                      </GroupSmallWrapper>
                    </GroupItemWrapper>
                  ))}
                  {groups.length === 0 && <NoFitElementsText>그룹이 없습니다.</NoFitElementsText>}
                </>
              ) : (
                <LoadingComponent r="80px" />
              )}
            </GroupWrapper>
            <LinkText onClick={() => navigate('/group')}>
              <BsFillPeopleFill />
              그룹 더 보기
            </LinkText>
          </SectionItemWrapper>
        </RightWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(137deg, #ffffff, #f6fffa, #f9fffd, #fafffb);
  background-size: 400% 400%;
  animation: moving 10s ease infinite;
  @keyframes moving {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @media all and (max-width: 700px) {
    flex-direction: column;
  }

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const BannerWrapper = styled.div`
  width: 100%;
  position: relative;
  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    object-position: 0 75%;
    filter: brightness(70%);
    top: 700px;
  }
  @media all and (max-width: 480px) {
    img {
      height: 250px;
    }
  }
`;
const BannerText = styled.div`
  position: absolute;
  cursor: default;
  color: #ffffff;
  font-size: 66px;
  font-family: 'Anton', sans-serif;
  text-align: center;
  text-shadow: 2px 2px 3px #575757;
  top: 50%;
  right: 0%;
  transform: translate(-50%, -50%);
  line-height: 72px;
  @media all and (max-width: 480px) {
    left: 50%;
    font-size: 45px;
    line-height: 50px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0 35px 0;
  gap: 20px;
`;
const WorkoutWrapper = styled.div`
  width: calc(50% - 20px);
  height: 890px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 25px 20px;
  box-shadow: 0px 0px 6px #383838;
`;
const RightWrapper = styled.div`
  width: calc(50% - 20px);
  height: 890px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const SectionItemWrapper = styled.div`
  width: 100%;
  height: 435px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 25px 20px;
  box-shadow: 0px 0px 6px #383838;
`;
const SectionTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  font-family: NanumSquareR;
  color: #1a6932;
  margin-bottom: 20px;
`;
const LinkText = styled.div`
  font-size: 24px;
  font-weight: 600;
  font-family: NanumSquareR;
  color: #9b9b9b;
  svg {
    width: 30px;
    height: 30px;
    margin: 0 6px -6px 0;
  }
  cursor: pointer;
  transition: color 0.2s linear;
  &:hover {
    color: black;
  }
`;

const WorkoutChartWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 290px;
  padding-bottom: 18px;
  margin-bottom: 24px;
  border-bottom: 1px solid #cecece;
  display: flex;
  align-items: center;
`;
const FitElementWrapper = styled.div`
  width: 100%;
  height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  border-radius: 10px;
  padding-top: 8px;
  gap: 5px;
`;
const NoFitElementsText = styled.div`
  font-size: 24px;
  font-family: NanumSquareR;
`;
const ManyFitElementsText = styled.div`
  width: 100%;
  text-align: end;
  font-size: 18px;
  font-family: NanumSquareR;
  margin: 0 10px 5px 0;
`;
const FitElementItemWrapper = styled.div`
  width: 100%;
  height: 83px;
  display: flex;
  padding: 10px 20px;
  background-color: #ffffff;
  box-shadow: 0.5px 0.5px 2px #494949;
  align-items: center;
  justify-content: space-between;
`;
const FitElementImage = styled.img`
  width: 63px;
  height: 63px;
  margin-right: 17px;
`;
const FitElementCategory = styled.div`
  width: 150px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 18px;
  font-weight: 600;
  font-family: NanumSquareR;
`;
const FitElementContent = styled.div`
  width: 220px;
  text-align: end;
  overflow: hidden;
  font-size: 18px;
  font-family: NanumSquareR;
`;

const PostWrapper = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
const PostItemWrapper = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: NanumSquareR;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  padding: 4px 6px;
  transition: border 0.15s linear;
  cursor: pointer;
  &:hover {
    border: 1px solid #757575;
  }
`;
const PostSmallWrapper1 = styled.div`
  display: flex;
  justify-content: space-between;
`;
const PostSmallWrapper2 = styled.div`
  display: flex;
  justify-content: space-between;
  svg {
    color: #ef5454;
    margin-right: 3px;
  }
`;
const PostTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const PostAuthor = styled.div`
  font-size: 18px;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const GroupWrapper = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;
const GroupItemWrapper = styled.div`
  background-color: #f5fffd;
  width: 100%;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: NanumSquareR;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  padding: 10px;
  transition: border 0.15s linear;
  cursor: pointer;
  &:hover {
    border: 1px solid #757575;
  }
`;
const GroupName = styled.div`
  width: 100%;
  max-width: 400px;
  font-size: 22px;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const GroupSmallWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  svg {
    color: #2da782;
    margin-right: 3px;
  }
`;
