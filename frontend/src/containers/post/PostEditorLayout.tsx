import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { RootState } from 'index';
import { TagVisual } from 'store/apis/tag';
import client from 'store/apis/client';
import { BlueBigActiveBtn, RedBigBtn, RedSmallBtn } from 'components/post/button';
import { ColumnCenterFlex, PostContentWrapper, PostPageWrapper } from 'components/post/layout';
import { notificationSuccess } from 'utils/sendNotification';
import TagSelector from 'components/tag/TagSelector';

interface IPropsCharNum {
  isFull: boolean;
}

const TITLE_CHAR_LIMIT = 60;
const CONTENT_CHAR_LIMIT = 800;
const CONTENT_IMAGE_LIMIT = 5;

const DEFAULT_OPTION = '$NONE$';

export interface PostContent {
  title: string;
  content: string;
  tags: TagVisual[];
  prime_tag: TagVisual | undefined;
  images: string[];
  routine: string;
  group: string;
}

export const initialContent: PostContent = {
  title: '',
  content: '',
  tags: [],
  prime_tag: undefined,
  images: [],
  routine: '',
  group: '',
};

interface IPropsPostEditor {
  postContent: PostContent;
  setPostContent: (value: React.SetStateAction<PostContent>) => void;
  cancelOnClick: () => void;
  confirmOnClick: () => void;
}

export const PostEditorLayout = ({ postContent, setPostContent, cancelOnClick, confirmOnClick }: IPropsPostEditor) => {
  const { tagList, tagSearch, tagCreate, routine, groups } = useSelector(({ tag, workout_log, group }: RootState) => ({
    tagList: tag.tagList,
    tagSearch: tag.tagSearch,
    tagCreate: tag.tagCreate,
    routine: workout_log.routine,
    groups: group.groupList.groups,
  }));

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
  const setRoutines = (routine_value: string) => {
    setPostContent(state => ({
      ...state,
      routine: routine_value,
    }));
  };
  const setGroups = (group_value: string) => {
    setPostContent(state => ({
      ...state,
      group: group_value,
    }));
  };

  // Event Handlers ------------------------------------------------------------------
  const tagOnChange = (tag: TagVisual) => {
    if (postContent.tags.length === 0) setPrimeTag(tag);

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

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const uploadPostImage = async (e: any) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하의 파일만 업로드가 가능합니다.');
      return;
    }
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
              <FileInput
                type="file"
                accept="image/*"
                id="FileInput_PostContent"
                data-testid="postImageUpload"
                onChange={uploadPostImage}
              />
            </ContentImageSection>
            <ContentRoutineSection>
              <SectionTitle>루틴</SectionTitle>
              <select
                data-testid="tagSelect"
                value={postContent.routine}
                onChange={e => {
                  const targetValue = e.target.options[e.target.selectedIndex].value;
                  setRoutines(targetValue !== DEFAULT_OPTION ? targetValue : '');
                }}
              >
                <option value={DEFAULT_OPTION}>- 루틴 선택 안함 -</option>
                {routine.map(rout => {
                  return (
                    rout.id && (
                      <option value={rout.id} key={rout.id}>
                        {rout.name}
                      </option>
                    )
                  );
                })}
              </select>
            </ContentRoutineSection>
            <ContentGroupSection>
              <SectionTitle>그룹</SectionTitle>
              <select
                data-testid="tagSelect"
                value={postContent.group}
                onChange={e => {
                  const targetValue = e.target.options[e.target.selectedIndex].value;
                  setGroups(targetValue !== DEFAULT_OPTION ? targetValue : '');
                }}
              >
                <option value={DEFAULT_OPTION}>- 그룹 선택 안함 -</option>
                {groups &&
                  groups.map(group => {
                    return (
                      group.id && (
                        <option value={group.id} key={group.id}>
                          {group.group_name}
                        </option>
                      )
                    );
                  })}
              </select>
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
          <TagSelector
            tagContent={{
              tags: postContent.tags,
              primeTag: postContent.prime_tag,
              tagList,
              tagSearch,
            }}
            tagOnChange={tagOnChange}
            tagOnRemove={tagOnRemove}
            setPrimeTag={setPrimeTag}
          />
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
