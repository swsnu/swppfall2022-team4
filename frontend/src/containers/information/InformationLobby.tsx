import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
// import { RootState } from 'index';
import { postActions } from 'store/slices/post';
import { rowCenterFlex } from 'components/post/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { timeAgoFormat } from 'utils/datetime';

interface IPropsSearchClear {
  isActive?: boolean;
}

const InformationLobby = () => {
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
        </TopElementWrapperWithoutPadding>
        <SectionWrapper>
          <SectionItemWrapper>
            <span>1</span>
          </SectionItemWrapper>
          <SectionItemWrapper>
            <span>2</span>
          </SectionItemWrapper>
          <SectionItemWrapper>
            <span>3</span>
          </SectionItemWrapper>
          <SectionItemWrapper>
            <span>4</span>
          </SectionItemWrapper>
        </SectionWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

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
  width: 100%;
  background-color: #ffffff;
`;

const SectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;

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
const SearchIcon = styled(rowCenterFlex)`
  margin-left: 20px;
`;

const SectionItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid black;
  background-color: #ffffff;
`;

export default InformationLobby;
