import { GreenBigBtn } from 'components/post/button';
import { ColumnFlex } from 'components/post/layout';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TagClass, TagVisual } from 'store/apis/tag';
import { tagActions } from 'store/slices/tag';
import styled from 'styled-components';
import { TagBubble, TagBubbleWithFunc, TagBubbleX } from './tagbubble';

const DEFAULT_OPTION = '$NONE$';
const NEW_OPTION = '$NEW$';
const SEARCH_OPTION = '$SEARCH$';

export const TAG_CLASS_LIMIT = 14;
export const TAG_NAME_LIMIT = 12;

interface IPropsCharNum {
  isFull: boolean;
}

export interface TagContent {
  tags: TagVisual[];
  primeTag: TagVisual | undefined;
  tagList: TagClass[] | null;
  tagSearch: TagVisual[] | null;
}

export const initialContent: TagContent = {
  tags: [],
  primeTag: undefined,
  tagList: null,
  tagSearch: null,
};

interface IPropsTagSelector {
  tagContent: TagContent;
  setTagContent?: (value: React.SetStateAction<TagContent>) => void;
  tagOnChange: (tag: TagVisual) => void;
  tagOnRemove: (tagId: string) => void;
  searchedTagOnClick: (tag: TagVisual) => void;
  setPrimeTag: (prime_tag: TagVisual | undefined) => void;
}

