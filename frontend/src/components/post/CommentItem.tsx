import { Comment } from 'store/apis/comment';
import styled from 'styled-components';
import {
  CommentContentWrapper,
  FuncBtn,
  CommentFuncNumIndicator,
  CommentFuncTimeIndicator,
  FuncType,
} from 'containers/post/PostDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { timeAgoFormat } from 'utils/datetime';

interface IpropsCommentItem {
  comment: Comment;
  onClick: (e: React.MouseEvent) => void;
}

export const CommentItemHeader = () => (
  <CommentHeaderWrapper>
    <div></div>
    <span>댓글 내용</span>
    <span>추천 여부</span>
    <span>작성시간</span>
  </CommentHeaderWrapper>
);

export const CommentItemMyPage = ({ comment, onClick }: IpropsCommentItem) => (
  <CommentItem key={comment.comment_id} onClick={onClick}>
    {comment.parent_comment !== null ? (
      <CommentChildIndicator>
        <FontAwesomeIcon icon={faArrowRight} />
      </CommentChildIndicator>
    ) : (
      <div></div>
    )}
    <CommentContentWrapper>
      <CommentContent>
        <span>{comment.content}</span>
        {comment.parent_comment !== null ? (
          <span>'{comment.post_title}' 제목의 글에 작성한 답글이에요.</span>
        ) : (
          <span>'{comment.post_title}' 제목의 글에 작성한 댓글이에요.</span>
        )}
      </CommentContent>
    </CommentContentWrapper>
    <CommentFuncWrapper>
      <FuncBtn color={comment.liked ? FuncType.Like : FuncType.None}>
        <FontAwesomeIcon icon={faThumbsUp} />
      </FuncBtn>
      <CommentFuncNumIndicator>{comment.like_num}</CommentFuncNumIndicator>
      <FuncBtn color={comment.disliked ? FuncType.Dislike : FuncType.None}>
        <FontAwesomeIcon icon={faThumbsDown} />
      </FuncBtn>
      <CommentFuncNumIndicator>{comment.dislike_num}</CommentFuncNumIndicator>
    </CommentFuncWrapper>
    <CommentFuncTimeIndicator> {timeAgoFormat(new Date(), new Date(comment.created))} </CommentFuncTimeIndicator>
  </CommentItem>
);

const CommentItemGrid = styled.div`
  display: grid;
  grid-template-columns: 5fr 80fr 20fr 20fr;
  grid-template-rows: 1fr;
  place-items: center;
`;

const CommentHeaderWrapper = styled(CommentItemGrid)`
  padding: 10px 10px 10px 10px;
  height: 35px;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid black;
`;

const CommentItem = styled(CommentItemGrid)`
  padding: 8px 30px;
  font-size: 12px;
  width: 100%;
  border-bottom: 1px solid gray;
  cursor: pointer;
  background-color: #ffffff;
`;

const CommentContent = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > span:last-child {
    font-size: 10px;
    width: 100%;
    color: var(--fit-support-gray);
    margin-top: 5px;
  }
`;

const CommentChildIndicator = styled.div`
  margin-right: 12px;
`;

const CommentFuncWrapper = styled.div`
  width: 40%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;
