import { tagActions } from 'store/slices/tag';
import { RootState } from 'index';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Main_SideWrapper,
  PostContentWrapper,
  PostPageWrapper,
  SideBarWrapper,
  TopElementWrapperWithoutPadding,
} from './PostLayout';
import { TagClass } from 'store/apis/tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faX } from '@fortawesome/free-solid-svg-icons';
import 'styles/color.css';

interface IPropsColorButton {
  color?: string;
}

interface IPropsBtn {
  isActive?: boolean;
  onClick?: () => void;
}

export interface TagVisual {
  id: string;
  name: string;
  color: string;
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
) => {
  const dispatch = useDispatch();
  const tagList = useSelector((rootState: RootState) => rootState.tag.tagList);

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
          <TagGreenBtn
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
          </TagGreenBtn>
        </TagClassFuncWrapper>
      );
    }
    if (tagClassSelect === SEARCH_OPTION) {
      return (
        <TagClassFuncWrapper>
          <TagInput
            placeholder="키워드"
            value={tagSearchInput}
            onChange={e => setTagSearchInput(e.target.value)}
          ></TagInput>
          <TagGreenBtn
            disabled={tagSearchInput === ''}
            onClick={() => {
              //   dispatch(
              //     tagActions.createTag({
              //       name: tagSearchInput,
              //       classId: '1',
              //     }),
              //   );
            }}
          >
            검색
          </TagGreenBtn>
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
              <TagGreenBtn
                disabled={tagInput === ''}
                onClick={() => {
                  if (currentTagClass)
                    dispatch(
                      tagActions.createTag({
                        name: tagInput,
                        classId: currentTagClass.id.toString(),
                      }),
                    );
                  dispatch(tagActions.getTags());
                  setTagInput('');
                  setTagUpdate(Date.now());
                }}
              >
                생성
              </TagGreenBtn>
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
            {tags.name}
            <TagBubbleFunc onClick={tagOnRemove} data-value={tags.id}>
              <FontAwesomeIcon icon={faX} />
            </TagBubbleFunc>
          </TagBubble>
        );
      })}
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
          <SideBarWrapper>{TagPanel}</SideBarWrapper>
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const TagGreenBtn = styled.button`
  padding: 5px 8px;
  margin: 6px 10px;
  font-size: 14px;
  background-color: var(--fit-green-small-btn1);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  :disabled {
    background-color: var(--fit-disabled-gray);
    cursor: default;
  }
`;

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
    `}/* &:hover ${TagBubbleFunc} {
    visibility: visible;
    width: fit-content;
    height: fit-content;
  } */
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
  background-color: var(--fit-disabled-gray);
  font-size: 15px;
  letter-spacing: 0.5px;
  margin: 5px 20px;

  ${({ isActive }) =>
    isActive &&
    `
      background: var(--fit-green-mid-btn1);
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
