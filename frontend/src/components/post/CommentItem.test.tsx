import { fireEvent, render, screen } from '@testing-library/react';
import { Comment } from 'store/apis/comment';
import { simpleUserInfo } from 'store/slices/post.test';
import { CommentItemHeader, CommentItemMyPage } from './CommentItem';

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const onClickMock = jest.fn();
const testMockComment: Comment = {
  post_id: '1',
  comment_id: '1',
  author: simpleUserInfo[0],
  content: 'content1',
  created: '2021',
  updated: '2022',
  like_num: 1,
  dislike_num: 2,
  parent_comment: null,
  replyActive: true,
  editActive: true,
  liked: true,
  disliked: true,
  post_title: '1234',
};

describe('[CommentItem Component]', () => {
  test('basic rendering of CommentItemHeader', () => {
    render(<CommentItemHeader />);
  });
  test('basic rendering of CommentItemMyPage', () => {
    render(<CommentItemMyPage comment={testMockComment} onClick={onClickMock} />);
    fireEvent.click(screen.getByText('1'));
    expect(onClickMock).toBeCalledTimes(1);
  });
  test('basic rendering of CommentItemMyPage2', () => {
    render(<CommentItemMyPage comment={{ ...testMockComment, parent_comment: 1 }} onClick={onClickMock} />);
  });
  test('basic rendering of CommentItemMyPage3', () => {
    render(<CommentItemMyPage comment={{ ...testMockComment, liked: false, disliked: false }} onClick={onClickMock} />);
  });
});
