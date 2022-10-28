import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { getPostsRequestType } from 'store/apis/post';

const PostMain = () => {
  const dispatch = useDispatch();

  const defaultPageConfig: getPostsRequestType = {
    pageNum: 1,
    pageSize: 10,
  };
  useEffect(() => {
    dispatch(postActions.getPosts(defaultPageConfig));
  }, []);
  const postList = useSelector((rootState: RootState) => rootState.post.posts);
  return (
    <Wrapper>
      <ContentWrapper>
        <span>Hi</span>
        <button onClick={() => dispatch(postActions.getPosts(defaultPageConfig))}>Fetch</button>
        {postList ? (
          postList.map((post, id) => {
            return (
              <div className="articleItem" key={id}>
                <p>{post.title}</p>
                <p>{post.created}</p>
              </div>
            );
          })
        ) : (
          <span></span>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;

const ContentWrapper = styled.div`
  width: 58%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

export default PostMain;
