import { tagActions } from 'store/slices/tag';
import { RootState } from 'index';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Main_SideWrapper,
  PostContentWrapper,
  PostPageWrapper,
  SideBarWrapper,
  TopElementWrapperWithoutPadding,
} from './PostLayout';
import { TagClass, TagVisual } from 'store/apis/tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faX } from '@fortawesome/free-solid-svg-icons';
import 'styles/color.css';
import { BlueBigActiveBtn, GreenBigBtn, RedBigBtn } from 'components/post/button';

interface IPropsColorButton {
  color?: string;
}

const DEFAULT_OPTION = '$NONE$';
const NEW_OPTION = '$NEW$';
const SEARCH_OPTION = '$SEARCH$';

export const PostEditorLayout = (
  title: string,
  setTitle: (value: React.SetStateAction<string>) => void,
  content: string,
  setContent: (value: React.SetStateAction<string>) => void,
  cancelOnClick: () => void,
  confirmOnClick: () => void,
  selectedTags: TagVisual[],
  setSelectedTags: (value: React.SetStateAction<TagVisual[]>) => void,
  primeTag: TagVisual | null,
  setPrimeTag: (value: React.SetStateAction<TagVisual | null>) => void,
) => {
  const dispatch = useDispatch();
  const tagList = useSelector((rootState: RootState) => rootState.tag.tagList);
  const tagSearch = useSelector((rootState: RootState) => rootState.tag.tagSearch);
  const tagCreate = useSelector((rootState: RootState) => rootState.tag.tagCreate);

  const [tagInput, setTagInput] = useState(''); // Tag creation name input
  const [tagClassInput, setTagClassInput] = useState(''); // Tag Class creation name input
  const [tagSearchInput, setTagSearchInput] = useState(''); // Tag search input

  const [tagClassSelect, setTagClassSelect] = useState(DEFAULT_OPTION); // Tag Class select value
  const [tagSelect, setTagSelect] = useState(DEFAULT_OPTION); // Tag select value

  const [tagRandColor, setTagRandColor] = useState(''); // Random Color for Tag Class creation
  const [tagUpdate, setTagUpdate] = useState(0);

  const [currentTagClass, setCurrentTagClass] = useState<TagClass | null>(null);

  useEffect(() => {
    dispatch(tagActions.getTags());
  }, [tagUpdate]);
  useEffect(() => {
    setTagRandColor(getRandomColor());
  }, []);
  useEffect(() => {
    if (tagCreate) setSelectedTags(s => [...s, { id: tagCreate?.id, name: tagCreate?.name, color: tagCreate?.color }]);
  }, [tagCreate]);
  const getRandomColor = () => {
    return 'hsl(' + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (75 + 10 * Math.random()) + '%)';
  };

  const tagOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = e.target.options[e.target.selectedIndex].value;
    const tagName = e.target.options[e.target.selectedIndex].text;
    setTagSelect(tagId);
    if (tagId !== NEW_OPTION) {
      setSelectedTags(s => {
        if (currentTagClass && s.filter(item => item.id == tagId).length === 0)
          return [...s, { id: tagId, name: tagName, color: currentTagClass.color }];
        else return s;
      });
      setTagSelect(DEFAULT_OPTION);
    }
  };
  const searchedTagOnClick = (e: React.MouseEvent) => {
    const tagId = e.currentTarget.getAttribute('data-id');
    const tagName = e.currentTarget.getAttribute('data-name');
    const tagColor = e.currentTarget.getAttribute('data-color');

    if (tagId && tagName && tagColor) {
      setSelectedTags(s => {
        if (s.filter(item => item.id == tagId).length === 0)
          return [...s, { id: tagId, name: tagName, color: tagColor }];
        else return s;
      });
    }
  };
  const tagOnRemove = (e: React.MouseEvent) => {
    const tagId = e.currentTarget.getAttribute('data-value');
    setSelectedTags(s => s.filter(item => item.id != tagId));
  };

  const tagNames = () => {
    if (tagClassSelect === NEW_OPTION) {
      return (
        <TagClassFuncWrapper>
          <TagInput
            placeholder="카테고리 이름"
            value={tagClassInput}
            onChange={e => setTagClassInput(e.target.value)}
          ></TagInput>
          <TagClassColorWrapper>
            <TagClassColorLabel>색상:</TagClassColorLabel>
            <ColorCircle color={tagRandColor}></ColorCircle>
            <RandColorBtn onClick={() => setTagRandColor(getRandomColor())}>
              <FontAwesomeIcon size="xl" icon={faDice} />
            </RandColorBtn>
          </TagClassColorWrapper>
          <GreenBigBtn
            disabled={tagClassInput === ''}
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
          </GreenBigBtn>
        </TagClassFuncWrapper>
      );
    }
    if (tagClassSelect === SEARCH_OPTION) {
      return (
        <TagClassFuncWrapper>
          <TagInput placeholder="카테고리" onChange={e => setTagSearchInput(e.target.value)} disabled></TagInput>
          <TagInput
            placeholder="태그 이름"
            value={tagSearchInput}
            onChange={e => setTagSearchInput(e.target.value)}
          ></TagInput>
          <GreenBigBtn
            disabled={tagSearchInput === ''}
            onClick={() => {
              dispatch(
                tagActions.searchTag({
                  class_name: '',
                  tag_name: tagSearchInput,
                }),
              );
            }}
          >
            검색
          </GreenBigBtn>
          {tagSearchInput !== '' && tagSearch && (
            <TagBubbleWrapper>
              {tagSearch.map(tag => {
                return (
                  <TagBubble
                    key={tag.id}
                    color={tag.color}
                    onClick={searchedTagOnClick}
                    data-id={tag.id}
                    data-color={tag.color}
                    data-name={tag.name}
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
    const tagTarget = tagList?.filter(tagClass => tagClass.id === currentTagClass?.id);
    if (tagTarget && tagTarget.length > 0) {
      return (
        <TagSubWrapper>
          <TagSelect value={tagSelect} onChange={tagOnChange}>
            <option disabled value={DEFAULT_OPTION}>
              - 태그 이름 -
            </option>
            {tagList
              ?.filter(tagClass => tagClass.id === currentTagClass?.id)[0]
              .tags.map(tag => {
                return (
                  <option value={tag.id} key={tag.id}>
                    {tag.tag_name}
                  </option>
                );
              })}
            <option value={NEW_OPTION}> - 태그 만들기 - </option>
          </TagSelect>
          {tagSelect === NEW_OPTION && (
            <TagClassFuncWrapper>
              {/* 태그 만들기 */}
              <TagInput value={tagInput} onChange={e => setTagInput(e.target.value)}></TagInput>
              <GreenBigBtn
                disabled={tagInput === ''}
                onClick={() => {
                  if (currentTagClass) {
                    dispatch(
                      tagActions.createTag({
                        name: tagInput,
                        classId: currentTagClass.id.toString(),
                      }),
                    );
                  }
                  dispatch(tagActions.getTags());
                  setTagInput('');
                  setTagUpdate(Date.now());
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
  const selectedTagsComponent = (
    <TagBubbleWrapper>
      {selectedTags.map(tags => {
        return (
          <TagBubble key={tags.id} color={tags.color}>
            <span onClick={() => setPrimeTag(tags)}>{tags.name}</span>
            <TagBubbleFunc onClick={tagOnRemove} data-value={tags.id}>
              <FontAwesomeIcon icon={faX} />
            </TagBubbleFunc>
          </TagBubble>
        );
      })}
    </TagBubbleWrapper>
  );
  const primeTagComponent = (
    <TagBubbleWrapper>
      {primeTag ? <TagBubble color={primeTag.color}>{primeTag.name}</TagBubble> : <span>Not specified</span>}
    </TagBubbleWrapper>
  );
  const TagPanel = (
    <TagWrapper>
      <TagWrapperIn>
        <TagTitle>태그 설정</TagTitle>
        <TagSelect
          key={tagUpdate}
          value={tagClassSelect}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const targetValue = e.target.options[e.target.selectedIndex].value;
            setTagSelect(DEFAULT_OPTION);
            setTagClassSelect(targetValue);
            setTagSearchInput('');
            dispatch(tagActions.searchTagClear());
            setCurrentTagClass(tagList ? tagList.filter(tagClass => tagClass.id.toString() === targetValue)[0] : null);
          }}
        >
          <option value={DEFAULT_OPTION} disabled>
            - 카테고리 -
          </option>
          {tagList?.map(tagClass => {
            return (
              <option value={tagClass.id} key={tagClass.id}>
                {tagClass.class_name}
              </option>
            );
          })}
          <option value={SEARCH_OPTION}> - 태그 검색 - </option>
          <option value={NEW_OPTION}> - 태그 카테고리 생성 - </option>
        </TagSelect>
        {tagNames()}
      </TagWrapperIn>
      {selectedTagsComponent}
    </TagWrapper>
  );
  const PrimeTagPanel = (
    <PrimeTagWrapper>
      <TagWrapperIn>
        <TagTitle>대표 태그</TagTitle>
      </TagWrapperIn>
      {primeTagComponent}
    </PrimeTagWrapper>
  );

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
              <RedBigBtn onClick={cancelOnClick}>취소</RedBigBtn>
              <BlueBigActiveBtn onClick={confirmOnClick} disabled={title === '' || content === ''}>
                완료
              </BlueBigActiveBtn>
            </CreateBtnWrapper>
          </ContentWrapper>
          <SideBarWrapper>
            {TagPanel}
            {PrimeTagPanel}
          </SideBarWrapper>
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const TagClassColorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const TagClassColorLabel = styled.span`
  font-size: 14px;
  text-align: center;
`;
const TagClassFuncWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const TagBubbleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 8px 5px;
`;
const TagBubbleFunc = styled.div`
  margin-left: 5px;
  font-size: 10px;
  color: red;
  width: fit-content;
  height: fit-content;
  display: block;
  cursor: pointer;
`;
const TagBubble = styled.button<IPropsColorButton>`
  height: 25px;
  border-radius: 30px;
  padding: 1px 10px;
  border: none;
  margin: 1px 2px;
  width: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ color }) =>
    color &&
    `
      background: ${color};
    `}
`;
const TagTitle = styled.span`
  margin: 10px 0px;
  font-size: 18px;
  text-align: center;
  width: 100%;
`;
const TagWrapperIn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: var(--fit-white);
`;
const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--fit-white);
  height: 60%;
`;
const PrimeTagWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
const ColorCircle = styled.button<IPropsColorButton>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  margin: 5px 15px;
  ${({ color }) =>
    color &&
    `
      background: ${color};
    `}
`;
const RandColorBtn = styled.button`
  background: none;
  border: none;
  &:active {
    color: var(--fit-green-small-btn1);
  }
`;
const TagSubWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 8px 20px;
  font-size: 24px;
  border: none;
`;
const ContentTextArea = styled.textarea`
  width: 100%;
  height: 90%;
  padding: 16px 30px;
  font-size: 20px;
  resize: none;
  border: none;
`;
const CreateBtnWrapper = styled.div`
  width: 100%;
  height: 10%;
  position: absolute;
  bottom: -5px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
