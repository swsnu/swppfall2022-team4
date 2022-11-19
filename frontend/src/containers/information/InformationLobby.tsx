import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RowCenterFlex } from 'components/post/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { infoActions } from 'store/slices/information';
import { RootState } from 'index';
import NotFound from 'components/common/NotFound';
import { TagBubbleCompact } from 'components/tag/tagbubble';
import { ArticleItem } from 'containers/post/PostMain';
import { useNavigate } from 'react-router-dom';
import { Post } from 'store/apis/post';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { timeAgoFormat } from 'utils/datetime';
// import { timeAgoFormat } from 'utils/datetime';

interface IPropsSearchClear {
  isActive?: boolean;
}
interface InfoPageArticleIprops {
  post: Post;
}

const InformationLobby = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info } = useSelector(({ info }: RootState) => ({
    info: info,
  }));
  useEffect(() => {
    dispatch(infoActions.initializeInformation());
  }, []);
  const InfoPageArticleItem = ({ post }: InfoPageArticleIprops) => (
    <ArticleItem key={post.post_id} onClick={() => navigate(`/post/${post.post_id}`)}>
      {post.prime_tag ? (
        <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
      ) : (
        <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
      )}
      <span>
        {post.title} {post.has_image && <FontAwesomeIcon icon={faImage} />}
        <span>[{post.comments_num}]</span>
      </span>
      <span>{post.author.username}</span>
      <span>{post.like_num - post.dislike_num}</span>
      <span>{timeAgoFormat(new Date(), new Date(post.created))}</span>
    </ArticleItem>
  );
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <TopElementWrapperWithoutPadding>
          <SearchForm
            onSubmit={e => {
              e.preventDefault();
              if (info.contents?.basic.name !== search)
                dispatch(
                  infoActions.getInformation({
                    information_name: search,
                  }),
                );
            }}
          >
            <SearchIcon>
              <FontAwesomeIcon icon={faSearch} />
            </SearchIcon>
            <SearchInput
              placeholder="Search keyword"
              value={search}
              onChange={e => setSearch(e.target.value)}
            ></SearchInput>
            <ClearSearchInput
              isActive={search !== ''}
              onClick={() => {
                setSearch('');
              }}
            >
              Clear
            </ClearSearchInput>
          </SearchForm>
        </TopElementWrapperWithoutPadding>

        {info.error === 'NOTFOUND' && <NotFound />}
        {info.error === 'NOTERROR' && (
          <SectionWrapper>
            <SectionItemWrapper>
              <span>1</span>
            </SectionItemWrapper>
            <SectionItemWrapper>
              <span>3</span>
            </SectionItemWrapper>
            <SectionItemWrapper>
              {info.contents?.posts.map(post => (
                <InfoPageArticleItem key={post.post_id} post={post} />
              ))}
            </SectionItemWrapper>
            <SectionItemWrapper>
              <span>4</span>
            </SectionItemWrapper>
          </SectionWrapper>
        )}
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const PostPageWrapper = styled.div`
  background-color: #d7efe3;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const PostContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

const TopElementWrapperWithoutPadding = styled.div`
  margin: 40px 0px 15px 0px;
  width: 100%;
  background-color: #ffffff;
`;

const SectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SearchInput = styled.input`
  width: 95%;
  padding: 15px 20px;
  font-size: 15px;
  border: none;
`;
const ClearSearchInput = styled.span<IPropsSearchClear>`
  width: 5%;
  text-align: center;
  cursor: pointer;
  ${({ isActive }) =>
    !isActive &&
    `
    display: none;
  `}
`;
const SearchIcon = styled(RowCenterFlex)`
  margin-left: 20px;
`;

const SectionItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid black;
  background-color: #ffffff;
`;

export default InformationLobby;
