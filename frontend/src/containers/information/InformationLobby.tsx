import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { infoActions } from 'store/slices/information';
import { RootState } from 'index';
import { useNavigate } from 'react-router-dom';
import { tagActions } from 'store/slices/tag';
import { TagBubble } from 'components/tag/tagbubble';
import SearchBar from 'components/common/SearchBar';

const InformationLobby = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info, tagList } = useSelector(({ info, tag }: RootState) => ({
    info: info,
    tagList: tag.tagList,
  }));
  useEffect(() => {
    dispatch(infoActions.initializeInformation());
    dispatch(tagActions.getTags());
  }, []);

  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <TopElementWrapperWithoutPadding>
          <SearchBar
            onSubmit={e => {
              e.preventDefault();
              if (info.contents?.basic.name !== search)
                dispatch(
                  infoActions.getInformation({
                    information_name: search,
                  }),
                );
              navigate(`/information/${search}`);
            }}
            onClear={() => {
              setSearch('');
            }}
            search={search}
            setSearch={setSearch}
          />
        </TopElementWrapperWithoutPadding>

        <SectionWrapper>
          <SectionItemWrapper>
            <span>즐겨찾기</span>
            <br />
            <span>검색기록</span>
          </SectionItemWrapper>
          <SectionItemWrapper>
            <span>운동 태그 목록</span>
            <br />
            {tagList?.map(tagClass => {
              return (
                tagClass.class_type === 'workout' &&
                tagClass.tags.map(tag => {
                  return (
                    <TagBubble
                      style={{ cursor: 'pointer' }}
                      key={tag.id}
                      color={tag.color}
                      onClick={() => navigate(`/information/${tag.name}`)}
                    >
                      {tag.name}
                    </TagBubble>
                  );
                })
              );
            })}
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
  grid-template-rows: 1fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;

const SectionItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid black;
  background-color: #ffffff;
`;

export default InformationLobby;
