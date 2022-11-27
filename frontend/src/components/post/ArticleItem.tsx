import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TagBubbleCompact } from 'components/tag/tagbubble';
import { Post } from 'store/apis/post';
import styled from 'styled-components';
import { timeAgoFormat } from 'utils/datetime';

interface IpropsArticleItem {
  post: Post;
  onClick: (e: React.MouseEvent) => void;
}

export const ArticleHeader = () => (
  <ArticleHeaderWrapper>
    <span>대표태그</span>
    <span>제목</span>
    <span>작성자</span>
    <span>추천수</span>
    <span>작성시간</span>
  </ArticleHeaderWrapper>
);

export const ArticleItemDefault = ({ post, onClick }: IpropsArticleItem) => (
  <ArticleItem data-testid="ArticleItem" key={post.post_id} onClick={onClick}>
    {post.prime_tag ? (
      <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
    ) : (
      <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
    )}
    <PostTitle>
      {post.title} {post.has_image && <FontAwesomeIcon icon={faImage} />}{' '}
      <PostItemCommentNum>[{post.comments_num}]</PostItemCommentNum>
    </PostTitle>
    <span>{post.author.nickname}</span>
    <span>{post.like_num - post.dislike_num}</span>
    <span>{timeAgoFormat(new Date(), new Date(post.created))}</span>
  </ArticleItem>
);

export const ArticleItemCompact = ({ post, onClick }: IpropsArticleItem) => (
  <ArticleItemComp data-testid="ArticleItem" key={post.post_id} onClick={onClick}>
    {post.prime_tag ? (
      <TagBubbleCompact color={post.prime_tag.color}>{post.prime_tag.name}</TagBubbleCompact>
    ) : (
      <TagBubbleCompact color={'#dbdbdb'}>None</TagBubbleCompact>
    )}
    <PostTitle>
      {post.title} {post.has_image && <FontAwesomeIcon icon={faImage} />}{' '}
      <PostItemCommentNum>[{post.comments_num}]</PostItemCommentNum>
    </PostTitle>
    <span>{post.author.nickname}</span>
  </ArticleItemComp>
);

const ArticleItemGrid = styled.div`
  display: grid;
  grid-template-columns: 7fr 30fr 10fr 5fr 5fr;
  grid-template-rows: 1fr;
  place-items: center;
`;

const ArticleItemGridCompact = styled.div`
  display: grid;
  grid-template-columns: 7fr 30fr 10fr;
  grid-template-rows: 1fr;
  place-items: center;
`;

const ArticleHeaderWrapper = styled(ArticleItemGrid)`
  padding: 10px 10px 10px 10px;
  height: 35px;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid black;
`;

const ArticleItem = styled(ArticleItemGrid)`
  padding: 10px 10px 10px 10px;
  font-size: 14px;
  width: 100%;
  border-bottom: 0.2px solid var(--fit-support-gray-bright);
  cursor: pointer;
  background-color: #ffffff;
`;

const ArticleItemComp = styled(ArticleItemGridCompact)`
  padding: 8px 10px 8px 10px;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid black;
  cursor: pointer;
`;

const PostTitle = styled.span`
  word-wrap: break-word;
  word-break: break-all;
`;

const PostItemCommentNum = styled.span`
  color: var(--fit-green-text);
`;
