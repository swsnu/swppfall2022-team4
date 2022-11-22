import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faImage } from '@fortawesome/free-solid-svg-icons';
import { RootState } from 'index';
import { TagClass, TagVisual } from 'store/apis/tag';
import { tagActions } from 'store/slices/tag';
import client from 'store/apis/client';
import { BlueBigActiveBtn, GreenBigBtn, RedBigBtn, RedSmallBtn } from 'components/post/button';
import {
  ColumnCenterFlex,
  ColumnFlex,
  PostContentWrapper,
  PostPageWrapper,
  RowCenterFlex,
} from 'components/post/layout';
import { notificationSuccess } from 'utils/sendNotification';
import { TagBubble, TagBubbleWithFunc, TagBubbleX } from 'components/tag/tagbubble';
import { getRandomHex } from 'utils/color';

interface IPropsColorButton {
  color?: string;
}

interface IPropsCharNum {
  isFull: boolean;
}

const DEFAULT_OPTION = '$NONE$';
const NEW_OPTION = '$NEW$';
const SEARCH_OPTION = '$SEARCH$';

const TITLE_CHAR_LIMIT = 60;
const CONTENT_CHAR_LIMIT = 800;
const CONTENT_IMAGE_LIMIT = 5;
export const TAG_CLASS_LIMIT = 14;
export const TAG_NAME_LIMIT = 12;

export interface PostContent {
  title: string;
  content: string;
  tags: TagVisual[];
  prime_tag: TagVisual | undefined;
  images: string[];
}

export const initialContent: PostContent = {
  title: '',
  content: '',
  tags: [],
  prime_tag: undefined,
  images: [],
};

interface IPropsPostEditor {
  postContent: PostContent;
  setPostContent: (value: React.SetStateAction<PostContent>) => void;
  cancelOnClick: () => void;
  confirmOnClick: () => void;
}

