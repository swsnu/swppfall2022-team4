import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate, useParams } from 'react-router';
import { timeAgoFormat } from 'utils/datetime';
import { PostPageWithSearchBar } from './PostLayout';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);
  const post = useSelector(({ post }: RootState) => post.postDetail.post);
  const postComment = useSelector(({ post }: RootState) => post.postComment.comments);
  const postDeleteStatus = useSelector(({ post }: RootState) => post.postDelete);
  const [comment, SetComment] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(
        postActions.getPostDetail({
          post_id: id,
        }),
      );
      dispatch(
        postActions.getPostComment({
          post_id: id,
        }),
      );
    }
  }, []);
  useEffect(() => {
    if (postDeleteStatus) {
      navigate('/post');
      dispatch(postActions.stateRefresh());
    }
  }, [postDeleteStatus]);

  const deleteOnClick = async () => {
    if (id) {
      await dispatch(
        postActions.deletePost({
          post_id: id,
        }),
      );
    }
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
            <CommentWrapper>
              {postComment?.map((comment, id) => {
                return (
                  <CommentItem key={id}>
                    <span> {comment.content} </span>
                    <span> {comment.author_name} </span>
                    <span> {timeAgoFormat(comment.created)} </span>
                  </CommentItem>
                );
              })}
            </CommentWrapper>
            <CommentForm>
              <CommentInput
                placeholder="댓글 입력"
                value={comment}
                onChange={e => SetComment(e.target.value)}
              ></CommentInput>
              <CommentBtn>작성</CommentBtn>
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
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid black;
`;

const ArticleTitleWrapper = styled.div`
  width: 100%;
  height: 10%;
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
const ArticleItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  //   border-bottom: 1px solid black;
`;

const ArticleCommentWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
`;
const CommentWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
`;

const CommentForm = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
const CommentInput = styled.input`
  width: 90%;
  padding: 10px 12px;
`;
const CommentBtn = styled.button`
  width: 10%;
  padding: 10px 6px;
  background-color: #dddddd;
  border: none;
  margin-left: 5px;
  cursor: pointer;
`;

const CommentItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
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
