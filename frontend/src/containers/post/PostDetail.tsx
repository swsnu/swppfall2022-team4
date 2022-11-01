import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate, useParams } from 'react-router';
import { timeAgoFormat } from 'utils/datetime';
import { PostPageWithSearchBar } from './PostLayout';
import { Comment } from 'store/apis/comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';

interface IPropsCommentSubmitBtn {
  disabled?: boolean;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface IPropsComment {
  isChild?: boolean;
}
const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);
  const post = useSelector(({ post }: RootState) => post.postDetail.post);
  const postComment = useSelector(({ post }: RootState) => post.postComment.comments);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const postDeleteStatus = useSelector(({ post }: RootState) => post.postDelete);
  const [commentInput, setCommentInput] = useState('');
  const [commentNum, changeCommentNum] = useState(0);
  const [replyActivated, setReplyActivated] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(
        postActions.getPostDetail({
          post_id: id,
        }),
      );
    }
  }, []);
  useEffect(() => {
    if (id) {
      dispatch(
        postActions.getPostComment({
          post_id: id,
        }),
      );
    }
  }, [commentNum]);
  useEffect(() => {
    if (postComment) setCommentList(postComment);
  }, [postComment]);
  useEffect(() => {
    if (postDeleteStatus) {
      navigate('/post');
      dispatch(postActions.stateRefresh());
    }
  }, [postDeleteStatus]);

  const deleteOnClick = () => {
    if (id) {
      dispatch(
        postActions.deletePost({
          post_id: id,
        }),
      );
    }
  };
  const commentCreateOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (user && id) {
      const parent_comment = e.currentTarget.getAttribute('data-parent_comment');
      dispatch(
        postActions.createComment({
          content: commentInput,
          author_name: user.username,
          post_id: id,
          parent_comment: parent_comment ? parent_comment : 'none',
        }),
      );
      dispatch(
        postActions.getPostComment({
          post_id: id,
        }),
      );
      setCommentInput('');
      changeCommentNum(Date.now());
      setReplyActivated(false);
    } else {
      console.log('user or id is not valid');
    }
  };

  const commentEditOnClick = (comment_id: number) => {
    dispatch(postActions.toggleCommentEdit({ comment_id: comment_id }));
    console.log('hi');
  };
  const commentDeleteOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target_id = e.currentTarget.getAttribute('data-comment_id');
    if (target_id && id) {
      dispatch(
        postActions.deleteComment({
          comment_id: target_id,
        }),
      );
      dispatch(
        postActions.getPostComment({
          post_id: id,
        }),
      );
    }
    changeCommentNum(Date.now());
  };

  const CommentBtnComponent = (comment: Comment) => {
    if (comment.editActive) {
      return (
        <div>
          <CommentAuthorBtn
            onClick={() => {
              dispatch(postActions.toggleCommentEdit({ comment_id: comment.id }));
            }}
          >
            취소
          </CommentAuthorBtn>
          <CommentAuthorBtn>완료</CommentAuthorBtn>
        </div>
      );
    } else {
      return (
        <CommentFuncBtnWrapper>
          {comment.parent_comment === null && (
            <CommentAuthorBtn
              onClick={() => {
                dispatch(postActions.toggleCommentReply({ parent_comment: comment.id }));
                setReplyActivated(!replyActivated);
              }}
              disabled={replyActivated && !comment.replyActive}
            >
              답글
            </CommentAuthorBtn>
          )}
          {user?.username == comment?.author_name && (
            <>
              <CommentAuthorBtn onClick={() => commentEditOnClick(comment.id)}>수정</CommentAuthorBtn>
              <CommentAuthorBtn onClick={commentDeleteOnClick} data-comment_id={comment.id}>
                삭제
              </CommentAuthorBtn>
            </>
          )}
        </CommentFuncBtnWrapper>
      );
    }
  };

  const CommentItemComponent = (comment: Comment) => {
    return (
      <CommentReplyWrapper key={comment.id}>
        <CommentItem isChild={comment.parent_comment !== null}>
          <CommentWritterWrapperO1>
            <CommentWritterWrapper>
              <CommentWritterAvatar>Avatar</CommentWritterAvatar>
              <CommentWritterText> {comment.author_name} </CommentWritterText>
            </CommentWritterWrapper>
          </CommentWritterWrapperO1>
          <CommentRightWrapper>
            <CommentContentWrapper>
              {comment.editActive ? (
                <CommentEditInput></CommentEditInput>
              ) : (
                <CommentContent> {comment.content} </CommentContent>
              )}
            </CommentContentWrapper>
            <CommentFuncWrapper>
              {CommentBtnComponent(comment)}
              <CommentFuncLikeBtn>
                <FontAwesomeIcon icon={faThumbsUp} />
              </CommentFuncLikeBtn>
              <CommentFuncNumIndicator>{comment.like_num}</CommentFuncNumIndicator>
              <CommentFuncLikeBtn>
                <FontAwesomeIcon icon={faThumbsDown} />
              </CommentFuncLikeBtn>
              <CommentFuncNumIndicator>{comment.dislike_num}</CommentFuncNumIndicator>
              <CommentFuncTimeIndicator> {timeAgoFormat(comment.created)} </CommentFuncTimeIndicator>
            </CommentFuncWrapper>
          </CommentRightWrapper>
        </CommentItem>
        <CommentReplyFormWrapper>
          {comment.replyActive === true && (
            <CommentReplyForm>
              <CommentInput
                placeholder="댓글 입력"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
              ></CommentInput>
              <CommentSubmitBtn
                isActive={commentInput !== ''}
                disabled={commentInput === ''}
                onClick={commentCreateOnClick}
                data-parent_comment={comment.id}
              >
                작성
              </CommentSubmitBtn>
            </CommentReplyForm>
          )}
        </CommentReplyFormWrapper>
      </CommentReplyWrapper>
    );
  };

  const PostDetailContent = (
    <ArticleDetailWrapper>
      {post ? (
        <ArticleItem>
          <ArticleBody>
            <ArticleTitleWrapper>
              <ArticleBackBtn onClick={() => navigate('/post')}>◀︎</ArticleBackBtn>
              <ArticleTitle>{post.title}</ArticleTitle>
              <span>{timeAgoFormat(post.created)}</span>
            </ArticleTitleWrapper>
            <h2>작성자 {post.author_name}</h2>
            <h2>{post.content}</h2>
            <h3>{post.comments_num}</h3>
          </ArticleBody>
          <ArticleCommentWrapper>
            <CommentWrapper>{commentList.map(comment => CommentItemComponent(comment))}</CommentWrapper>
            <CommentForm>
              <CommentInput
                placeholder="댓글 입력"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
              ></CommentInput>
              <CommentSubmitBtn
                isActive={commentInput !== ''}
                disabled={commentInput === ''}
                onClick={commentCreateOnClick}
                data-parent_comment={null}
              >
                작성
              </CommentSubmitBtn>
            </CommentForm>
          </ArticleCommentWrapper>
        </ArticleItem>
      ) : (
        <h1>Loading</h1>
      )}
    </ArticleDetailWrapper>
  );
  const CreateBtn = <CreatePostBtn onClick={() => navigate('/post/create')}>글 쓰기</CreatePostBtn>;
  const PostAuthorPanel =
    user?.username == post?.author_name ? (
      <>
        {CreateBtn}
        <CreatePostBtn onClick={() => navigate(`/post/${id}/edit`)}>글 편집</CreatePostBtn>
        <CreatePostBtn onClick={deleteOnClick}>글 삭제</CreatePostBtn>
      </>
    ) : (
      <> {CreateBtn}</>
    );
  const SideBar = (
    <>
      <SideBarItem>{PostAuthorPanel}</SideBarItem>
      <SideBarItem>사이드바 공간2</SideBarItem>
    </>
  );
  return PostPageWithSearchBar(PostDetailContent, SideBar);
};

const ArticleDetailWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 80%;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SideBarItem = styled.div`
  margin-top: 15px;
  width: 100%;
  height: 40%;
`;
const ArticleBody = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  height: 80%;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid black;
`;

const ArticleItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Article Title
const ArticleTitleWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
`;
const ArticleBackBtn = styled.button`
  margin-right: 30px;
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
`;
const ArticleTitle = styled.h1`
  font-size: 24px;
`;

// Article Comment List
const ArticleCommentWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
`;
const CommentWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
`;
const CommentAuthorBtn = styled.button`
  padding: 4px 8px;
  font-size: 10px;
  background-color: #54dd6d;
  border: none;
  border-radius: 4px;
  margin: 0px 4px;
  margin-right: 4px;
  cursor: pointer;
  :disabled {
    cursor: default;
  }
`;
const CommentReplyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentItem = styled.div<IPropsComment>`
  padding: 5px 10px;
  font-size: 14px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid gray;

  ${({ isChild }) =>
    isChild &&
    `
    padding-left: 40px;
  `}
`;
const CommentWritterWrapperO1 = styled.div`
  text-align: center;
  width: 40px;
  margin-right: 20px;
`;
const CommentWritterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 8px;
`;
const CommentWritterAvatar = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;
const CommentWritterText = styled.span`
  font-size: 12px;
`;
const CommentRightWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 50px;
  flex-direction: column;
  justify-content: space-between;
`;
const CommentFuncWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
const CommentFuncLikeBtn = styled.div`
  color: #777777;
  cursor: pointer;
  margin-left: 8px;
`;
const CommentFuncBtnWrapper = styled.div`
  margin-left: 12px;
`;
const CommentFuncTimeIndicator = styled.span`
  font-size: 12px;
  text-align: right;
  margin-left: 12px;
  min-width: 60px;
`;
const CommentFuncNumIndicator = styled.span`
  font-size: 12px;
  margin-left: 8px;
  /* margin: 0px 5px; */
`;
const CommentContentWrapper = styled.div`
  width: 100%;
  margin-top: 5px;
  text-align: left;
`;
const CommentEditInput = styled.input`
  text-align: left;
`;
const CommentContent = styled.span`
  text-align: left;
`;

// Comment Writing Form
const CommentForm = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
const CommentReplyForm = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-left: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;
const CommentReplyFormWrapper = styled.div``;
const CommentInput = styled.input`
  width: 90%;
  padding: 10px 12px;
`;
const CommentSubmitBtn = styled.button<IPropsCommentSubmitBtn>`
  width: 10%;
  padding: 10px 6px;
  background-color: #dddddd;
  border: none;
  margin-left: 5px;
  &:disabled {
  }
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    `
    background: #8ee5b9;
  `}
`;
const CreatePostBtn = styled.button`
  padding: 0px 20px;
  width: 100%;
  border-radius: 15px;
  background-color: #35c9ea;
  font-size: 15px;
  letter-spacing: 0.5px;
  &:hover {
    background-color: #45d9fa;
  }
`;

export default PostDetail;
