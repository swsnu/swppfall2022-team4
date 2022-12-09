import { RoutineTypeInPost } from 'store/slices/workout';
import client from './client';
import { Group } from './group';
import { TagVisual } from './tag';

// Used in createPostRequest, deletePostRequest, getPostComment
export type postIdentifyingType = {
  post_id: string;
};

export const getPosts = async (payload: getPostsRequestType) => {
  let link = `/api/post/?page=${payload.pageNum}&pageSize=${payload.pageSize}`;

  if (payload.searchKeyword) {
    link += `&search=${payload.searchKeyword}`;
  }
  if (payload.tags.length > 0) {
    for (const tag of payload.tags) {
      link += `&tag=${tag.id}`;
    }
  }
  const response = await client.get<getPostsResponseType>(link);
  return response.data;
};
export const getGroupPosts = async (payload: getGroupPostsRequestType) => {
  const link = `/api/group/${payload.group_id}/post/`;
  const response = await client.get(link);
  return response.data;
};
export const getPostsMain = async () => {
  const response = await client.get<getPostsResponseType>(`/api/post/main/hot/`);
  return response.data;
};

export type UserInfo = {
  username: string;
  nickname: string;
  avatar: string;
  level: number;
  exp: number;
};

export type Post = {
  post_id: string;
  author: UserInfo;

  title: string;
  content: string;

  created: string;
  updated: string;

  like_num: number;
  dislike_num: number;
  scrap_num: number;
  comments_num: number;

  prime_tag: TagVisual | undefined;
  has_image: boolean;

  // For detailed
  tags: TagVisual[];
  liked?: boolean;
  disliked?: boolean;
  scraped?: boolean;
  images?: string[];
  routine?: RoutineTypeInPost;
  group?: Group;
};

export type getPostsRequestType = {
  pageNum: number;
  pageSize: number;
  searchKeyword?: string;
  tags: TagVisual[];
};

export type getGroupPostsRequestType = {
  group_id: string;
};

export type getPostsResponseType = {
  page: number;
  page_size: number;
  page_total: number;
  posts: Post[];
};

export const createPost = async (payload: createPostRequestType) => {
  const response = await client.post<postIdentifyingType>(`/api/post/`, payload);
  return response.data;
};

export type createPostRequestType = {
  title: string;
  content: string;
  author_name: string;
  tags: TagVisual[];
  images: string[];
  prime_tag: TagVisual | undefined;
  group_id?: string;
};

export const updatePostDetail = async (payload: postIdentifyingType) => {
  const response = await client.get<Post>(`/api/post/${payload.post_id}/`);
  return response.data;
};

export const deletePost = async (payload: postIdentifyingType) => {
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
  tags: TagVisual[];
  images: string[];
  prime_tag: TagVisual | undefined;
};

export const postFunc = async (payload: postFuncRequestType) => {
  const response = await client.put(`/api/post/${payload.post_id}/func/`, payload);
  return response.data;
};

export type postFuncRequestType = {
  post_id: string;
  func_type: string;
};

export type postSearchRequestType = {
  search_keyword: string;
};

export type filterTagRequestType = TagVisual;
export type removeTagRequestType = string; // id of target tag
