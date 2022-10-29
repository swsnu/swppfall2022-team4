import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate, useParams } from 'react-router';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);

  const cancelOnClick = () => {
    alert('are you sure?');
    //TODO;
  };
  useEffect(() => {
    if (id) {
      dispatch(
        postActions.getPostDetail({
          id: id,
        }),
      );
    }
  }, []);
  const post = useSelector(({ post }: RootState) => post.postDetail.post);

  return (
    <Wrapper>
      <ContentWrapper>
        <SearchBarWrapper>Search Bar</SearchBarWrapper>
        <ArticleWrapper>
          <ArticleDetailWrapper>
            {post ? (
              <ArticleItem>
                <h1>{post.title}</h1>
                <h2>{post.content}</h2>
                <h2>작성자 {post.author_name}</h2>
                <h3>{post.comments_num}</h3>
              </ArticleItem>
            ) : (
              <h1>Loading</h1>
            )}
          </ArticleDetailWrapper>

          <SideBarWrapper>
            <CreatePostBtn onClick={() => navigate('/post/create')}>글 쓰기</CreatePostBtn>
            <SideBarItem>
              <button onClick={() => navigate('/post')}>글 목록으로</button>
            </SideBarItem>
            <SideBarItem>사이드바 공간2</SideBarItem>
          </SideBarWrapper>
        </ArticleWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #d7efe3;
  display: flex;
  justify-content: center;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;
const SearchBarWrapper = styled.div`
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid black;
  width: 100%;
`;
const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;
const ArticleDetailWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 80%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
`;
const SideBarWrapper = styled.div`
  border: 1px solid black;
  width: 20%;
`;
const SideBarItem = styled.div`
  margin-top: 15px;
  width: 100%;
  height: 40%;
`;
const ArticleItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
