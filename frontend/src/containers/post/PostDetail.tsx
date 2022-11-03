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
import Loading from 'components/common/Loading';

interface IPropsCommentSubmitBtn {
  disabled?: boolean;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface IPropsComment {
  isChild?: boolean;
}

const FuncBtnStatus = {
  None: 'None',
  Like: 'Like',
  Dislike: 'Dislike',
  Scrap: 'Scrap',
};
interface IPropsFuncBtn {
  color: string;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(({ user }: RootState) => user.user);
  const post = useSelector(({ post }: RootState) => post.postDetail.post);
  const postComment = useSelector(({ post }: RootState) => post.postComment.comments);
  const postDeleteStatus = useSelector(({ post }: RootState) => post.postDelete);
  const postFuncStatus = useSelector(({ post }: RootState) => post.postFunc);
  const commentFuncStatus = useSelector(({ post }: RootState) => post.postComment.commentFunc);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentReplyInput, setCommentReplyInput] = useState('');
  const [commentEditInput, setCommentEditInput] = useState('');
  const [commentNum, changeCommentNum] = useState(0);
  const [replyActivated, setReplyActivated] = useState(false);
  const [editActivated, setEditActivated] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(
        postActions.getPostDetail({
          post_id: id,
        }),
      );
    }
  }, [postFuncStatus]);
  useEffect(() => {
    if (id) {
      dispatch(
        postActions.getPostComment({
          post_id: id,
        }),
      );
    }
  }, [commentNum, commentFuncStatus]);
  useEffect(() => {
    if (postComment) setCommentList(postComment);
  }, [postComment]);
  useEffect(() => {
    if (postDeleteStatus) {
      navigate('/post');
      dispatch(postActions.stateRefresh());
    }
  }, [postDeleteStatus]);

  const postFuncLikeOnClick = () => {
    if (id) {
      dispatch(
        postActions.postFunc({
          post_id: id,
          func_type: 'like',
        }),
      );
    }
  };
  const postFuncDislikeOnClick = () => {
    if (id) {
      dispatch(
        postActions.postFunc({
          post_id: id,
          func_type: 'dislike',
        }),
      );
    }
  };
  const commentFuncLikeOnClick = (comment: Comment) => {
    if (comment.id) {
      dispatch(
        postActions.commentFunc({
          comment_id: comment.id,
          func_type: 'like',
        }),
      );
    }
  };
  const commentFuncDislikeOnClick = (comment: Comment) => {
    if (comment.id) {
      dispatch(
        postActions.commentFunc({
          comment_id: comment.id,
          func_type: 'dislike',
        }),
      );
    }
  };
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
          content: parent_comment ? commentReplyInput : commentInput,
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

  const commentReplyOpenOnClick = (comment: Comment) => {
    dispatch(postActions.toggleCommentReply({ parent_comment: comment.id }));
    setReplyActivated(!replyActivated);
  };

  const commentEditOpenOnClick = (comment: Comment) => {
    dispatch(postActions.toggleCommentEdit({ comment_id: comment.id }));
    setCommentEditInput(comment.content);
    setEditActivated(true);
  };

  const commentEditConfirmOnClick = (comment: Comment) => {
    dispatch(
      postActions.editComment({
        comment_id: comment.id,
        content: commentEditInput,
      }),
    );
    dispatch(postActions.toggleCommentEdit({ comment_id: comment.id }));
    changeCommentNum(Date.now());
    setEditActivated(false);
  };

  const commentEditCancelOnClick = (comment: Comment) => {
    dispatch(postActions.toggleCommentEdit({ comment_id: comment.id }));
    setEditActivated(false);
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
        <CommentFuncBtnWrapper>
          <CommentRedBtn onClick={() => commentEditCancelOnClick(comment)}>취소</CommentRedBtn>
          <CommentGreenBtn onClick={() => commentEditConfirmOnClick(comment)}>완료</CommentGreenBtn>
        </CommentFuncBtnWrapper>
      );
    } else {
      return (
        <CommentFuncBtnWrapper>
          {comment.parent_comment === null && (
            <CommentGreenBtn
              onClick={() => commentReplyOpenOnClick(comment)}
              disabled={replyActivated && !comment.replyActive}
            >
              답글
            </CommentGreenBtn>
          )}
          {user?.username == comment?.author_name && (
            <>
              <CommentGreenBtn disabled={editActivated} onClick={() => commentEditOpenOnClick(comment)}>
                수정
              </CommentGreenBtn>
              <CommentRedBtn onClick={commentDeleteOnClick} data-comment_id={comment.id}>
                삭제
              </CommentRedBtn>
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
                <CommentEditInput
                  value={commentEditInput}
                  onChange={e => setCommentEditInput(e.target.value)}
                ></CommentEditInput>
              ) : (
                <CommentContent>
                  {/* [My ID : {comment.id} / Parent : {comment.parent_comment}] */}
                  {comment.content}
                </CommentContent>
              )}
            </CommentContentWrapper>
            <CommentFuncWrapper>
              {CommentBtnComponent(comment)}
              <CommentFuncBtn
                onClick={() => commentFuncLikeOnClick(comment)}
                color={comment.liked ? FuncBtnStatus.Like : FuncBtnStatus.None}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </CommentFuncBtn>
              <CommentFuncNumIndicator>{comment.like_num}</CommentFuncNumIndicator>
              <CommentFuncBtn
                onClick={() => commentFuncDislikeOnClick(comment)}
                color={comment.disliked ? FuncBtnStatus.Dislike : FuncBtnStatus.None}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </CommentFuncBtn>
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
                value={commentReplyInput}
                onChange={e => setCommentReplyInput(e.target.value)}
              ></CommentInput>
              <CommentSubmitBtn
                isActive={commentReplyInput !== ''}
                disabled={commentReplyInput === ''}
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
              <PostWritterWrapper>
                <PostWritterLeftWrapper>
                  <PostWritterText> {post.author_name} </PostWritterText>
                  <PostTimeText>{timeAgoFormat(post.created)}</PostTimeText>
                </PostWritterLeftWrapper>
                <PostWritterAvatar>Avatar</PostWritterAvatar>
              </PostWritterWrapper>
            </ArticleTitleWrapper>
            <ArticleBodyContent>{post.content}</ArticleBodyContent>
            <ArticleBodyFooter>
              <h3>댓글 {post.comments_num}</h3>
              <CommentFuncBtn
                onClick={postFuncLikeOnClick}
                color={post.liked ? FuncBtnStatus.Like : FuncBtnStatus.None}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </CommentFuncBtn>
              <CommentFuncNumIndicator>{post.like_num}</CommentFuncNumIndicator>
              <CommentFuncBtn
                onClick={postFuncDislikeOnClick}
                color={post.disliked ? FuncBtnStatus.Dislike : FuncBtnStatus.None}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </CommentFuncBtn>
              <CommentFuncNumIndicator>{post.dislike_num}</CommentFuncNumIndicator>
            </ArticleBodyFooter>
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
        <Loading />
      )}
    </ArticleDetailWrapper>
  );
  const CreateBtn = <CreatePostBtn onClick={() => navigate('/post/create')}>글 쓰기</CreatePostBtn>;
  const PostAuthorPanel =
    user?.username == post?.author_name ? (
      <PostPanelWrapper>
        {CreateBtn}
        <CreatePostBtn onClick={() => navigate(`/post/${id}/edit`)}>글 편집</CreatePostBtn>
        <CreatePostBtn onClick={deleteOnClick}>글 삭제</CreatePostBtn>
      </PostPanelWrapper>
    ) : (
      <PostPanelWrapper> {CreateBtn}</PostPanelWrapper>
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

const PostWritterWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PostWritterLeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 8px;
  margin-right: 8px;
`;

const PostWritterAvatar = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  font-size: 8px;
`;

const PostWritterText = styled.span`
  font-size: 16px;
  margin-bottom: 3px;
`;

const PostTimeText = styled.span`
  font-size: 13px;
  margin-bottom: 2px;
`;

const ArticleBodyContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  /* min-height: 360px; */
`;

const ArticleBodyFooter = styled.div`
  display: flex;
  width: 100%;
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

const CommentGreenBtn = styled.button`
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

const CommentRedBtn = styled.button`
  padding: 4px 8px;
  font-size: 10px;
  background-color: #dd5454;
  border: none;
  border-radius: 4px;
  margin: 0px 4px;
  margin-right: 4px;
  color: #dddddd;
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

const handleFuncBtnColor = (color: string) => {
  switch (color) {
    case FuncBtnStatus.Like:
      return '#ff0000';
    case FuncBtnStatus.Dislike:
      return '#0000ff';
    case FuncBtnStatus.Scrap:
      return '#dddd00';
    default:
      return '#dddddd';
  }
};
const CommentFuncBtn = styled.div<IPropsFuncBtn>`
  color: ${({ color }) => handleFuncBtnColor(color)};
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
  min-width: 48px;
`;

const CommentFuncNumIndicator = styled.span`
  font-size: 12px;
  margin-left: 8px;
  min-width: 15px;
  /* margin: 0px 5px; */
`;

const CommentContentWrapper = styled.div`
  width: 100%;
  margin-top: 5px;
  text-align: left;
`;

const CommentEditInput = styled.input`
  text-align: left;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 6px;
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

const PostPanelWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CreatePostBtn = styled.button`
  padding: 5px 20px;
  width: 90%;
  border-radius: 10px;
  background-color: #35c9ea;
  font-size: 15px;
  margin-bottom: 10px;
  &:hover {
    background-color: #45d9fa;
  }
`;

export default PostDetail;
