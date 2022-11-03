import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postActions } from 'store/slices/post';
import styled from 'styled-components';

const PostPageWrapper = styled.div`
  background-color: #d7efe3;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const PostContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

const TopElementWrapperWithoutPadding = styled.div`
  margin: 40px 0px 15px 0px;
  border: 1px solid black;
  width: 100%;
  background-color: #ffffff;
`;

const Main_SideWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;

const SideBarWrapper = styled.div`
  border: 1px solid black;
  width: 20%;
  background-color: #ffffff;
`;

export const PostPageLayout = (topElement: JSX.Element, mainElement: JSX.Element, sideElement: JSX.Element) => (
  <PostPageWrapper>
    <PostContentWrapper>
      <TopElementWrapperWithoutPadding>{topElement}</TopElementWrapperWithoutPadding>
      <Main_SideWrapper>
        {mainElement}
        <SideBarWrapper>{sideElement}</SideBarWrapper>
      </Main_SideWrapper>
    </PostContentWrapper>
  </PostPageWrapper>
);

const SearchForm = styled.form`
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: none;
`;

export const PostPageWithSearchBar = (mainElement: JSX.Element, sideElement: JSX.Element) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <TopElementWrapperWithoutPadding>
          <SearchForm
            onSubmit={e => {
              e.preventDefault();
              dispatch(
                postActions.postSearch({
                  search_keyword: search,
                }),
              );
            }}
          >
            <SearchInput
              placeholder="Search keyword"
              value={search}
              onChange={e => setSearch(e.target.value)}
            ></SearchInput>
          </SearchForm>
        </TopElementWrapperWithoutPadding>
        <Main_SideWrapper>
          {mainElement}
          <SideBarWrapper>{sideElement}</SideBarWrapper>
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};
