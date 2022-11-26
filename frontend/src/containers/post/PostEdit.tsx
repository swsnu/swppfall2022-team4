import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { tagActions } from 'store/slices/tag';
import { postActions } from 'store/slices/post';
import { initialContent, PostContent, PostEditorLayout } from './PostEditorLayout';

const PostEdit = () => {
  const { id } = useParams<{ id: string }>();

  const [postContent, setPostContent] = useState<PostContent>(initialContent);

  const { post, postEditStatus, user } = useSelector(({ post, user }: RootState) => ({
    post: post.postDetail.post,
    postEditStatus: post.postEdit,
    user: user.user,
  }));
  useEffect(() => {
    dispatch(tagActions.getTags());
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
      navigate(`/post/${id}`);
      dispatch(postActions.stateRefresh());
      dispatch(tagActions.clearTagState());
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
          ...postContent,
          post_id: id,
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
