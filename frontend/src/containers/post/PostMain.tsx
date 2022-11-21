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
import { ColumnCenterFlex, ColumnFlex, PostContentWrapper, RowCenterFlex } from 'components/post/layout';
import { LoadingWithoutMinHeight } from 'components/common/Loading';
import { postPaginator } from 'components/post/paginator';
import TagDetailModal from 'components/post/TagDetailModal';
import { TagVisual } from 'store/apis/tag';
import SearchBar from 'components/common/SearchBar';
import { ArticleHeader, ArticleItemDefault } from 'components/post/ArticleItem';

const PostMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [selected, setSelected] = useState<TagVisual[]>([]);

  const modalRef = useRef(null);
  const modalAnimRef = useRef(null);

  // Disable modal when OnClickOutside
  const TagDetailOnClose = () => {
    if (selected.length > 0) {
      const defaultPageConfig: getPostsRequestType = {
        pageNum: page,
        pageSize: 15,
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

  const { postList, postSearch, maxPage, searchKeyword, recentCommentPost, popularTags, tagList } = useSelector(
    ({ post, tag }: RootState) => ({
      postList: post.postList.posts,
      postSearch: post.postSearch,
      maxPage: post.postList.pageTotal,
      searchKeyword: post.postSearch,
      recentCommentPost: post.recentComments.comments,
      popularTags: tag.popularTags,
      tagList: tag.tagList,
    }),
  );
  const [search, setSearch] = useState(postSearch);
  useEffect(() => {
    setSearch(postSearch);
  }, []);
  useEffect(() => {
    if (!tagModalOpen) {
      const defaultPageConfig: getPostsRequestType = {
        pageNum: page,
        pageSize: 15,
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
    setSelected(s => s.filter(item => item.id != id));
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
            {selected.length > 0 && <SideBarSubtitle onClick={() => setSelected([])}>Clear</SideBarSubtitle>}
          </SideBarTitleWrapper>

          <TagBubbleWrapper>
            {selected.map(tag => (
              <TagBubbleWithFunc key={tag.id} color={tag.color}>
                {tag.name}
                <TagBubbleX testId={'selectedTagRemove'} onClick={() => tagOnRemove(tag.id)} />
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
              <TagBubble key={tag.id} color={tag.color}>
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
                •
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
    <ArticleListWrapper>
      <ArticleHeader />
      {postList ? (
        postList.map(post => {
          return <ArticleItemDefault post={post} onClick={() => navigate(`/post/${post.post_id}`)} />;
        })
      ) : (
        <LoadingWithoutMinHeight />
      )}
      {maxPage ? postPaginator({ page, setPage, maxPage }) : postPaginator({ page, setPage, maxPage: 1 })}
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
        tagList,
        selected,
        setSelected,
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

export const PostPageWrapper = styled(ColumnCenterFlex)`
  background-color: var(--fit-green-back);
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
`;

export default PostMain;
