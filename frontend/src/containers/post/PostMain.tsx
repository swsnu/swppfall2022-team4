import { useEffect, useState } from 'react';
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
  const [page, setPage] = useState(1);

  const postList = useSelector((rootState: RootState) => rootState.post.postList.posts);
  const maxPage = useSelector((rootState: RootState) => rootState.post.postList.pageTotal);
  const searchKeyword = useSelector((rootState: RootState) => rootState.post.postSearch);

  useEffect(() => {
    const defaultPageConfig: getPostsRequestType = {
      pageNum: page,
      pageSize: 10,
      searchKeyword: searchKeyword ? searchKeyword : undefined,
    };
    dispatch(postActions.getPosts(defaultPageConfig));
  }, [page, searchKeyword]);

  const SideBar = (
    <>
      <PostPanelWrapper>
        <CreatePostBtn onClick={() => navigate('/post/create')}>글 쓰기</CreatePostBtn>
      </PostPanelWrapper>

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
      <ArticleFooter>
        <PageNumberIndicator onClick={() => setPage(1)}>◀◀</PageNumberIndicator>
        <PageNumberIndicator onClick={() => (page >= 2 ? setPage(page => page - 1) : null)}>◀</PageNumberIndicator>
        {[...Array(5)]
          .map((_, i) => Math.floor((page - 1) / 5) * 5 + i + 1)
          .map(
            page =>
              maxPage &&
              page <= maxPage && (
                <PageNumberIndicator key={page} onClick={() => setPage(page)}>
                  {page}
                </PageNumberIndicator>
              ),
          )}
        <PageNumberIndicator onClick={() => (maxPage && page < maxPage ? setPage(page => page + 1) : null)}>
          ▶︎
        </PageNumberIndicator>
        <PageNumberIndicator onClick={() => (maxPage ? setPage(maxPage) : null)}>▶︎▶︎</PageNumberIndicator>
        현재 페이지 : {page}
      </ArticleFooter>
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
const PageNumberIndicator = styled.span`
  cursor: pointer;
  margin: 0px 5px;
`;
export default PostMain;
