import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import styled from 'styled-components';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { chatActions } from 'store/slices/chat';
import { dateDiff, timeAgoFormat } from 'utils/datetime';

import Loading from 'components/common/Loading';
import Button3 from 'components/common/buttons/Button3';
import { TagBubbleCompact } from 'components/tag/tagbubble';
import { ArticleItem } from 'containers/post/PostMain';
import {
  CommentContent,
  CommentContentWrapper,
  FuncBtn,
  CommentFuncNumIndicator,
  CommentFuncTimeIndicator,
  CommentFuncWrapper,
  FuncType,
  IPropsComment,
} from 'containers/post/PostDetail';
import UserItem from 'components/user/UserItem';

const CATEGORY = ['게시글', '댓글', '스크랩', '팔로잉'];

const Mypage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { username } = useParams();
  const [type, setType] = useState(0);
  const { socket, user, loading, profile, profileError, chatroomId } = useSelector(({ user, chat }: RootState) => ({
    socket: chat.socket,
    user: user.user,
    loading: user.loading,
    profile: user.profile,
    profileError: user.profileError,
    chatroomId: chat.create.id,
  }));

  useEffect(() => {
    dispatch(userActions.getProfile(username || ''));
    return () => {
      dispatch(userActions.resetProfile());
      dispatch(chatActions.resetCreate());
    };
  }, [username]);
  useEffect(() => {
    if (profileError && profileError.response?.status === 404) {
      navigate('/not_found');
    }
  }, [navigate, profileError]);
  useEffect(() => {
    if (chatroomId) {
      navigate(`/chat/${chatroomId}`);
    }
  }, [chatroomId]);

  const onFollow = () => {
    if (username) {
      dispatch(userActions.follow(username));
      if (user && profile && socket) {
        socket.send(
          JSON.stringify({
            type: 'notification',
            data: {
              category: 'follow',
              info: username,
              content: `${user.nickname}님이 나를 ${profile.is_follow ? '언팔로우' : '팔로우'}했습니다.`,
              image: user.image,
              link: `/profile/${user.username}`,
            },
          }),
        );
      }
    }
  };

  if (!user || !username) return <div>no user</div>;
  if (loading || !profile) return <Loading />;
  return (
    <Wrapper>
      <ProfileWrapper>
        <LeftWrapper>
          <ProfileImage src={process.env.REACT_APP_API_IMAGE + profile.image} alt="profile" />
          <ProfileInfoWrapper>
            <Nickname>{profile.nickname}</Nickname>
            <Username>{profile.username}</Username>
            <Gender>{profile.gender === 'male' ? '남성' : '여성'}</Gender>
            <BodyWrapper>
              <div>{`${profile.height}cm`}</div>
              <div>{`${profile.weight}kg`}</div>
            </BodyWrapper>
            <LevelWrapper>
              <div>{`${profile.level} Level`}</div>
              <div>{`${profile.exp} point`}</div>
            </LevelWrapper>
          </ProfileInfoWrapper>
        </LeftWrapper>

        <ProfileEtcWrapper>
          <DateDiff>{dateDiff(profile.created)}</DateDiff>
          <DateDiffText>일 째</DateDiffText>
          {user.username === profile.username ? (
            <>
              <Button3 content="프로필 수정" clicked={() => navigate('/edit_profile')} style={{ marginTop: '20px' }} />
              <EditIcon onClick={() => navigate('/edit_profile')} data-testid="editProfileIcon" />
            </>
          ) : (
            <ButtonWrapper>
              <>
                <ChatButton onClick={() => dispatch(chatActions.createChatroom({ username: username }))}>
                  Chat
                </ChatButton>
                <ChatIcon
                  onClick={() => dispatch(chatActions.createChatroom({ username: username }))}
                  data-testid="chatButton"
                />
              </>
              {profile.is_follow ? (
                <>
                  <UnfollowButton onClick={onFollow}>UnFollow</UnfollowButton>
                  <UnfollowIcon onClick={onFollow} data-testid="followButton" />
                </>
              ) : (
                <>
                  <FollowButton onClick={onFollow}>Follow</FollowButton>
                  <FollowIcon onClick={onFollow} data-testid="unfollowButton" />
                </>
              )}
            </ButtonWrapper>
          )}
        </ProfileEtcWrapper>
      </ProfileWrapper>

      <ContentWrapper>
        <CategoryWrapper>
          {CATEGORY.map((x, idx) => (
            <Category key={idx} active={type === idx} onClick={() => setType(idx)}>
              {x}
            </Category>
          ))}
        </CategoryWrapper>
        <ProfileContentLayout>
          {
            {
              0: (
                <ProfileContentWrapper>
                  {profile.information.post.map(post => (
                    <ArticleItem key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                      {post.prime_tag ? (
                        <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
                      ) : (
                        <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
                      )}
                      <span>
                        {post.title} <span>[{post.comments_num}]</span>
                      </span>
                      <span>{post.author_name}</span>
                      <span>{post.like_num - post.dislike_num}</span>
                      <span>{timeAgoFormat(post.created)}</span>
                    </ArticleItem>
                  ))}
                </ProfileContentWrapper>
              ),
              1: (
                <ProfileContentWrapper>
                  {profile.information.comment.map(comment => (
                    <CommentItem
                      key={comment.id}
                      isChild={comment.parent_comment !== null}
                      onClick={() => navigate(`/post/${comment.post_id}`)}
                    >
                      {comment.parent_comment !== null && (
                        <CommentChildIndicator>
                          <FontAwesomeIcon icon={faArrowRight} />
                        </CommentChildIndicator>
                      )}
                      <CommentContentWrapper>
                        <CommentContent>{comment.content}</CommentContent>
                      </CommentContentWrapper>
                      <CommentFuncWrapper>
                        <FuncBtn color={comment.liked ? FuncType.Like : FuncType.None}>
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </FuncBtn>
                        <CommentFuncNumIndicator>{comment.like_num}</CommentFuncNumIndicator>
                        <FuncBtn color={comment.disliked ? FuncType.Dislike : FuncType.None}>
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </FuncBtn>
                        <CommentFuncNumIndicator>{comment.dislike_num}</CommentFuncNumIndicator>
                        <CommentFuncTimeIndicator> {timeAgoFormat(comment.created)} </CommentFuncTimeIndicator>
                      </CommentFuncWrapper>
                    </CommentItem>
                  ))}
                </ProfileContentWrapper>
              ),
              2: (
                <ProfileContentWrapper>
                  {profile.information.scrap.map(post => (
                    <ArticleItem key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                      {post.prime_tag ? (
                        <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
                      ) : (
                        <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
                      )}
                      <span>
                        {post.title} <span>[{post.comments_num}]</span>
                      </span>
                      <span>{post.author_name}</span>
                      <span>{post.like_num - post.dislike_num}</span>
                      <span>{timeAgoFormat(post.created)}</span>
                    </ArticleItem>
                  ))}
                </ProfileContentWrapper>
              ),
              3: (
                <FollowContentWrapper>
                  <FollowCountWrapper>
                    <FollowCountText>Follower</FollowCountText>
                    <FollowCountNumber>{profile.information.follower.length}</FollowCountNumber>
                  </FollowCountWrapper>
                  <FollowUserWrapper>
                    {profile.information.follower.map(user => (
                      <UserItem key={user.username} user={user} clicked={() => navigate(`/profile/${user.username}`)} />
                    ))}
                  </FollowUserWrapper>
                  <FollowCountWrapper>
                    <FollowCountText>Following</FollowCountText>
                    <FollowCountNumber>{profile.information.following.length}</FollowCountNumber>
                  </FollowCountWrapper>
                  <FollowUserWrapper>
                    {profile.information.following.map(user => (
                      <UserItem key={user.username} user={user} clicked={() => navigate(`/profile/${user.username}`)} />
                    ))}
                  </FollowUserWrapper>
                </FollowContentWrapper>
              ),
            }[type]
          }
        </ProfileContentLayout>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Mypage;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;
const ProfileWrapper = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: space-between;
  border-bottom: solid #d1d1d1 2px;
  padding: 35px 120px 25px 120px;

  @media all and (max-width: 950px) {
    padding: 35px 80px 25px 80px;
  }
  @media all and (max-width: 840px) {
    padding: 35px 50px 25px 50px;
  }
  @media all and (max-width: 800px) {
    padding: 35px 20px 25px 20px;
  }
  @media all and (max-width: 600px) {
    height: 180px;
    padding: 20px 15px 15px 15px;
  }
  @media all and (max-width: 480px) {
    padding: 20px 15px 15px 15px;
  }
`;
const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border: 2px solid black;
  border-radius: 30px;
  margin-right: 35px;

  @media all and (max-width: 700px) {
    width: 120px;
    height: 120px;
    margin-right: 15px;
  }
  @media all and (max-width: 400px) {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  @media all and (max-width: 360px) {
    display: none;
  }
`;
const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: NanumSquareR;
`;
const Nickname = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 5px;

  @media all and (max-width: 480px) {
    font-size: 24px;
  }
`;
const Username = styled.div`
  color: #464646;
  font-size: 21px;
  margin-bottom: 12px;

  @media all and (max-width: 480px) {
    font-size: 18px;
  }
`;
const Gender = styled.div`
  font-size: 20px;
  margin-bottom: 12px;

  @media all and (max-width: 480px) {
    font-size: 16px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const BodyWrapper = styled.div`
  display: flex;
  font-family: sans-serif;
  gap: 5px;
  font-size: 16px;
  color: #303030;

  @media all and (max-width: 480px) {
    font-size: 15px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const LevelWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  font-family: sans-serif;
  gap: 5px;
  font-size: 17px;
  color: #303030;

  @media all and (max-width: 480px) {
    font-size: 15px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const ProfileEtcWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const DateDiff = styled.div`
  color: #3a8d4d;
  font-size: 84px;
  font-family: 'Rubik', sans-serif;
  @media all and (max-width: 600px) {
    display: none;
  }
`;
const DateDiffText = styled.div`
  font-size: 25px;
  font-family: NanumSqaureR;
  @media all and (max-width: 600px) {
    display: none;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;
const MypageButton = styled.div`
  height: 40px;
  border: 0;
  border-radius: 5px;
  padding: 12px 10px 0 10px;
  color: white;
  font-size: 18px;
  font-family: FugazOne;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s linear;
  @media all and (max-width: 600px) {
    display: none;
  }
`;
const ChatButton = styled(MypageButton)`
  background-color: #3f6cd1;
  &:hover {
    background-color: #5b84df;
  }
`;
const FollowButton = styled(MypageButton)`
  width: 92px;
  background-color: #6aa112;
  &:hover {
    background-color: #7ebd18;
  }
`;
const UnfollowButton = styled(MypageButton)`
  width: 92px;
  font-size: 16px;
  background-color: #9c3434;
  &:hover {
    background-color: #c74e4e;
  }
`;
const EditIcon = styled(AiOutlineEdit)`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 40px;
  padding: 5px;
  background-color: #d7efe3;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #aae5c7;
  }
  align-self: flex-end;
  display: none;

  @media all and (max-width: 600px) {
    display: block;
  }
`;
const ChatIcon = styled(BsChatDots)`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 40px;
  padding: 5px;
  background-color: #dde6ff;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #c1d1ff;
  }
  align-self: flex-end;
  display: none;

  @media all and (max-width: 600px) {
    display: block;
  }
`;
const FollowIcon = styled(FaHeart)`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 40px;
  padding: 5px;
  background-color: #d7efe3;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #aae5c7;
  }
  align-self: flex-end;
  display: none;

  @media all and (max-width: 600px) {
    display: block;
  }
