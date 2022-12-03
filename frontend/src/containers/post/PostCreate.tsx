import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { tagActions } from 'store/slices/tag';
import { initialContent, PostContent, PostEditorLayout } from './PostEditorLayout';
import { workoutLogActions } from 'store/slices/workout';
import { groupActions } from 'store/slices/group';

const PostCreate = () => {
  const [postContent, setPostContent] = useState<PostContent>(initialContent);

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
    dispatch(tagActions.getTags());
    dispatch(
      workoutLogActions.getRoutine({
        username: user?.username!,
      }),
    );
    dispatch(groupActions.getGroups());
  }, []);
  useEffect(() => {
    if (postCreateStatus.status) {
      navigate(`/post/${postCreateStatus.post_id}`);
      dispatch(postActions.stateRefresh());
      dispatch(tagActions.clearTagState());
    }
  }, [postCreateStatus]);
  const confirmOnClick = () => {
    if (user) {
      console.log(postContent);
      dispatch(
        postActions.createPost({
          ...postContent,
          author_name: user.username,
        }),
      );
    }
  };
  return PostEditorLayout({
    postContent,
    setPostContent,
    cancelOnClick,
    confirmOnClick,
  });
};

export default PostCreate;
