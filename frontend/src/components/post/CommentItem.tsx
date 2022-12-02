import { Comment } from 'store/apis/comment';
import styled from 'styled-components';
import {
  CommentContent,
  CommentContentWrapper,
  FuncBtn,
  CommentFuncNumIndicator,
  CommentFuncTimeIndicator,
  FuncType,
  IPropsComment,
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
  <CommentItem key={comment.comment_id} isChild={comment.parent_comment !== null} onClick={onClick}>
    {comment.parent_comment !== null ? (
      <CommentChildIndicator>
        <FontAwesomeIcon icon={faArrowRight} />
      </CommentChildIndicator>
    ) : (
      <div></div>
    )}
    <CommentContentWrapper>
      <CommentContent>{comment.content}</CommentContent>
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

const CommentItem = styled(CommentItemGrid)<IPropsComment>`
  padding: 8px 30px;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid gray;
  cursor: pointer;
  /* ${({ isChild }) =>
    isChild &&
    `
    padding-left: 30px;
  `} */
  background-color: #ffffff;
`;
const CommentChildIndicator = styled.div`
  margin-right: 12px;
`;

const CommentFuncWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
