import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { tagActions } from 'store/slices/tag';
import { initialContent, PostContent, PostEditorLayout } from '../post/PostEditorLayout';

const GroupPostCreate = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const [postContent, setPostContent] = useState<PostContent>(initialContent);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);
  const postCreateStatus = useSelector(({ post }: RootState) => post.postCreate);
  const cancelOnClick = () => {
    // alert('are you sure?');
    navigate(`/group/detail/${group_id}/post`);
    //TODO;
  };
  useEffect(() => {
    dispatch(tagActions.getTags());
  }, []);
  useEffect(() => {
    if (postCreateStatus.status) {
      navigate(`/group/detail/${group_id}/post/${postCreateStatus.post_id}`);
      dispatch(postActions.stateRefresh());
      dispatch(tagActions.clearTagState());
    }
  }, [postCreateStatus]);
  const confirmOnClick = () => {
    if (user) {
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

export default GroupPostCreate;
