import client from './client';

export const getPostComment = async (payload: getPostCommentRequestType) => {
  const response = await client.get<getPostCommentResponseType>(`/api/post/${payload.post_id}/comment/`);
  return response.data;
};

export type Comment = {
  id: number;
  author_name: string;
  content: string;
  created: string;
  updated: string;
  like_num: number;
  dislike_num: number;
  parent_comment: number | null;
  replyActive: boolean;
};

export type getPostCommentRequestType = {
  post_id: string;
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
  parent_comment: number;
};
