import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { ColumnCenterFlex, RowCenterFlex } from 'components/post/layout';
import { useNavigate } from 'react-router-dom';

interface IPropsSearchClear {
  isActive?: boolean;
}

export const PostDetailLayout = (mainElement: JSX.Element, sideElement: JSX.Element) => {
  const postSearch = useSelector(({ post }: RootState) => post.postSearch);
  const [search, setSearch] = useState(postSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setSearch(postSearch);
  }, []);
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <TopWrapper>
          <SearchForm
            onSubmit={e => {
              e.preventDefault();
              navigate(`/post`);
              dispatch(
                postActions.postSearch({
                  search_keyword: search,
                }),
              );
            }}
          >
            <SearchIcon>
              <FontAwesomeIcon icon={faSearch} />
            </SearchIcon>
            <SearchInput
              placeholder="Search keyword"
              value={search}
              onChange={e => setSearch(e.target.value)}
            ></SearchInput>
            <ClearSearchInput
              isActive={search !== ''}
              onClick={() => {
                setSearch('');
                dispatch(
                  postActions.postSearch({
                    search_keyword: '',
                  }),
                );
              }}
            >
              Clear
            </ClearSearchInput>
          </SearchForm>
        </TopWrapper>
        <Main_SideWrapper>
          {mainElement}
          {sideElement}
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SearchInput = styled.input`
  width: 95%;
  padding: 15px 20px;
  font-size: 15px;
  border: none;
`;

const ClearSearchInput = styled.span<IPropsSearchClear>`
  width: 5%;
  text-align: center;
  cursor: pointer;
  ${({ isActive }) =>
    !isActive &&
    `
    display: none;
  `}
`;

const SearchIcon = styled(RowCenterFlex)`
  margin-left: 20px;
`;

export const PostPageWrapper = styled(ColumnCenterFlex)`
  background-color: var(--fit-green-back);
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
`;

export const PostContentWrapper = styled(ColumnCenterFlex)`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

export const TopWrapper = styled.div`
  margin: 40px 0px 15px 0px;
  width: 100%;
  background-color: var(--fit-white);
`;

export const Main_SideWrapper = styled.div`
  display: grid;
  grid-template-columns: 8fr 2fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  height: 80vh;
  min-height: 640px;
  margin-bottom: 50px;
`;

export const SideBarWrapper = styled.div`
  width: 100%;
`;
