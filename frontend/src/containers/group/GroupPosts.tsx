import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { BlueBigBtn } from 'components/post/button';
import { PostContentWrapper, PostPageWrapper } from 'components/post/layout';
import { LoadingWithoutMinHeight } from 'components/common/Loading';
import { ArticleHeader, ArticleItemDefault } from 'components/post/ArticleItem';
import { groupActions } from 'store/slices/group';
import { TagBubble } from 'components/tag/tagbubble';

const GroupPosts = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { postList, group } = useSelector(({ post, user, group }: RootState) => ({
    postList: post.postList.posts,
    user: user.user,
    group: group.groupDetail.group,
  }));

  // If user is not belong to this group...
  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getGroupDetail(group_id));
      dispatch(
        postActions.getGroupPosts({
          group_id,
        }),
      );
    }
  }, []);

  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <div>
          Group Post Header
          <span>이름 {group?.group_name}</span>
          <span>주소 {group?.address}</span>
          <span>설명 {group?.description}</span>
          <span>
            {group?.tags.map(tag => (
              <TagBubble key={tag.id} color={tag.color}>
                {tag.name}
              </TagBubble>
            ))}
          </span>
        </div>
        <div>
          <ArticleListWrapper className={`${postList?.length == 20 && 'full'}`}>
            <ArticleHeader />
            {postList ? (
              postList.map(post => {
                return (
                  <ArticleItemDefault
                    key={post.post_id}
                    post={post}
                    onClick={() => navigate(`/group/detail/${group_id}/post/${post.post_id}`)}
                  />
                );
              })
            ) : (
              <LoadingWithoutMinHeight />
            )}
          </ArticleListWrapper>
          <div>
            <BlueBigBtn onClick={() => navigate(`/group/detail/${group_id}/post/create`)}>글 쓰기</BlueBigBtn>
          </div>
        </div>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const ArticleListWrapper = styled.div`
  border: 0px solid black;
  width: 100%;
  height: 80%;
  min-height: 80%;
  background-color: #ffffff;
  position: relative;

  border-radius: 15px;
  &.full > div:nth-last-child(2) {
    border-bottom: none;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;

export default GroupPosts;
