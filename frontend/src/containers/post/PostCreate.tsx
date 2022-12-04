import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { tagActions } from 'store/slices/tag';
import { initialContent, PostContent, PostEditorLayout } from './PostEditorLayout';
import { workoutLogActions } from 'store/slices/workout';
import { groupActions } from 'store/slices/group';

const PostCreate = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const [postContent, setPostContent] = useState<PostContent>(initialContent);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postCreateStatus = useSelector(({ post }: RootState) => post.postCreate);
  const user = useSelector(({ user }: RootState) => user.user);

  const POST_MAIN = group_id ? `/group/detail/${group_id}/post` : '/post';
  const POST_DETAIL = group_id
    ? `/group/detail/${group_id}/post/${postCreateStatus.post_id}`
    : `/post/${postCreateStatus.post_id}`;

  const cancelOnClick = () => {
    // alert('are you sure?');
    navigate(POST_MAIN);
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
      navigate(POST_DETAIL);
      dispatch(postActions.stateRefresh());
      dispatch(tagActions.clearTagState());
    }
  }, [postCreateStatus]);
  const confirmOnClick = () => {
    if (user) {
      if (group_id)
        dispatch(
          postActions.createPost({
            ...postContent,
            author_name: user.username,
            group_id: group_id,
          }),
        );
      else
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