`;
const UnfollowIcon = styled(FaHeartBroken)`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 40px;
  padding: 5px;
  background-color: #efd7d7;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #e5aaaa;
  }
  align-self: flex-end;
  display: none;

  @media all and (max-width: 600px) {
    display: block;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-height: 600px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  border-radius: 20px;
  margin-top: 25px;
  overflow: hidden;
  /* overflow-wrap: normal; */
  /* flex-wrap: wrap; */
`;
const CategoryWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 45px;
  div + div {
    border-left: 1px solid black;
  }
`;
const Category = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  text-align: center;
  color: ${props => (props.active ? '#198331' : '#000000')};
  font-size: 20px;
  font-weight: ${props => (props.active ? '600' : '400')};
  font-family: NanumSquareR;
  border-bottom: 1px solid black;
  padding-top: 11px;

  cursor: pointer;
  &:hover {
    font-weight: 600;
  }

  @media all and (max-width: 500px) {
    font-size: 18px;
  }
  @media all and (max-width: 360px) {
    font-size: 16px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const ProfileContentLayout = styled.div`
  width: 100%;
  height: 555px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  /* Scroll Shadow */
  background-image: linear-gradient(to top, white, white), linear-gradient(to top, white, white),
    linear-gradient(to top, rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0)),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0));
  background-position: bottom center, top center, bottom center, top center;
  background-color: white;
  background-repeat: no-repeat;
  background-size: 100% 30px, 100% 30px, 100% 30px, 100% 30px;
  background-attachment: local, local, scroll, scroll;
`;
const ProfileContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* overflow-y: auto; */
  &::-webkit-scrollbar {
    display: none;
  }
`;
const CommentItem = styled.div<IPropsComment>`
  padding: 5px 30px;
  font-size: 14px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid gray;
  cursor: pointer;
  ${({ isChild }) =>
    isChild &&
    `
    padding-left: 30px;
  `}
`;
const CommentChildIndicator = styled.div`
  margin-right: 12px;
`;
const FollowContentWrapper = styled.div`
  width: 100%;
  min-height: 551.3px;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const FollowCountWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #d1d1d1;
`;
const FollowCountText = styled.div`
  font-size: 20px;
  font-weight: 600;
  font-family: NanumSquareR;
  margin-right: 8px;
`;
const FollowCountNumber = styled.div`
  font-size: 24px;
  font-weight: 600;
  font-family: NanumSquareR;
  color: #257a39;
`;
const FollowUserWrapper = styled.div`
  width: 100%;
  padding: 15px 10px;
  gap: 5px 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
