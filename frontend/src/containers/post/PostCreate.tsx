import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate } from 'react-router';
import { PostEditorLayout } from './PostEditorLayout';
import { TagVisual } from 'store/apis/tag';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagVisual[]>([]);
  const [primeTag, setPrimeTag] = useState<TagVisual | null>(null);

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
          tags: selectedTags,
          prime_tag: primeTag,
        }),
      );
    }
  };
  return PostEditorLayout(
    title,
    setTitle,
    content,
    setContent,
    cancelOnClick,
    confirmOnClick,
    selectedTags,
    setSelectedTags,
    primeTag,
    setPrimeTag,
  );
};

export default PostCreate;
