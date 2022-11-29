import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { tagActions } from 'store/slices/tag';
import { postActions } from 'store/slices/post';
import { initialContent, PostContent, PostEditorLayout } from '../post/PostEditorLayout';

const GroupPostEdit = () => {
  const { group_id, post_id } = useParams<{ group_id: string; post_id: string }>();

  const [postContent, setPostContent] = useState<PostContent>(initialContent);

  const { post, postEditStatus, user } = useSelector(({ post, user }: RootState) => ({
    post: post.postDetail.post,
    postEditStatus: post.postEdit,
    user: user.user,
  }));
  useEffect(() => {
    dispatch(tagActions.getTags());
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
      }));
    }
  }, [post]);
  useEffect(() => {
    if (postEditStatus) {
      navigate(`/group/detail/${group_id}/post/${post_id}`);
      dispatch(postActions.stateRefresh());
      dispatch(tagActions.clearTagState());
    }
  }, [postEditStatus]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cancelOnClick = () => {
    // alert('are you sure?');
    navigate(`/group/detail/${group_id}/post/${post_id}`);
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

export default GroupPostEdit;
