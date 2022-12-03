import { render } from '@testing-library/react';
import { Post } from 'store/apis/post';
import { simpleUserInfo } from 'store/slices/post.test';
import { ArticleHeader, ArticleItemMyPage, ArticleItemCompact, ArticleItemDefault } from './ArticleItem';

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const onClickMock = jest.fn();
const testMockPost: Post[] = [
  {
    post_id: '1',
    author: simpleUserInfo[0],
    title: 'post1',
    content: 'content1',
    created: '2021',
    updated: '2022',
    like_num: 1,
    dislike_num: 2,
    scrap_num: 3,
    comments_num: 4,
    prime_tag: undefined,
    has_image: true,
    tags: [],
  },
];

describe('[ArticleItem Component]', () => {
  test('basic rendering of ArticleItemCompact', () => {
    render(<ArticleItemCompact post={testMockPost[0]} onClick={onClickMock} />);
  });
  test('basic rendering of ArticleItemDefault', () => {
    render(<ArticleItemDefault post={testMockPost[0]} onClick={onClickMock} />);
  });
  test('basic rendering of ArticleItemMyPage', () => {
    render(<ArticleItemMyPage post={testMockPost[0]} onClick={onClickMock} />);
  });
  test('basic rendering of ArticleHeader', () => {
    render(<ArticleHeader />);
  });
});
