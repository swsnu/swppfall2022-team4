import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import styled from 'styled-components';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { chatActions } from 'store/slices/chat';
import { dateDiff, timeAgoFormat } from 'utils/datetime';

import Loading, { LoadingWithoutMinHeight } from 'components/common/Loading';
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

const Mypage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { username } = useParams();
  const [type, setType] = useState(0);
  const { user, profile, loading, profileError, profileContent, chatroomId } = useSelector(
    ({ user, chat }: RootState) => ({
      user: user.user,
      profile: user.profile,
      loading: user.loading,
      profileError: user.profileError,
      profileContent: user.profileContent,
      chatroomId: chat.create.id,
    }),
  );

  useEffect(() => {
    dispatch(userActions.getProfile(username || ''));
    dispatch(userActions.getProfileContent(username || ''));
    return () => {
      dispatch(userActions.resetProfile());
      dispatch(chatActions.resetCreate());
    };
  }, []);
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

  const changeType = (num: number) => {
    setType(num);
  };

  if (!user) return <div>no user</div>;
  if (!username) return <div>empty page</div>;
  if (loading || !profile) return <Loading />;
  return (
    <Wrapper>
      <ProfileWrapper>
        <LeftWrapper>
          <ProfileImage src={process.env.REACT_APP_API_IMAGE + profile.image} alt="profile" />
          <ProfileInfoWrapper>
            <NicknameWrapper>
              <Nickname>{profile.nickname}</Nickname>
              {profile.login_method == 'kakao' && (
                <SocialLoginIcon src={require('assets/images/main/social_login_icon/kakao.jpg')} alt="kakao" />
              )}
              {profile.login_method == 'google' && (
                <SocialLoginIcon src={require('assets/images/main/social_login_icon/google.png')} alt="google" />
              )}
              {profile.login_method == 'facebook' && (
                <SocialLoginIcon src={require('assets/images/main/social_login_icon/facebook.png')} alt="facebook" />
              )}
              {profile.login_method == 'github' && (
                <SocialLoginIcon src={require('assets/images/main/social_login_icon/github.png')} alt="github" />
              )}
            </NicknameWrapper>
            <Username>{profile.username}</Username>
            <Gender>{profile.gender === 'male' ? '남성' : '여성'}</Gender>
            <BodyWrapper>
              <div>{`${profile.height}cm`}</div>
              <div>{`${profile.weight}kg`}</div>
            </BodyWrapper>
          </ProfileInfoWrapper>
        </LeftWrapper>

        <ProfileEtcWrapper>
          <DateDiff>{dateDiff(profile.created)}</DateDiff>
          <DateDiffText>일 째</DateDiffText>
          {user.username === profile.username ? (
            <Button3
              content="프로필 수정"
              clicked={() => navigate('/edit_profile')}
              style={{
                marginTop: '20px',
              }}
            />
          ) : (
            <Button3
              content="메시지 전송"
              clicked={() => dispatch(chatActions.createChatroom({ username: username }))}
              style={{
                marginTop: '20px',
              }}
            />
          )}
        </ProfileEtcWrapper>
        <EditIcon onClick={() => navigate('/edit_profile')} data-testid="editProfileIcon" />
      </ProfileWrapper>

      <ContentWrapper>
        <CategoryWrapper>
          <Category active={type === 0} onClick={() => changeType(0)}>
            요약
          </Category>
          <Category active={type === 1} onClick={() => changeType(1)}>
            내 글
          </Category>
          <Category active={type === 2} onClick={() => changeType(2)}>
            내 댓글
          </Category>
          <Category active={type === 3} onClick={() => changeType(3)}>
            팔로잉
          </Category>
          <Category active={type === 4} onClick={() => changeType(4)}>
            스크랩
          </Category>
        </CategoryWrapper>
        <ProfileContentLayout>
          {
            {
              0: <span>0</span>,
              1: (
                <ProfileContentWrapper>
                  {profileContent.post ? (
                    profileContent.post.map((post, id) => {
                      return (
                        <ArticleItem key={id} onClick={() => navigate(`/post/${post.post_id}`)}>
                          {post.prime_tag ? (
                            <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
                          ) : (
                            <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
                          )}
                          <span>
                            {post.title} <span>[{post.comments_num}]</span>
                          </span>
                          <span>{post.author.username}</span>
                          <span>{post.like_num - post.dislike_num}</span>
                          <span>{timeAgoFormat(post.created)}</span>
                        </ArticleItem>
                      );
                    })
                  ) : (
                    <LoadingWithoutMinHeight />
                  )}
                </ProfileContentWrapper>
              ),
              2: (
                <ProfileContentWrapper>
                  {profileContent.comment ? (
                    profileContent.comment.map(comment => (
                      <CommentItem
                        key={comment.comment_id}
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
                    ))
                  ) : (
                    <LoadingWithoutMinHeight />
                  )}
                </ProfileContentWrapper>
              ),
              3: <span>3</span>,
              4: (
                <ProfileContentWrapper>
                  {profileContent.scrap ? (
                    profileContent.scrap.map((post, id) => {
                      return (
                        <ArticleItem key={id} onClick={() => navigate(`/post/${post.post_id}`)}>
                          {post.prime_tag ? (
                            <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
                          ) : (
                            <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
                          )}
                          <span>
                            {post.title} <span>[{post.comments_num}]</span>
                          </span>
                          <span>{post.author.username}</span>
                          <span>{post.like_num - post.dislike_num}</span>
                          <span>{timeAgoFormat(post.created)}</span>
                        </ArticleItem>
                      );
                    })
                  ) : (
                    <LoadingWithoutMinHeight />
                  )}
                </ProfileContentWrapper>
              ),
              5: <span>5</span>,
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
    height: 160px;
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
const NicknameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Nickname = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 5px;

  @media all and (max-width: 480px) {
    font-size: 24px;
  }
`;
const SocialLoginIcon = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 10px;
  margin-left: 10px;
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
const ProfileEtcWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 600px) {
    display: none;
  }
`;
const DateDiff = styled.div`
  color: #3a8d4d;
  font-size: 84px;
  font-family: 'Rubik', sans-serif;
`;
const DateDiffText = styled.div`
  font-size: 25px;
  font-family: NanumSqaureR;
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
