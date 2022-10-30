import { useEffect } from 'react';
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
  const post = useSelector(({ post }: RootState) => post.postDetail.post);
  const postComment = useSelector(({ post }: RootState) => post.postComment.comments);

  const postDetailContent = (
    <ArticleDetailWrapper>
      {post ? (
        <ArticleItem>
          <ArticleBody>
            <h1>{post.title}</h1>
            <h2>{post.content}</h2>
            <h2>작성자 {post.author_name}</h2>
            <h3>{post.comments_num}</h3>
          </ArticleBody>
          <ArticleCommentWrapper>
            {postComment ? (
              postComment.map((comment, id) => {
                return (
                  <CommentItem key={id}>
                    <span> {comment.content} </span>
                    <span> {comment.author_name} </span>
                    <span> {comment.created} </span>
                  </CommentItem>
                );
              })
            ) : (
              <span> No Comment</span>
            )}
          </ArticleCommentWrapper>
        </ArticleItem>
      ) : (
        <h1>Loading</h1>
      )}
    </ArticleDetailWrapper>
  );
  const SideBar = (
    <>
      <CreatePostBtn onClick={() => navigate('/post/create')}>글 쓰기</CreatePostBtn>
      <SideBarItem>
        <button onClick={() => navigate('/post')}>글 목록으로</button>
        {user?.username == post?.author_name ? <h1> AUTHOR! </h1> : <h2> NOT AUTHOR.</h2>}
      </SideBarItem>
      <SideBarItem>사이드바 공간2</SideBarItem>
    </>
  );
  return PostPageWithSearchBar(postDetailContent, SideBar);
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
const ArticleCommentWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 100%;
  background-color: #ffffff;
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
const CommentItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  display: flex;
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  //   border-bottom: 1px solid black;
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
