import client from './client';

export const getPosts = async (payload: getPostsRequestType) => {
  const response = await client.get<getPostsResponseType>(
    `api/post?page=${payload.pageNum}&pageSize=${payload.pageSize}`,
  );
  return response.data;
};

export type Post = {
  id: number;
  title: string;
  author_id: number;
  content: string;
  created: string;
  updated: string;
  like_num: number;
  dislike_num: number;
  scrap_num: number;
  //   view_num: number;
  comments: number;
};

export type getPostsRequestType = {
  pageNum: number;
  pageSize: number;
};

export type getPostsResponseType = {
  page: number;
  page_size: number;
  page_total: number;
  posts: Post[];
};
