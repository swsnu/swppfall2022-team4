import { RootState } from 'index';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from 'store/slices/post';
import { tagActions } from 'store/slices/tag';
import styled from 'styled-components';

interface IPropsSearchClear {
  isActive?: boolean;
}

interface IPropsColorButton {
  color?: string;
}

interface IPropsBtn {
  isActive?: boolean;
  onClick?: () => void;
}

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
  display: grid;
  grid-template-columns: 8fr 2fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 80vh;
`;

export const PostPageLayout = (topElement: JSX.Element, mainElement: JSX.Element, sideElement: JSX.Element) => (
  <PostPageWrapper>
    <PostContentWrapper>
      <TopElementWrapperWithoutPadding>{topElement}</TopElementWrapperWithoutPadding>
      <Main_SideWrapper>
        {mainElement}
        {sideElement}
      </Main_SideWrapper>
    </PostContentWrapper>
  </PostPageWrapper>
);

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: 95%;
  padding: 15px 20px;
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
export const SideBarWrapper = styled.div`
  /* border: 1px solid black; */
  width: 100%;
`;

export const PostPageWithSearchBar = (mainElement: JSX.Element, sideElement: JSX.Element) => {
  const postSearch = useSelector(({ post }: RootState) => post.postSearch);
  const [search, setSearch] = useState(postSearch);
  const dispatch = useDispatch();
  useEffect(() => {
    setSearch(postSearch);
  }, []);
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
            <ClearSearchInput isActive={search !== ''} onClick={() => setSearch('')}>
              Clear
            </ClearSearchInput>
          </SearchForm>
        </TopElementWrapperWithoutPadding>
        <Main_SideWrapper>
          {mainElement}
          {sideElement}
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

export const postEditorLayout = (
  title: string,
  setTitle: (value: React.SetStateAction<string>) => void,
  content: string,
  setContent: (value: React.SetStateAction<string>) => void,
  cancelOnClick: () => void,
  confirmOnClick: () => void,
) => {
  const dispatch = useDispatch();
  const tagList = useSelector((rootState: RootState) => rootState.tag.tagList);
  const [tagInput, setTagInput] = useState('');
  const [tagClassInput, setTagClassInput] = useState('');
  const [selectedTagClassID, setSelectedTagClassID] = useState('');
  const [tagRandColor, setTagRandColor] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagCreating, setTagCreating] = useState(false);
  const [tagUpdate, setTagUpdate] = useState(0);

  useEffect(() => {
    dispatch(tagActions.getTags());
  }, [tagUpdate]);
  useEffect(() => {
    setTagRandColor(getColor());
  }, []);

  const getColor = () => {
    return 'hsl(' + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (75 + 10 * Math.random()) + '%)';
  };

  const DEFAULT_OPTION = '$NONE';
  const NEW_OPTION = '$NEW$';
  const SEARCH_OPTION = '$SEARCH$';

  const tagOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.options[e.target.selectedIndex].value;
    if (newValue === NEW_OPTION) {
      // Show Create Form.
      setTagCreating(true);
    } else {
      setTagCreating(false);
      setSelectedTags(s => {
        if (!s.includes(newValue)) return [...s, newValue];
        else return s;
      });
    }
  };
  const tagNames = () => {
    if (selectedTagClassID === NEW_OPTION) {
      return (
        <div>
          {' '}
          태그 생성하는 컴포넌트.
          <input value={tagClassInput} onChange={e => setTagClassInput(e.target.value)}></input>
          <div>
            태그 색상 지정
            <ColorCircle color={tagRandColor}></ColorCircle>
            <RandColorBtn onClick={() => setTagRandColor(getColor())}>다른 랜덤 색상!</RandColorBtn>
          </div>
          <button
            onClick={() => {
              dispatch(
                tagActions.createTagClass({
                  name: tagClassInput,
                  color: tagRandColor,
                }),
              );
              dispatch(tagActions.getTags());
              setTagClassInput('');
              setTagUpdate(Date.now());
            }}
          >
            분류 생성
          </button>
        </div>
      );
    }
    if (selectedTagClassID === SEARCH_OPTION) {
      return (
        <div>
          {' '}
          태그 검색하는 컴포넌트. <input value={tagInput} onChange={e => setTagInput(e.target.value)}></input>
          <button
            onClick={() => {
              dispatch(
                tagActions.createTag({
                  name: tagInput,
                  classId: '1',
                }),
              );
            }}
          >
            검색
          </button>
        </div>
      );
    }
    const tagTarget = tagList?.filter(tagClass => tagClass.id.toString() === selectedTagClassID);
    if (tagTarget && tagTarget.length > 0) {
      return (
        <TagSubWrapper>
          <select defaultValue={DEFAULT_OPTION} onChange={tagOnChange}>
            <option disabled value={DEFAULT_OPTION}>
              {' '}
              - 태그 이름 -{' '}
            </option>
            {tagList
              ?.filter(tagClass => tagClass.id.toString() === selectedTagClassID)[0]
              .tags.map(tag => {
                return (
                  <option value={tag.id} key={tag.id}>
                    {tag.tag_name}
                  </option>
                );
              })}
            <option value={NEW_OPTION}> - 태그 만들기 - </option>
          </select>
          {tagCreating && (
            <div>
              {' '}
              태그 생성하는 컴포넌트.
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}></input>
              <button
                onClick={() => {
                  dispatch(
                    tagActions.createTag({
                      name: tagInput,
                      classId: selectedTagClassID,
                    }),
                  );
                  dispatch(tagActions.getTags());
                  setTagInput('');
                  setTagUpdate(Date.now());
                }}
              >
                태그 생성
              </button>
            </div>
          )}
        </TagSubWrapper>
      );
    }
  };
  const selectedTagsComponent = () => {
    return selectedTags.map(tags => {
      return <span>{tags}</span>;
    });
  };
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <TopElementWrapperWithoutPadding>
          <TitleInput type="text" placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} />
        </TopElementWrapperWithoutPadding>
        <Main_SideWrapper>
          <ContentWrapper>
            <ContentTextArea placeholder="내용" value={content} onChange={e => setContent(e.target.value)} />
            <CreateBtnWrapper>
              <CancelPostBtn onClick={cancelOnClick}>취소</CancelPostBtn>
              <CreatePostBtn
                onClick={confirmOnClick}
                isActive={title !== '' && content !== ''}
                disabled={title === '' || content === ''}
              >
                완료
              </CreatePostBtn>
            </CreateBtnWrapper>
          </ContentWrapper>
          <SideBarWrapper>
            <TagWrapper key={tagUpdate}>
              <div>태그 설정</div>
              <select
                key={tagUpdate}
                defaultValue={DEFAULT_OPTION}
                onChange={e => setSelectedTagClassID(e.target.options[e.target.selectedIndex].value)}
              >
                <option value={DEFAULT_OPTION} disabled>
                  {' '}
                  - 태그 분류 -{' '}
                </option>
                {tagList?.map(tagClass => {
                  return (
                    <option value={tagClass.id} key={tagClass.id}>
                      {tagClass.class_name}
                    </option>
                  );
                })}
                <option value={SEARCH_OPTION}> - 태그 검색 - </option>
                <option value={NEW_OPTION}> - 태그 분류 만들기 - </option>
              </select>
              {tagNames()}
              {selectedTagsComponent()}
            </TagWrapper>
          </SideBarWrapper>
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const ColorCircle = styled.button<IPropsColorButton>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  ${({ color }) =>
    color &&
    `
    background: ${color};
  `}
`;
const RandColorBtn = styled.button``;
const TagSubWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 50%;
`;
const TitleInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 8px 20px;
  font-size: 28px;
`;
const ContentTextArea = styled.textarea`
  width: 100%;
  height: 90%;
  padding: 16px 30px;
  font-size: 20px;
  resize: none;
`;
const CreateBtnWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 100%;
  height: 10%;
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const CreatePostBtn = styled.button<IPropsBtn>`
  padding: 0px 14px;
  width: 200px;
  height: 30px;
  border-radius: 15px;
  background-color: #dddddd;
  font-size: 15px;
  letter-spacing: 0.5px;
  margin: 5px 20px;

  ${({ isActive }) =>
    isActive &&
    `
    background: #8ee5b9;
    &:hover {
      background-color: #45d9fa;
    }
  `}
`;
const CancelPostBtn = styled.button`
  padding: 0px 14px;
  width: 200px;
  height: 30px;
  border-radius: 15px;
  background-color: #f53333;
  font-size: 15px;
  letter-spacing: 0.5px;
  margin: 5px 20px;
  &:hover {
    background-color: #ff4444;
  }
`;
