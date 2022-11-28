import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { infoActions } from 'store/slices/information';
import { RootState } from 'index';
import { useNavigate } from 'react-router-dom';
import { tagActions } from 'store/slices/tag';
import { TagBubble } from 'components/tag/tagbubble';
import SearchBar from 'components/common/SearchBar';
import { get_image } from 'components/fitelement/FitElement';
import { ScrollShadow } from 'components/common/ScrollShadow';

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
          </SectionItemWrapper>
          <SectionItemWrapper>
            {tagList?.map(tagClass => {
              return (
                tagClass.class_type === 'workout' && (
                  <WorkoutClassWrapper key={tagClass.id}>
                    <WorkoutClassTitleWrapper>
                      <TagClassImg
                        src={require(`assets/images/workout_log/fitelement_category/${get_image(
                          tagClass.class_name,
                        )}.png`)}
                      />
                      <span>{tagClass.class_name}</span>
                    </WorkoutClassTitleWrapper>
                    <WorkoutClassTagWrapper>
                      {tagClass.tags.map(tag => {
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
                      })}
                    </WorkoutClassTagWrapper>
                  </WorkoutClassWrapper>
                )
              );
            })}
          </SectionItemWrapper>
        </SectionWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const PostPageWrapper = styled.div`
  background-color: var(--fit-green-back);
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
  border-radius: 15px;
  background-color: #ffffff;
`;

const TagClassImg = styled.img`
  max-width: 40px;
`;

const SectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 875px;
  max-height: 875px;
`;

const SectionItemWrapper = styled(ScrollShadow)`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid var(--fit-support-gray-bright);
  border-radius: 20px;
  background-color: #ffffff;
  height: 875px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const WorkoutClassWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
const WorkoutClassTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  > span {
    font-size: 22px;
    margin-left: 10px;
  }
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--fit-support-gray-bright);
`;
const WorkoutClassTagWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 5px;
`;
export default InformationLobby;
