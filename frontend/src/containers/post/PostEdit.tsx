import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { tagActions } from 'store/slices/tag';
import { postActions } from 'store/slices/post';
import { initialContent, PostContent, PostEditorLayout } from './PostEditorLayout';
import { workoutLogActions } from 'store/slices/workout';
import { groupActions } from 'store/slices/group';

const PostEdit = () => {
  const { group_id, post_id } = useParams<{ group_id: string; post_id: string }>();

  const [postContent, setPostContent] = useState<PostContent>(initialContent);

  const { post, postEditStatus, user } = useSelector(({ post, user }: RootState) => ({
    post: post.postDetail.post,
    postEditStatus: post.postEdit,
    user: user.user,
  }));
  useEffect(() => {
    dispatch(tagActions.getTags());
    dispatch(
      workoutLogActions.getRoutine({
        username: user?.username!,
      }),
    );
    dispatch(groupActions.getGroups());
    if (post_id) {
      dispatch(
        postActions.updatePostDetail({
          post_id,
        }),
      );
    }
  }, []);
  useEffect(() => {
    if (post) {
      setPostContent(state => ({
        ...state,
        title: post.title,
        content: post.content,
        tags: post.tags,
        prime_tag: post.prime_tag,
        images: post.images ? post.images : [],
        routine: post.routine?.id ? post.routine.id.toString() : '',
        group: post.group?.id ? post.group.id.toString() : '',
      }));
    }
  }, [post]);
  useEffect(() => {
    if (postEditStatus) {
      if (group_id) navigate(`/group/detail/${group_id}/post/${post_id}`);
      else navigate(`/post/${post_id}`);
      dispatch(postActions.stateRefresh());
      dispatch(tagActions.clearTagState());
    }
  }, [postEditStatus]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cancelOnClick = () => {
    // alert('are you sure?');
    if (group_id) navigate(`/group/detail/${group_id}/post/${post_id}`);
    else navigate(`/post/${post_id}`);
    //TODO;
  };
  const confirmOnClick = () => {
    if (user && post_id) {
      dispatch(
        postActions.editPost({
          ...postContent,
          post_id,
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

export default PostEdit;
