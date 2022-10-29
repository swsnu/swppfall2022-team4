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
  parentComment: number;
};

export type getPostCommentRequestType = {
  post_id: string;
};

export type getPostCommentResponseType = {
  comments: Comment[];
};
