/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { getPostsRequestType } from 'store/apis/post';
import { tagActions } from 'store/slices/tag';
import { timeAgoFormat } from 'utils/datetime';
import { BlueBigBtn } from 'components/post/button';
import { TagBubble, TagBubbleWithFunc, TagBubbleX } from 'components/tag/tagbubble';
import { ColumnFlex, PostContentWrapper, PostPageWrapper, RowCenterFlex } from 'components/post/layout';
import { LoadingWithoutMinHeight } from 'components/common/Loading';
import { postPaginator } from 'components/post/paginator';
import TagDetailModal from 'components/post/TagDetailModal';
import SearchBar from 'components/common/SearchBar';
import { ArticleHeader, ArticleItemDefault } from 'components/post/ArticleItem';
import { userActions } from 'store/slices/user';

const PostMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const modalRef = useRef(null);
  const modalAnimRef = useRef(null);

  const { postList, postSearch, maxPage, searchKeyword, selected, recentCommentPost, popularTags, user } = useSelector(
    ({ post, tag, user }: RootState) => ({
      postList: post.postList.posts,
      postSearch: post.postSearch,
      maxPage: post.postList.pageTotal,
      searchKeyword: post.postSearch,
      selected: post.filterTag,
      recentCommentPost: post.recentComments.comments,
      popularTags: tag.popularTags,
      tagList: tag.tagList,
      user: user.user,
    }),
  );

  // Disable modal when OnClickOutside
  const TagDetailOnClose = () => {
    if (selected.length > 0) {
      const defaultPageConfig: getPostsRequestType = {
        pageNum: page,
        pageSize: 20,
        searchKeyword: searchKeyword ? searchKeyword : undefined,
        tags: selected,
      };
      dispatch(postActions.getPosts(defaultPageConfig));
    }
    setTagModalOpen(false);
  };
  useOnClickOutside(modalRef, TagDetailOnClose, 'mousedown');
  // Disable scroll when modal is active
  useEffect(() => {
    if (tagModalOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'unset';
    }
  }, [tagModalOpen]);

  const [search, setSearch] = useState(postSearch);
  useEffect(() => {
    setSearch(postSearch);
    dispatch(userActions.getProfile(user?.username || ''));
  }, []);
  useEffect(() => {
    if (!tagModalOpen) {
      const defaultPageConfig: getPostsRequestType = {
        pageNum: page,
        pageSize: 20,
        searchKeyword: searchKeyword ? searchKeyword : undefined,
        tags: selected,
      };
      dispatch(postActions.getPosts(defaultPageConfig));
    }
  }, [page, searchKeyword, selected]);
  useEffect(() => {
    dispatch(tagActions.getTags());
    dispatch(postActions.getRecentComments());
  }, []);
  const tagOnRemove = (id: string) => {
    dispatch(postActions.removeFilterTag(id));
  };
  const SideBar = (
    <div>
      <PostPanelWrapper>
        <BlueBigBtn onClick={() => navigate('/post/create')}>글 쓰기</BlueBigBtn>
      </PostPanelWrapper>
      {selected.length > 0 && (
        <SideBarItem>
          <SideBarTitleWrapper>
            <SideBarTitle>태그 필터링</SideBarTitle>
            {selected.length > 0 && (
              <SideBarSubtitle data-testid="filterTagClear" onClick={() => dispatch(postActions.clearFilterTag())}>
                Clear
              </SideBarSubtitle>
            )}
          </SideBarTitleWrapper>

          <TagBubbleWrapper>
            {selected.map(tag => (
              <TagBubbleWithFunc key={tag.id} color={tag.color}>
                {tag.name}
                <TagBubbleX testId="selectedTagRemove" onClick={() => tagOnRemove(tag.id)} />
              </TagBubbleWithFunc>
            ))}
          </TagBubbleWrapper>
        </SideBarItem>
      )}
      <SideBarItem>
        <SideBarTitleWrapper>
          <SideBarTitle>태그 목록</SideBarTitle>
          <SideBarSubtitle onClick={() => setTagModalOpen(true)}>자세히보기</SideBarSubtitle>
        </SideBarTitleWrapper>

        <TagBubbleWrapper>
          {popularTags &&
            popularTags.map(tag => (
              <TagBubble
                key={tag.id}
                color={tag.color}
                onClick={() => dispatch(postActions.toggleFilterTag(tag))}
                style={{ cursor: 'pointer' }}
              >
                {tag.name}
              </TagBubble>
            ))}
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
                <SideBarCommentTitle>
                  {comment.content.length > 12 ? comment.content.slice(0, 12) + '...' : comment.content}
                </SideBarCommentTitle>
                <SideBarCommentTime>{timeAgoFormat(new Date(), new Date(comment.created))}</SideBarCommentTime>
              </SideBarCommentItem>
            ))}
        </SideBarContentWrapper>
      </SideBarItem>
    </div>
  );

  const MainContent = (
    <ArticleListWrapper className={`${postList?.length === 20 && 'full'}`}>
      <ArticleHeader />
      {postList ? (
        postList.map(post => {
          return (
            <ArticleItemDefault key={post.post_id} post={post} onClick={() => navigate(`/post/${post.post_id}`)} />
          );
        })
      ) : (
        <LoadingWithoutMinHeight />
      )}
      {postPaginator({ page, setPage, maxPage: maxPage ? maxPage : 1 })}
    </ArticleListWrapper>
  );

  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <div>
          <SearchBar
            onSubmit={e => {
              e.preventDefault();
              dispatch(
                postActions.postSearch({
                  search_keyword: search,
                }),
              );
            }}
            onClear={() => {
              setSearch('');
              dispatch(
                postActions.postSearch({
                  search_keyword: '',
                }),
              );
            }}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div>
          {MainContent}
          {SideBar}
        </div>
      </PostContentWrapper>
      {TagDetailModal({
        isActive: tagModalOpen,
        onClose: TagDetailOnClose,
        modalRef,
        modalAnimRef,
        dispatch,
      })}
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
  padding: 5px 8px 5px 20px;
  margin-bottom: 3px;
  border-bottom: 0.2px solid var(--fit-support-gray-bright);
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
  border: 0px solid black;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;

  border-radius: 15px;
  &.full > div:nth-last-child(2) {
    border-bottom: none;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;

const SideBarItem = styled(ColumnFlex)`
  margin-top: 15px;
  width: 100%;
  height: fit-content;
  background-color: var(--fit-white);
  justify-content: flex-start;
  align-items: center;
  padding: 14px 2px;
  border-radius: 20px;
`;

const PostPanelWrapper = styled(ColumnFlex)`
  width: 100%;
  align-items: center;
`;

export default PostMain;
