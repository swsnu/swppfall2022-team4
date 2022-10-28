import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { createPostRequestType, getPostsRequestType } from 'store/apis/post';
import { useNavigate } from 'react-router';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);

  const cancelOnClick = () => {
    alert('are you sure?');
    //TODO;
  };
  const confirmOnClick = () => {
    if (user) {
      dispatch(
        postActions.createPost({
          title: title,
          content: content,
          author_name: user.username,
        }),
      );
      navigate('/post');
    }
  };
  return (
    <Wrapper>
      <ContentWrapper>
        <TitleInputWrapper>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </TitleInputWrapper>
        <ArticleCreateWrapper>
          <ContentTextArea value={content} onChange={e => setContent(e.target.value)} />
          <CreateBtnWrapper>
            <CancelPostBtn onClick={cancelOnClick}>취소</CancelPostBtn>
            <CreatePostBtn onClick={confirmOnClick}>완료</CreatePostBtn>
          </CreateBtnWrapper>
        </ArticleCreateWrapper>
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
const TitleInputWrapper = styled.div`
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid black;
  width: 100%;
`;
const ArticleCreateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 100%;
  min-height: 600px;
  height: 70vh;
  position: relative;
`;
const ContentTextArea = styled.textarea`
  width: 100%;
  height: 90%;
`;
const CreateBtnWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 100%;
  height: 10%;
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const CreatePostBtn = styled.button`
  padding: 0px 14px;
  width: 200px;
  height: 30px;
  border-radius: 15px;
  background-color: #35c9ea;
  font-size: 15px;
  letter-spacing: 0.5px;
  margin: 5px 20px;
  &:hover {
    background-color: #45d9fa;
  }
`;
const CancelPostBtn = styled.button`
  padding: 0px 14px;
  width: 200px;
  height: 30px;
  border-radius: 15px;
  background-color: #f53333;
  font-size: 15px;
  letter-spacing: 0.5px;
  margin: 5px 20px;
  &:hover {
    background-color: #ff4444;
  }
`;
export default PostCreate;
