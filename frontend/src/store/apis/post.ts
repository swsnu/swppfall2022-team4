import client from './client';

export const getPosts = async (payload: getPostsRequestType) => {
  const response = await client.get<getPostsResponseType>(
    `/api/post/?page=${payload.pageNum}&pageSize=${payload.pageSize}`,
  );
  return response.data;
};

export type Post = {
  id: number;
  title: string;
  author_name: string;
  content: string;
  created: string;
  updated: string;
  like_num: number;
  dislike_num: number;
  scrap_num: number;
  comments_num: number;
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

export const createPost = async (payload: createPostRequestType) => {
  const response = await client.post<postIdentifyingRequestType>(`/api/post/`, payload);
  return response.data;
};

export type createPostRequestType = {
  title: string;
  content: string;
  author_name: string;
};

export const getPostDetail = async (payload: postIdentifyingRequestType) => {
  const response = await client.get<getPostsResponseType>(`/api/post/${payload.post_id}/`);
  return response.data;
};

export const deletePost = async (payload: postIdentifyingRequestType) => {
  const response = await client.delete(`/api/post/${payload.post_id}/`);
  return response.data;
};

export const editPost = async (payload: editPostRequestType) => {
  const response = await client.put(`/api/post/${payload.post_id}/`, payload);
  return response.data;
};

export type editPostRequestType = {
  post_id: string;
  title: string;
  content: string;
};

// Used in createPostRequest, deletePostRequest
export type postIdentifyingRequestType = {
  post_id: string;
};
