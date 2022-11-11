import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { useNavigate, useParams } from 'react-router';
import { PostEditorLayout } from './PostEditorLayout';
import { TagVisual } from 'store/apis/tag';

const PostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagVisual[]>([]);
  const [primeTag, setPrimeTag] = useState<TagVisual | null>(null);

  const { post, postEditStatus, user } = useSelector(({ post, user }: RootState) => ({
    post: post.postDetail.post,
    postEditStatus: post.postEdit,
    user: user.user,
  }));
  useEffect(() => {
    if (id) {
      dispatch(
        postActions.updatePostDetail({
          post_id: id,
        }),
      );
    }
  }, []);
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setSelectedTags(post.tags);
      setPrimeTag(post.prime_tag);
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

  const cancelOnClick = () => {
    // alert('are you sure?');
    navigate(`/post/${id}`);
    //TODO;
  };
  const confirmOnClick = () => {
    if (user && id) {
      dispatch(
        postActions.editPost({
          post_id: id,
          title: title,
          content: content,
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

export default PostEdit;
