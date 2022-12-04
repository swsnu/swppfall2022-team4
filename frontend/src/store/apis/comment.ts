import client from './client';
import { postIdentifyingType, UserInfo } from './post';

export type commentIdentifyingRequestType = {
  comment_id: string;
};

export const getPostComment = async (payload: postIdentifyingType) => {
  const response = await client.get<getPostCommentResponseType>(`/api/post/${payload.post_id}/comment/`);
  return response.data;
};

export type Comment = {
  post_id: string;
  comment_id: string;

  author: UserInfo;
  content: string;

  created: string;
  updated: string;

  like_num: number;
  dislike_num: number;

  parent_comment: number | null;

  replyActive?: boolean;
  editActive?: boolean;

  liked?: boolean;
  disliked?: boolean;
  post_title?: string;
};

export type getPostCommentResponseType = {
  comments: Comment[];
};

export const createComment = async (payload: createCommentRequestType) => {
  const response = await client.post(`/api/comment/`, payload);
  return response.data;
};

export type createCommentRequestType = {
  content: string;
  author_name: string;
  post_id: string;
  parent_comment: string;
};

export type createCommentReplyType = {
  parent_comment: string;
};

export const deleteComment = async (payload: commentIdentifyingRequestType) => {
  const response = await client.delete(`/api/comment/${payload.comment_id}/`);
  return response.data;
};

export const editComment = async (payload: editCommentRequestType) => {
  const response = await client.put(`/api/comment/${payload.comment_id}/`, payload);
  return response.data;
};

export type editCommentRequestType = {
  comment_id: string;
  content: string;
};

export const commentFunc = async (payload: commentFuncRequestType) => {
  const response = await client.put(`/api/comment/${payload.comment_id}/func/`, payload);
  return response.data;
};

export type commentFuncRequestType = {
  comment_id: string;
  func_type: string;
};

export const getRecentComments = async () => {
  const response = await client.get(`/api/comment/recent/`);
  return response.data;
};
