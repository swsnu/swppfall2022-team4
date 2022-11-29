import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { RowCenterFlex } from '../post/layout';

interface IPropsSearchClear {
  isActive?: boolean;
}

interface IPropsSearchBar {
  onSubmit: (e: React.FormEvent) => void;
  onClear: (e: React.MouseEvent) => void;
  search: string;
  setSearch: (value: React.SetStateAction<string>) => void;
}

const SearchBar = ({ onSubmit, onClear, search, setSearch }: IPropsSearchBar) => (
  <SearchForm onSubmit={onSubmit}>
    <SearchIcon>
      <FontAwesomeIcon icon={faSearch} />
    </SearchIcon>
    <SearchInput placeholder="Search keyword" value={search} onChange={e => setSearch(e.target.value)} />
    <ClearSearchInput isActive={search !== ''} onClick={onClear}>
      Clear
    </ClearSearchInput>
  </SearchForm>
);

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 14px;
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

export default SearchBar;
