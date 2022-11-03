import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate, useParams } from 'react-router';
import { PostPageLayout, SideBarWrapper } from './PostLayout';

interface IProps {
  isActive?: boolean;
  onClick?: () => void;
}

const PostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const post = useSelector(({ post }: RootState) => post.postDetail.post);
  const postEditStatus = useSelector(({ post }: RootState) => post.postEdit);
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
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);
  useEffect(() => {
    if (postEditStatus) {
      navigate(`/post/${id}`);
      dispatch(postActions.stateRefresh());
    }
  }, [postEditStatus]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);

  const cancelOnClick = () => {
    // alert('are you sure?');
    navigate('/post');
    //TODO;
  };
  const confirmOnClick = () => {
    if (user && id) {
      dispatch(
        postActions.editPost({
          post_id: id,
          title: title,
          content: content,
        }),
      );
    }
  };
  const TitleInputWrapper = (
    <>
      <TitleInput type="text" placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} />
    </>
  );
  const ContentInputWrapper = (
    <ContentWrapper>
      <ContentTextArea placeholder="내용" value={content} onChange={e => setContent(e.target.value)} />
      <CreateBtnWrapper>
        <CancelPostBtn onClick={cancelOnClick}>취소</CancelPostBtn>
        <CreatePostBtn
          onClick={confirmOnClick}
          isActive={title !== '' && content !== ''}
          disabled={title === '' || content === ''}
        >
          완료
        </CreatePostBtn>
      </CreateBtnWrapper>
    </ContentWrapper>
  );
  const SideBarComponent = (
    <SideBarWrapper>
      <span>TBD</span>
    </SideBarWrapper>
  );
  return PostPageLayout(TitleInputWrapper, ContentInputWrapper, SideBarComponent);
};

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const TitleInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 8px 20px;
  font-size: 28px;
`;
const ContentTextArea = styled.textarea`
  width: 100%;
  height: 90%;
  padding: 16px 30px;
  font-size: 20px;
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
const CreatePostBtn = styled.button<IProps>`
  padding: 0px 14px;
  width: 200px;
  height: 30px;
  border-radius: 15px;
  background-color: #dddddd;
  font-size: 15px;
  letter-spacing: 0.5px;
  margin: 5px 20px;
  ${({ isActive }) =>
    isActive &&
    `
    background: #8ee5b9;
    &:hover {
      background-color: #45d9fa;
    }
  `}
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
export default PostEdit;
