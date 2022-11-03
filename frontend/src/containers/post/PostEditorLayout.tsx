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

interface IPropsColorButton {
  color?: string;
}

interface IPropsBtn {
  isActive?: boolean;
  onClick?: () => void;
}

interface TagVisual {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_OPTION = '$NONE$';
const NEW_OPTION = '$NEW$';
const SEARCH_OPTION = '$SEARCH$';

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
  const [tagRandColor, setTagRandColor] = useState('');
  const [tagCreating, setTagCreating] = useState(false);
  const [tagUpdate, setTagUpdate] = useState(0);

  const [currentTagClass, setCurrentTagClass] = useState<TagClass | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagVisual[]>([]);

  const [tagClassSelect, setTagClassSelect] = useState(DEFAULT_OPTION);
  const [tagSelect, setTagSelect] = useState(DEFAULT_OPTION);
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
    const newValue = e.target.options[e.target.selectedIndex].value;
    setTagSelect(newValue);
    if (newValue === NEW_OPTION) {
      setTagCreating(true); // Show Create Form.
    } else {
      setTagCreating(false);
      setSelectedTags(s => {
        if (
          currentTagClass &&
          !s.includes({
            id: newValue,
            name: e.target.options[e.target.selectedIndex].text,
            color: currentTagClass.color,
          })
        )
          return [
            ...s,
            { id: newValue, name: e.target.options[e.target.selectedIndex].text, color: currentTagClass.color },
          ];
        else return s;
      });
      setTagSelect(DEFAULT_OPTION);
    }
  };
  const tagNames = () => {
    if (tagClassSelect === NEW_OPTION) {
      return (
        <div>
          {' '}
          태그 생성하는 컴포넌트.
          <input value={tagClassInput} onChange={e => setTagClassInput(e.target.value)}></input>
          <div>
            태그 색상 지정
            <ColorCircle color={tagRandColor}></ColorCircle>
            <RandColorBtn onClick={() => setTagRandColor(getRandomColor())}>다른 랜덤 색상!</RandColorBtn>
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
    if (tagClassSelect === SEARCH_OPTION) {
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
    const tagTarget = tagList?.filter(tagClass => tagClass.id === currentTagClass?.id);
    if (tagTarget && tagTarget.length > 0) {
      return (
        <TagSubWrapper>
          <TagSelect value={tagSelect} onChange={tagOnChange}>
            <option disabled value={DEFAULT_OPTION}>
              {' '}
              - 태그 이름 -{' '}
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
          {tagCreating && (
            <div>
              {' '}
              태그 생성하는 컴포넌트.
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}></input>
              <button
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
                태그 생성
              </button>
            </div>
          )}
        </TagSubWrapper>
      );
    }
  };
  const selectedTagsComponent = () => {
    return (
      <TagBubbleWrapper>
        {selectedTags.map(tags => {
          return (
            <TagBubble key={tags.id} color={tags.color}>
              {tags.name}
            </TagBubble>
          );
        })}
      </TagBubbleWrapper>
    );
  };

  const TagPanel = (
    <TagWrapper>
      <TagWrapper>
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
        </TagSelect>
        {tagNames()}
      </TagWrapper>
      {selectedTagsComponent()}
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

const TagBubbleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;
const TagBubble = styled.button<IPropsColorButton>`
  height: 25px;
  border-radius: 30px;
  padding: 1px 10px;
  border: none;
  margin: 1px 2px;
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
const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 50%;
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
