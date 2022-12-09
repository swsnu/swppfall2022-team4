/* eslint-disable react-hooks/exhaustive-deps */
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
import Button4 from 'components/common/buttons/Button4';

const GroupPosts = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const POST_ERROR = `/`;

  const { postList, group, postStatus } = useSelector(({ post, user, group }: RootState) => ({
    postList: post.postList.posts,
    postStatus: post.postList.error,
    user: user.user,
    group: group.groupDetail.group,
  }));

  // If user is not belong to this group...
  useEffect(() => {
    if (postStatus !== null) {
      navigate(POST_ERROR);
    }
  }, [postStatus]);

  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getGroupDetail(group_id));
      dispatch(
        postActions.getGroupPosts({
          group_id,
        }),
      );
    } else {
      navigate(POST_ERROR);
    }
    return () => {
      dispatch(postActions.stateRefresh());
    };
  }, []);

  return (
    <PostPageWrapper>
      <GroupPostContentWrapper>
        <div>
          <GroupInfoHeader>
            <span>{group?.group_name}</span>
            <span>{group?.address}</span>
            <span>
              {group?.tags.map(tag => (
                <TagBubble key={tag.id} color={tag.color}>
                  {tag.name}
                </TagBubble>
              ))}
            </span>
            <Button4 content="" clicked={() => navigate(`/group/detail/${group_id}/`)} style={{ alignSelf: 'start' }} />
          </GroupInfoHeader>
        </div>
        <div>
          <ArticleListWrapper className={`${postList?.length === 20 && 'full'}`}>
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
      </GroupPostContentWrapper>
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

const GroupInfoHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
  position: relative;

  > span:first-child {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  > span:nth-child(2) {
    color: var(--fit-support-gray);
    font-size: 14px;
    margin-bottom: 12px;
  }
  > button {
    position: absolute;
    left: 20px;
    top: 15px;
  }
`;

const GroupPostContentWrapper = styled(PostContentWrapper)`
  margin-bottom: 0px;
`;
export default GroupPosts;
