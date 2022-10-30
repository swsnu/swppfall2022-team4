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

const TopElementWrapperWithPadding = styled.div`
  padding: 20px;
  margin: 40px 0px 15px 0px;
  border: 1px solid black;
  width: 100%;
  background-color: #ffffff;
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
  border: 1px solid black;
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

const SearchBar = <span>Search Bar</span>;
export const PostPageWithSearchBar = (mainElement: JSX.Element, sideElement: JSX.Element) => (
  <PostPageWrapper>
    <PostContentWrapper>
      <TopElementWrapperWithPadding>{SearchBar}</TopElementWrapperWithPadding>
      <Main_SideWrapper>
        {mainElement}
        <SideBarWrapper>{sideElement}</SideBarWrapper>
      </Main_SideWrapper>
    </PostContentWrapper>
  </PostPageWrapper>
);