export const TagSelector = ({
  tagContent,
  tagOnChange,
  tagOnRemove,
  searchedTagOnClick,
  setPrimeTag,
}: IPropsTagSelector) => {
  const dispatch = useDispatch();

  const [tagInput, setTagInput] = useState(''); // Tag creation name input
  const [tagSearchInput, setTagSearchInput] = useState(''); // Tag search input
  const [tagClassSelect, setTagClassSelect] = useState(DEFAULT_OPTION); // Tag Class select value
  const [tagSelect, setTagSelect] = useState(DEFAULT_OPTION); // Tag select value
  const [currentTagClass, setCurrentTagClass] = useState<TagClass | null>(null);

  const selectedTagsComponent = (
    <TagBubbleWrapper>
      {tagContent.tags.map(tag => {
        return (
          <TagBubbleWithFunc key={tag.id} color={tag.color}>
            <ClickableSpan data-testid={`selectedTag-${tag.id}`} onClick={() => setPrimeTag(tag)}>
              {tag.name}
            </ClickableSpan>
            <TagBubbleX testId="tagBubbleXBtn" onClick={() => tagOnRemove(tag.id)} />
          </TagBubbleWithFunc>
        );
      })}
    </TagBubbleWrapper>
  );
  const primeTagComponent = (
    <PrimeTagDivWrapper>
      {tagContent.primeTag ? (
        <TagBubbleWithFunc color={tagContent.primeTag.color}>
          {tagContent.primeTag.name}
          <TagBubbleX testId="selectedPrimeTagRemove" onClick={() => setPrimeTag(undefined)} />
        </TagBubbleWithFunc>
      ) : (
        <PrimeTagNotSpecified>Not specified</PrimeTagNotSpecified>
      )}
    </PrimeTagDivWrapper>
  );
  const tagOnChangeIn = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = e.target.options[e.target.selectedIndex].value;
    const tagName = e.target.options[e.target.selectedIndex].text;
    if (tagId !== NEW_OPTION && currentTagClass) {
      console.log(tagId, tagName);
      tagOnChange({
        id: tagId,
        name: tagName,
        color: currentTagClass.color,
      });
      setTagSelect(DEFAULT_OPTION);
    } else {
      setTagSelect(tagId);
    }
  };
  const tagNames = () => {
    if (tagClassSelect === SEARCH_OPTION) {
      return (
        <TagClassFuncWrapper>
          <form
            onSubmit={e => {
              e.preventDefault();
              dispatch(
                tagActions.searchTag({
                  class_name: '',
                  tag_name: tagSearchInput,
                }),
              );
            }}
          >
            <TagInput
              placeholder="태그 이름"
              value={tagSearchInput}
              onChange={e => {
                dispatch(tagActions.searchTagClear());
                setTagSearchInput(e.target.value);
              }}
            ></TagInput>
            <GreenBigBtn data-testid="tagSearchBtn" disabled={tagSearchInput === ''}>
              검색
            </GreenBigBtn>
          </form>
          {tagSearchInput !== '' && tagContent.tagSearch && (
            <TagBubbleWrapper>
              {tagContent.tagSearch.map(tag => {
                return (
                  <TagBubble
                    data-testid={`searchedTag-${tag.id}`}
                    key={tag.id}
                    color={tag.color}
                    onClick={() => searchedTagOnClick(tag)}
                  >
                    {tag.name}
                  </TagBubble>
                );
              })}
            </TagBubbleWrapper>
          )}
        </TagClassFuncWrapper>
      );
    }
    const tagTarget = tagContent.tagList?.filter(tagClass => tagClass.id === currentTagClass?.id);
    if (tagTarget && tagTarget.length > 0) {
      return (
        <TagSubWrapper>
          <TagSelect data-testid="tagSelect" value={tagSelect} onChange={tagOnChangeIn}>
            <option disabled value={DEFAULT_OPTION}>
              - 태그 이름 -
            </option>
            {tagContent.tagList
              ?.filter(tagClass => tagClass.id === currentTagClass?.id)[0]
              .tags.map(tag => {
                return (
                  <option value={tag.id} key={tag.id}>
                    {tag.name}
                  </option>
                );
              })}
            {currentTagClass?.class_type !== 'workout' && <option value={NEW_OPTION}> - 태그 만들기 - </option>}
            {currentTagClass?.class_type === 'workout' && <option disabled>[운동] 메인 페이지에서만 생성 가능</option>}
          </TagSelect>
          {tagSelect === NEW_OPTION && (
            <TagClassFuncWrapper>
              {/* 태그 만들기 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TagInput
                  placeholder="생성할 태그 이름"
                  value={tagInput}
                  onChange={e => {
                    const charInput = e.target.value;
                    if (charInput.length <= TAG_NAME_LIMIT) setTagInput(charInput);
                  }}
                ></TagInput>
                <TagCharNum isFull={tagInput.length >= TAG_NAME_LIMIT}>
                  {tagInput.length} / {TAG_NAME_LIMIT}
                </TagCharNum>
              </div>
              <GreenBigBtn
                disabled={tagInput === ''}
                onClick={() => {
                  dispatch(
                    tagActions.createTag({
                      name: tagInput,
                      classId: (currentTagClass as TagClass).id,
                    }),
                  );

                  dispatch(tagActions.getTags());
                  setTagInput('');
                }}
              >
                생성
              </GreenBigBtn>
            </TagClassFuncWrapper>
          )}
        </TagSubWrapper>
      );
    }
  };
  return (
    <div>
      <TagWrapper>
        <TagWrapperIn>
          <TagTitle>태그 설정</TagTitle>
          <TagSelect
            data-testid="tagClassSelect"
            value={tagClassSelect}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const targetValue = e.target.options[e.target.selectedIndex].value;
              setTagSelect(DEFAULT_OPTION);
              setTagClassSelect(targetValue);
              setTagSearchInput('');
              dispatch(tagActions.searchTagClear());
              setCurrentTagClass(
                tagContent.tagList
                  ? tagContent.tagList.filter(tagClass => tagClass.id.toString() === targetValue)[0]
                  : null,
              );
            }}
          >
            <option value={DEFAULT_OPTION} disabled>
              - 카테고리 -
            </option>
            {tagContent.tagList?.map(tagClass => {
              return (
                <option data-testid={`tagClassSelect-${tagClass.id}`} value={tagClass.id} key={tagClass.id}>
                  {tagClass.class_name}
                </option>
              );
            })}
            <option data-testid="tagClassSelect-search" value={SEARCH_OPTION}>
              {' '}
              - 태그 검색 -{' '}
            </option>
          </TagSelect>
          {tagNames()}
        </TagWrapperIn>
        {selectedTagsComponent}
      </TagWrapper>
      <PrimeTagWrapper>
        <TagWrapperIn>
          <TagTitle>대표 태그</TagTitle>
        </TagWrapperIn>
        {primeTagComponent}
      </PrimeTagWrapper>
    </div>
  );
};

const ClickableSpan = styled.div`
  cursor: pointer;
`;

const TagClassFuncWrapper = styled(ColumnFlex)`
  width: 100%;
  > form {
    display: flex;
    flex-direction: column;
    > input {
      width: auto;
    }
    > button {
      width: auto;
    }
  }
`;

const TagBubbleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 8px 5px;
`;

const TagTitle = styled.span`
  margin: 10px 0px;
  font-size: 18px;
  text-align: center;
  width: 100%;
`;

const TagWrapperIn = styled(ColumnFlex)`
  width: 100%;
  justify-content: flex-start;
  background-color: var(--fit-white);
`;

const TagWrapper = styled(ColumnFlex)`
  justify-content: space-between;
  background-color: var(--fit-white);
  width: 100%;
  height: 60%;
  overflow-y: auto;
`;

const PrimeTagDivWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 8px 5px;
`;

const PrimeTagNotSpecified = styled.span`
  text-align: center;
  font-size: 12px;
`;
const PrimeTagWrapper = styled(ColumnFlex)`
  justify-content: space-between;
  background-color: var(--fit-white);
  margin-top: 15px;
  height: fit-content;
`;

const TagInput = styled.input`
  padding: 5px 8px;
  margin: 6px 10px;
`;

const TagSelect = styled.select`
  padding: 5px 8px;
  margin: 6px 10px;
`;

const TagSubWrapper = styled(ColumnFlex)``;

const TagCharNum = styled.span<IPropsCharNum>`
  width: 100%;
  text-align: right;
  padding-right: 10px;
  font-size: 12px;
  color: var(--fit-support-gray);
  ${({ isFull }) =>
    isFull &&
    `
      color: var(--fit-red-neg-hover);
    `}
`;
