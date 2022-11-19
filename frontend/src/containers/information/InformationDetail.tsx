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
import { useNavigate, useParams } from 'react-router-dom';
import { Post } from 'store/apis/post';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { timeAgoFormat } from 'utils/datetime';
import { Youtube } from 'store/apis/information';

interface IPropsSearchClear {
  isActive?: boolean;
}
interface InfoPageArticleIprops {
  post: Post;
}
interface InfoPageYoutubeIprops {
  youtube: Youtube;
}

const InformationDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [search, setSearch] = useState(name ? name : '');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info } = useSelector(({ info }: RootState) => ({
    info: info,
  }));
  useEffect(() => {
    dispatch(
      infoActions.getInformation({
        information_name: search,
      }),
    );
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
  const InfoPageYoutubeItem = ({ youtube }: InfoPageYoutubeIprops) => (
    <YoutubeItem
      onClick={() => {
        window.location.href = `https://www.youtube.com/watch?v=${youtube.video_id}`;
      }}
    >
      <img src={youtube.thumbnail} />
      <YoutubeTitle>{youtube.title}</YoutubeTitle>
      <div>
        <span>{youtube.channel}</span>
        <span>{timeAgoFormat(new Date(), new Date(youtube.published))}</span>
      </div>
    </YoutubeItem>
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
              navigate(`/information/${search}`);
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
            <SectionSubWrapper>
              <BasicItemWrapper>
                <span>1</span>
              </BasicItemWrapper>
              <ArticleItemWrapper>
                {info.contents?.posts.map(post => (
                  <InfoPageArticleItem key={post.post_id} post={post} />
                ))}
              </ArticleItemWrapper>
            </SectionSubWrapper>
            <YoutubeItemWrapper>
              {info.contents?.youtubes.map(youtube => (
                <InfoPageYoutubeItem key={youtube.video_id} youtube={youtube} />
              ))}
            </YoutubeItemWrapper>
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
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;

const SectionSubWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  height: 100%;
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

const BasicItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid black;
  background-color: #ffffff;
`;

const ArticleItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid black;
  background-color: #ffffff;
`;

const YoutubeItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  height: 100%;

  width: 100%;
  padding: 15px 10px;
  border: 1px solid black;
  background-color: #ffffff;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  @media all and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const YoutubeItem = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  width: 280px;
  height: 210px;
  overflow-x: hidden;

  img {
    width: 256px;
    height: 144px;
    border-radius: 10px;
    margin-bottom: 5px;
    transition: box-shadow 0.25s linear;
  }

  div {
    padding: 8px 10px;
    padding-bottom: 0px;
    width: 100%;
    display: grid;
    grid-template-columns: 7fr 3fr;

    span {
      color: var(--fit-support-gray);
      line-height: 1rem;
      font-weight: 450;
      height: 1rem;
    }
    span:first-child {
      overflow: hidden;
      display: block;
      -webkit-line-clamp: 1;
      display: box;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      white-space: normal;
    }
    span:last-child {
      width: 100%;
      overflow: visible;
      text-align: right;
    }
  }
  &:hover {
    img {
      box-shadow: 1px 1px 2px 2px #909090;
    }
  }
`;

const YoutubeTitle = styled.span`
  width: 100%;
  text-align: left;
  padding: 2px 10px;

  /* for 2 line ellipsis */
  line-height: 1rem;
  font-weight: 450;
  height: 2rem;
  overflow: hidden;
  display: block;
  -webkit-line-clamp: 2;
  display: box;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
`;
export default InformationDetail;
