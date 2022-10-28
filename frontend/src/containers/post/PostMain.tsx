import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { getPostsRequestType } from 'store/apis/post';
import { timeAgoFormat } from 'utils/datetime';

const PostMain = () => {
  const dispatch = useDispatch();

  const defaultPageConfig: getPostsRequestType = {
    pageNum: 1,
    pageSize: 10,
  };
  useEffect(() => {
    dispatch(postActions.getPosts(defaultPageConfig));
  }, []);
  const postList = useSelector((rootState: RootState) => rootState.post.posts);
  return (
    <Wrapper>
      <ContentWrapper>
        <ArticleHeader>
          <span>대표태그</span>
          <span>제목</span>
          <span>작성자</span>
          <span>추천수</span>
          <span>작성시간</span>
        </ArticleHeader>
        {postList ? (
          postList.map((post, id) => {
            return (
              <ArticleItem key={id}>
                <span>NONE</span>
                <span>
                  {post.title} <span>[{post.comments}]</span>
                </span>
                <span>ID : {post.author_id}</span>
                <span>{post.like_num - post.dislike_num}</span>
                <span>{timeAgoFormat(post.created)}</span>
              </ArticleItem>
            );
          })
        ) : (
          <span></span>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #22f2f2;
  display: flex;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;

const ContentWrapper = styled.div`
  width: 58%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

const ArticleHeader = styled.div`
  padding: 25px;
  width: 80%;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  justify-content: space-between;
`;
const ArticleItem = styled.div`
  padding: 25px;
  width: 80%;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  justify-content: space-between;
`;
export default PostMain;