export const PostEditorLayout = ({ postContent, setPostContent, cancelOnClick, confirmOnClick }: IPropsPostEditor) => {
  const dispatch = useDispatch();
  const { tagList, tagSearch, tagCreate } = useSelector(({ tag }: RootState) => ({
    tagList: tag.tagList,
    tagSearch: tag.tagSearch,
    tagCreate: tag.tagCreate,
  }));

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
    setTagRandColor(getRandomHex());
  }, []);
  useEffect(() => {
    if (tagCreate) {
      setPostContent(state => ({
        ...state,
        tags: [...state.tags, { id: tagCreate?.id, name: tagCreate?.name, color: tagCreate?.color }],
      }));
    }
  }, [tagCreate]);

  // Setters ------------------------------------------------------------------
  const setContent = (content: string) =>
    setPostContent(state => ({
      ...state,
      content,
    }));
  const setTitle = (title: string) =>
    setPostContent(state => ({
      ...state,
      title,
    }));
  const setSelectedTags = (callback: (sim: TagVisual[]) => TagVisual[]) => {
    const newSelectedTags = callback(postContent.tags);
    setPostContent(state => ({
      ...state,
      tags: newSelectedTags,
    }));
  };
  const setPrimeTag = (prime_tag: TagVisual | undefined) =>
    setPostContent(state => ({
      ...state,
      prime_tag,
    }));
  const addImages = (newImage: string) => {
    setPostContent(state => ({
      ...state,
      images: [...state.images, newImage],
    }));
    notificationSuccess('Image', '이미지 추가에 성공했어요!');
  };
  const removeImages = (targetImage: string) => {
    const removedArray = postContent.images.filter(img => img !== targetImage);
    setPostContent(state => ({
      ...state,
      images: removedArray,
    }));
    notificationSuccess('Image', '이미지 삭제에 성공했어요!');
  };

  // Event Handlers ------------------------------------------------------------------
  const tagOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = e.target.options[e.target.selectedIndex].value;
    const tagName = e.target.options[e.target.selectedIndex].text;
    setTagSelect(tagId);
    if (tagId !== NEW_OPTION && currentTagClass) {
      if (postContent.tags.length === 0) setPrimeTag({ id: tagId, name: tagName, color: currentTagClass.color });
      setSelectedTags(s => {
        if (s.filter(item => item.id == tagId).length === 0)
          return [...s, { id: tagId, name: tagName, color: currentTagClass.color }];
        else return s;
      });

      setTagSelect(DEFAULT_OPTION);
    }
  };
  const searchedTagOnClick = (tag: TagVisual) => {
    setSelectedTags(s => {
      if (s.filter(item => item.id == tag.id).length === 0) return [...s, tag];
      else return s;
    });
  };
  const tagOnRemove = (tagId: string) => {
    setSelectedTags(s => s.filter(item => item.id != tagId));
    if (postContent.prime_tag && postContent.prime_tag.id == tagId) {
      setPrimeTag(undefined);
    }
  };
  const primeTagOnRemove = () => {
    setPrimeTag(undefined);
  };

  const tagNames = () => {
    if (tagClassSelect === NEW_OPTION) {
      return (
        <TagClassFuncWrapper>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TagInput
              placeholder="카테고리 이름"
              value={tagClassInput}
              onChange={e => {
                const charInput = e.target.value;
                if (charInput.length <= TAG_CLASS_LIMIT) setTagClassInput(charInput);
              }}
            ></TagInput>
            <TagCharNum isFull={tagClassInput.length >= TAG_CLASS_LIMIT}>
              {tagClassInput.length} / {TAG_CLASS_LIMIT}
            </TagCharNum>
          </div>
          <TagClassColorWrapper>
            <TagClassColorLabel>색상:</TagClassColorLabel>
            <ColorCircle color={tagRandColor}></ColorCircle>
            <RandColorBtn data-testid="randColorDice" onClick={() => setTagRandColor(getRandomHex())}>
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
          {tagSearchInput !== '' && tagSearch && (
            <TagBubbleWrapper>
              {tagSearch.map(tag => {
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
    const tagTarget = tagList?.filter(tagClass => tagClass.id === currentTagClass?.id);
    if (tagTarget && tagTarget.length > 0) {
      return (
        <TagSubWrapper>
          <TagSelect data-testid="tagSelect" value={tagSelect} onChange={tagOnChange}>
            <option disabled value={DEFAULT_OPTION}>
              - 태그 이름 -
            </option>
            {tagList
              ?.filter(tagClass => tagClass.id === currentTagClass?.id)[0]
              .tags.map(tag => {
                return (
                  <option value={tag.id} key={tag.id}>
                    {tag.name}
                  </option>
                );
              })}
            {currentTagClass?.class_type === 'general' && <option value={NEW_OPTION}> - 태그 만들기 - </option>}
            {currentTagClass?.class_type === 'workout' && <option disabled>[운동] 메인 페이지에서만 생성 가능</option>}
            {currentTagClass?.class_type === 'place' && <option disabled>[장소] 장소 탭에서만 생성 가능</option>}
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
      {postContent.tags.map(tag => {
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
      {postContent.prime_tag ? (
        <TagBubbleWithFunc color={postContent.prime_tag.color}>
          {postContent.prime_tag.name}
          <TagBubbleX testId="selectedPrimeTagRemove" onClick={primeTagOnRemove} />
        </TagBubbleWithFunc>
      ) : (
        <PrimeTagNotSpecified>Not specified</PrimeTagNotSpecified>
      )}
    </PrimeTagDivWrapper>
  );
  const TagPanel = (
    <TagWrapper>
      <TagWrapperIn>
        <TagTitle>태그 설정</TagTitle>
        <TagSelect
          data-testid="tagClassSelect"
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
              <option data-testid={`tagClassSelect-${tagClass.id}`} value={tagClass.id} key={tagClass.id}>
                {tagClass.class_name}
              </option>
            );
          })}
          <option data-testid="tagClassSelect-search" value={SEARCH_OPTION}>
            {' '}
            - 태그 검색 -{' '}
          </option>
          <option data-testid="tagClassSelect-create" value={NEW_OPTION}>
            {' '}
            - 태그 카테고리 생성 -{' '}
          </option>
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

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const uploadPostImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await client.post(process.env.REACT_APP_API_IMAGE_UPLOAD || '', formData);
      addImages(result.data.title);
    } catch (error) {
      alert('이미지 업로드 오류');
    }
  };

  const PostImagePlaceholder = () => (
    <PostImageBtn
      onClick={() => {
        document.getElementById('FileInput_PostContent')?.click();
      }}
    >
      <FontAwesomeIcon icon={faImage} />
      <span>이미지 추가</span>
    </PostImageBtn>
  );

  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <TopElementWrapperWithoutPadding>
          <TitleInput
            type="text"
            placeholder="제목"
            value={postContent.title}
            onChange={e => {
              const charInput = e.target.value;
              if (charInput.length <= TITLE_CHAR_LIMIT) setTitle(charInput);
            }}
          />
          <CharNumIndicator isFull={postContent.title.length >= TITLE_CHAR_LIMIT}>
            {postContent.title.length} / {TITLE_CHAR_LIMIT}
          </CharNumIndicator>
        </TopElementWrapperWithoutPadding>
        <Main_SideWrapper>
          <ContentWrapper>
            <ContentTextWrapper>
              <ContentTextArea
                placeholder="내용"
                value={postContent.content}
                onChange={e => {
                  const charInput = e.target.value;
                  if (charInput.length <= CONTENT_CHAR_LIMIT) setContent(charInput);
                }}
              />
              <ContentCharNum isFull={postContent.content.length >= CONTENT_CHAR_LIMIT}>
                {postContent.content.length} / {CONTENT_CHAR_LIMIT}
              </ContentCharNum>
            </ContentTextWrapper>
            <ContentImageSection>
              {postContent.images.map((img, index) => (
                <PostUploadedImageWrapper key={index}>
                  <PostUploadedImage src={process.env.REACT_APP_API_IMAGE + img} />
                  <RedSmallBtn onClick={() => removeImages(img)}>삭제</RedSmallBtn>
                </PostUploadedImageWrapper>
              ))}
              {postContent.images.length < CONTENT_IMAGE_LIMIT && <PostImagePlaceholder />}
              <ContentCharNum isFull={postContent.images.length >= CONTENT_IMAGE_LIMIT}>
                {postContent.images.length} / {CONTENT_IMAGE_LIMIT}
              </ContentCharNum>
              <FileInput type="file" id="FileInput_PostContent" onChange={uploadPostImage} />
            </ContentImageSection>
            <ContentRoutineSection>
              <SectionTitle>루틴</SectionTitle>
            </ContentRoutineSection>
            <ContentGroupSection>
              <SectionTitle>그룹</SectionTitle>
            </ContentGroupSection>
            <CreateBtnWrapper>
              <RedBigBtn onClick={cancelOnClick}>취소</RedBigBtn>
              <BlueBigActiveBtn
                onClick={confirmOnClick}
                disabled={postContent.title === '' || postContent.content === ''}
              >
                완료
              </BlueBigActiveBtn>
            </CreateBtnWrapper>
          </ContentWrapper>
          <div>
            {TagPanel}
            {PrimeTagPanel}
          </div>
        </Main_SideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const TopElementWrapperWithoutPadding = styled.div`
  margin: 40px 0px 15px 0px;
  width: 100%;
  background-color: var(--fit-white);
  position: relative;
`;

const ClickableSpan = styled.div`
  cursor: pointer;
`;

const TagClassColorWrapper = styled(RowCenterFlex)``;

const TagClassColorLabel = styled.span`
  font-size: 14px;
  text-align: center;
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

const TagSubWrapper = styled(ColumnFlex)``;

const CreateBtnWrapper = styled.div`
  width: 100%;
  height: 10%;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Main_SideWrapper = styled.div`
  display: grid;
  grid-template-columns: 8fr 2fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 800px;
  margin-bottom: 50px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

// Text Content Section
const ContentTextWrapper = styled.div`
  width: 100%;
  height: 60%;
  position: relative;
  border-bottom: 1px solid gray;
`;

const ContentCharNum = styled.span<IPropsCharNum>`
  position: absolute;
  right: 10px;
  bottom: 3px;
  color: var(--fit-support-gray);
  ${({ isFull }) =>
    isFull &&
    `
      color: var(--fit-red-neg-hover);
    `}
`;

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

const TitleInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 8px 30px;
  font-size: 23px;
  border: none;
`;

const CharNumIndicator = styled.span<IPropsCharNum>`
  position: absolute;
  right: 5px;
  bottom: 3px;
  color: var(--fit-support-gray);
  ${({ isFull }) =>
    isFull &&
    `
      color: var(--fit-red-neg-hover);
    `}
`;

const ContentTextArea = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 16px 30px;
  font-size: 20px;
  resize: none;
  border: none;
`;

// Image Content Section
const ContentImageSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  position: relative;
  background-color: var(--fit-white);
  padding: 8px 10px;
  border-bottom: 1px solid gray;
`;

const PostImageBtn = styled(ColumnCenterFlex)`
  justify-content: center;
  width: 130px;
  height: 130px;
  background-color: var(--fit-disabled-gray);
  padding: 10px 10px;
  border-radius: 15px;
  margin: 5px 5px;
  cursor: pointer;
  svg {
    font-size: 32px;
    margin-bottom: 12px;
  }
  &:active {
    background-color: var(--fit-disabled-gray-deep);
  }
`;

const SectionTitle = styled.span`
  width: 100%;
  font-size: 24px;
`;

const PostUploadedImageWrapper = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 15px;
  margin: 5px 5px;
  position: relative;

  button {
    display: none;
  }
  &:hover button {
    display: block;
    width: 60px;
    height: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -30px;
    margin-top: -15px;
  }
`;

const PostUploadedImage = styled.img`
  width: 130px;
  height: 130px;
  background-color: var(--fit-disabled-gray);
  border-radius: 15px;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
`;

// Other Content
const ContentRoutineSection = styled.div`
  width: 100%;
  height: fit-content;
  position: relative;
  background-color: var(--fit-white);
  padding: 8px 10px;
`;
const ContentGroupSection = styled.div`
  width: 100%;
  height: fit-content;
  position: relative;
  background-color: var(--fit-white);
  padding: 8px 10px;
`;
