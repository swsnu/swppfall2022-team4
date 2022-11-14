import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { getPostsRequestType } from 'store/apis/post';
import { tagActions } from 'store/slices/tag';
import { timeAgoFormat } from 'utils/datetime';
import { PostPageWithSearchBar, PostPageWrapper, SideBarWrapper } from './PostLayout';
import { BlueBigBtn } from 'components/post/button';
import { TagBubble, TagBubbleCompact } from 'components/tag/tagbubble';
import { ArticleItemGrid, ColumnFlex, RowCenterFlex } from 'components/post/layout';
import { LoadingWithoutMinHeight } from 'components/common/Loading';
import { postPaginator } from 'components/post/paginator';
import { TagDetailModal } from 'components/post/TagDetailModal';
import { useOnClickOutside } from 'usehooks-ts';

const PostMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const modalRef = useRef(null);
  const modalAnimRef = useRef(null);

  // Disable modal when OnClickOutside
  useOnClickOutside(modalRef, () => setTagModalOpen(false), 'mousedown');
  // Disable scroll when modal is active
  useEffect(() => {
    if (tagModalOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'unset';
    }
  }, [tagModalOpen]);

  const { postList, maxPage, searchKeyword, recentCommentPost, tagList } = useSelector(({ post, tag }: RootState) => ({
    postList: post.postList.posts,
    maxPage: post.postList.pageTotal,
    searchKeyword: post.postSearch,
    recentCommentPost: post.recentComments.comments,
    tagList: tag.tagList,
  }));
  useEffect(() => {
    const defaultPageConfig: getPostsRequestType = {
      pageNum: page,
      pageSize: 15,
      searchKeyword: searchKeyword ? searchKeyword : undefined,
    };
    dispatch(postActions.getPosts(defaultPageConfig));
    dispatch(postActions.getRecentComments());
  }, [page, searchKeyword]);
  useEffect(() => {
    dispatch(tagActions.getTags());
  }, []);

  const SideBar = (
    <SideBarWrapper>
      <PostPanelWrapper>
        <BlueBigBtn onClick={() => navigate('/post/create')}>글 쓰기</BlueBigBtn>
      </PostPanelWrapper>
      <SideBarItem>
        <SideBarTitleWrapper>
          <SideBarTitle>태그 목록</SideBarTitle>
          <SideBarSubtitle onClick={() => setTagModalOpen(true)}>자세히보기</SideBarSubtitle>
        </SideBarTitleWrapper>

        <TagBubbleWrapper>
          {tagList &&
            tagList.map(
              tagCategory =>
                tagCategory.tags &&
                tagCategory.tags.map(
                  (tag, index) =>
                    index <= 5 && <div key={tag.id}>{<TagBubble color={tag.color}>{tag.name}</TagBubble>}</div>,
                ),
            )}
          ...
        </TagBubbleWrapper>
      </SideBarItem>
      <SideBarItem>
        <SideBarTitleWrapper>
          <SideBarTitle>최근 댓글이 달린 글</SideBarTitle>
        </SideBarTitleWrapper>
        <SideBarContentWrapper>
          {recentCommentPost &&
            recentCommentPost.map(comment => (
              <SideBarCommentItem key={comment.comment_id} onClick={() => navigate(`/post/${comment.post_id}`)}>
                •
                <SideBarCommentTitle>
                  {comment.content.length > 12 ? comment.content.slice(0, 12) + '...' : comment.content}
                </SideBarCommentTitle>
                <SideBarCommentTime>{timeAgoFormat(comment.created)}</SideBarCommentTime>
              </SideBarCommentItem>
            ))}
        </SideBarContentWrapper>
      </SideBarItem>
    </SideBarWrapper>
  );

  const MainContent = (
    <ArticleListWrapper>
      <ArticleHeader>
        <span>대표태그</span>
        <span>제목</span>
        <span>작성자</span>
        <span>추천수</span>
        <span>작성시간</span>
      </ArticleHeader>
      {postList ? (
        postList.map((post, id) => {
          return (
            <ArticleItem data-testid="ArticleItem" key={id} onClick={() => navigate(`/post/${post.post_id}`)}>
              {post.prime_tag ? (
                <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
              ) : (
                <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
              )}
              <span>
                {post.title} <span>[{post.comments_num}]</span>
              </span>
              <span>{post.author.username}</span>
              <span>{post.like_num - post.dislike_num}</span>
              <span>{timeAgoFormat(post.created)}</span>
            </ArticleItem>
          );
        })
      ) : (
        <LoadingWithoutMinHeight />
      )}
      {maxPage ? postPaginator({ page, setPage, maxPage }) : postPaginator({ page, setPage, maxPage: 1 })}
    </ArticleListWrapper>
  );

  return (
    <PostPageWrapper>
      {PostPageWithSearchBar(MainContent, SideBar)}
      {TagDetailModal({ isActive: tagModalOpen, onClose: () => setTagModalOpen(false), modalRef, modalAnimRef })}
    </PostPageWrapper>
  );
};

const SideBarTitleWrapper = styled(RowCenterFlex)`
  width: 100%;
  border-bottom: 1px solid gray;
  margin-bottom: 8px;
  position: relative;
`;

const SideBarTitle = styled.span`
  font-size: 16px;
  text-align: center;
  padding-bottom: 5px;
`;
const SideBarSubtitle = styled.span`
  font-size: 11px;
  padding-bottom: 5px;
  margin-left: 10px;
  position: absolute;
  right: 6px;
  cursor: pointer;
  color: var(--fit-green-text);
`;
const SideBarCommentItem = styled.div`
  width: 100%;
  padding: 3px 8px 3px 6px;
  margin-bottom: 3px;
  cursor: pointer;
`;
const SideBarContentWrapper = styled.div`
  width: 100%;
`;
const SideBarCommentTitle = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;
const SideBarCommentTime = styled.span`
  font-size: 8px;
`;
const TagBubbleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 8px 5px;
`;

const ArticleListWrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
`;

const ArticleHeader = styled(ArticleItemGrid)`
  padding: 10px 10px 10px 10px;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid black;
`;

export const ArticleItem = styled(ArticleItemGrid)`
  padding: 8px 10px 8px 10px;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid black;
  cursor: pointer;
`;

const SideBarItem = styled(ColumnFlex)`
  margin-top: 15px;
  width: 100%;
  height: fit-content;
  background-color: var(--fit-white);
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0px;
`;

const PostPanelWrapper = styled(ColumnFlex)`
  width: 100%;
  align-items: center;
`;

export default PostMain;
