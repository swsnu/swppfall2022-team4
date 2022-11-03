import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate } from 'react-router';
import { postEditorLayout } from './PostEditorLayout';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);
  const postCreateStatus = useSelector(({ post }: RootState) => post.postCreate);
  const cancelOnClick = () => {
    // alert('are you sure?');
    navigate('/post');
    //TODO;
  };
  useEffect(() => {
    if (postCreateStatus.status) {
      navigate(`/post/${postCreateStatus.post_id}`);
      dispatch(postActions.stateRefresh());
    }
  }, [postCreateStatus]);
  const confirmOnClick = () => {
    if (user) {
      dispatch(
        postActions.createPost({
          title: title,
          content: content,
          author_name: user.username,
        }),
      );
    }
  };
  return postEditorLayout(title, setTitle, content, setContent, cancelOnClick, confirmOnClick, []);
};

export default PostCreate;
