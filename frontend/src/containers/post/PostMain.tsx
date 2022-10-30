import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { getPostsRequestType } from 'store/apis/post';
import { timeAgoFormat } from 'utils/datetime';
import { useNavigate } from 'react-router';
import { PostPageWithSearchBar } from './PostLayout';

const PostMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultPageConfig: getPostsRequestType = {
    pageNum: 1,
    pageSize: 10,
  };
  useEffect(() => {
    dispatch(postActions.getPosts(defaultPageConfig));
  }, []);

  const postList = useSelector((rootState: RootState) => rootState.post.postList.posts);
  const SideBar = (
    <>
      <CreatePostBtn onClick={() => navigate('/post/create')}>글 쓰기</CreatePostBtn>
      <SideBarItem>사이드바 공간1</SideBarItem>
      <SideBarItem>사이드바 공간2</SideBarItem>
    </>
  );
  const MainContent = (
    <ArticleListWrapper>
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
            <ArticleItem key={id} onClick={() => navigate(`/post/${post.id}`)}>
              <span>NONE</span>
              <span>
                {post.title} <span>[{post.comments_num}]</span>
              </span>
              <span>{post.author_name}</span>
              <span>{post.like_num - post.dislike_num}</span>
              <span>{timeAgoFormat(post.created)}</span>
            </ArticleItem>
          );
        })
      ) : (
        <span></span>
      )}
      <ArticleFooter>◀ 1 2 3 4 5 6 7 8 9 10 ▶︎</ArticleFooter>
    </ArticleListWrapper>
  );

  return PostPageWithSearchBar(MainContent, SideBar);
};

const ArticleListWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 80%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
`;

const ArticleHeader = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
`;
const ArticleFooter = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;
  position: absolute;
  bottom: 0px;
`;
const ArticleItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
  cursor: pointer;
`;
const SideBarItem = styled.div`
  margin-top: 15px;
  width: 100%;
  height: 40%;
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

export default PostMain;
