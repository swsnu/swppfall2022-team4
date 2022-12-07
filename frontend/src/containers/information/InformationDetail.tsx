/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { infoActions } from 'store/slices/information';
import { RootState } from 'index';
import { useNavigate, useParams } from 'react-router-dom';
import { timeAgoFormat } from 'utils/datetime';
import { Youtube } from 'store/apis/information';
import { ArticleItemCompact } from 'components/post/ArticleItem';
import { ScrollShadow } from 'components/common/ScrollShadow';
import { get_image } from 'components/fitelement/FitElement';
import { BsFillPersonFill } from 'react-icons/bs';
import { TagBubble } from 'components/tag/tagbubble';
import Button4 from 'components/common/buttons/Button4';

interface InfoPageYoutubeIprops {
  youtube: Youtube;
}

const InformationDetail = () => {
  const { name } = useParams<{ name: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info } = useSelector(({ info }: RootState) => ({
    info: info,
  }));
  useEffect(() => {
    if (name)
      dispatch(
        infoActions.getInformation({
          information_name: name,
        }),
      );
  }, []);
  const InfoPageYoutubeItem = ({ youtube }: InfoPageYoutubeIprops) => (
    <a target="_blank" href={`https://www.youtube.com/watch?v=${youtube.video_id}`}>
      <YoutubeItem>
        <img src={youtube.thumbnail} alt="youtube" />
        <YoutubeTitle>{youtube.title}</YoutubeTitle>
        <div>
          <span>{youtube.channel}</span>
          <span>{timeAgoFormat(new Date(), new Date(youtube.published))}</span>
        </div>
      </YoutubeItem>
    </a>
  );
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <InfoDetailHeader>
          <Button4 testId="backBtn" content="" clicked={() => navigate(`/information`)} />
          <img
            src={require(`assets/images/workout_log/fitelement_category/${get_image(
              info.contents?.basic.class_name,
            )}.png`)}
            alt="category"
          />
          <span>{name}</span>
        </InfoDetailHeader>

        {info.error === 'NOTERROR' && (
          <SectionWrapper>
            <SectionSubWrapper>
              <BasicItemWrapper>
                {info.contents?.groups.length !== 0 ? (
                  info.contents?.groups.map((group, index) => (
                    <GroupItemWrapper key={index} onClick={() => navigate(`/group/detail/${group.id}`)}>
                      <GroupName>
                        <span>{group.group_name}</span>
                        {group.prime_tag ? (
                          <TagBubble color={group.prime_tag.color}>{group.prime_tag.name}</TagBubble>
                        ) : (
                          <TagBubble color={'#dbdbdb'}>None</TagBubble>
                        )}
                      </GroupName>
                      <GroupSmallWrapper>
                        <div style={{ display: 'flex' }}>
                          <BsFillPersonFill />
                          <div style={{ fontSize: '15px', fontFamily: 'Noto Sans KR' }}>
                            {group.number
                              ? `멤버 ${group.member_number}명 / ${group.number}명`
                              : `멤버 ${group.member_number}명`}
                          </div>
                        </div>

                        <div style={{ fontSize: '15px', fontFamily: 'Noto Sans KR' }}>
                          {group.start_date ? `${group.start_date} ~ ${group.end_date}` : ``}
                        </div>
                      </GroupSmallWrapper>
                    </GroupItemWrapper>
                  ))
                ) : (
                  <EmptyContent>태그된 그룹이 없습니다.</EmptyContent>
                )}
              </BasicItemWrapper>
              <ArticleItemWrapper>
                {info.contents?.posts.length !== 0 ? (
                  info.contents?.posts.map(post => (
                    <ArticleItemCompact
                      key={post.post_id}
                      post={post}
                      onClick={() => navigate(`/post/${post.post_id}`)}
                    />
                  ))
                ) : (
                  <EmptyContent>태그된 게시물이 없습니다.</EmptyContent>
                )}
              </ArticleItemWrapper>
            </SectionSubWrapper>
            {info.contents?.youtubes.length !== 0 ? (
              <YoutubeItemWrapper>
                {info.contents?.youtubes.map(youtube => (
                  <InfoPageYoutubeItem key={youtube.video_id} youtube={youtube} />
                ))}
              </YoutubeItemWrapper>
            ) : (
              <YoutubeEmptyWrapper>
                <EmptyContent>
                  유튜브 영상이 아직 없어요! <br /> <br /> 잠시 기다리신 후 새로고침해보세요!
                </EmptyContent>
              </YoutubeEmptyWrapper>
            )}
          </SectionWrapper>
        )}
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

const InfoDetailHeader = styled.div`
  margin: 40px 0px 15px 0px;
  padding: 10px 25px;
  border-radius: 20px;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: center;

  > span:first-child {
    margin-top: 3px;
    font-size: 24px;
    cursor: pointer;
  }
  > img {
    max-width: 36px;
    margin-left: 4px;
  }
  > span:last-child {
    margin-left: 12px;
    margin-top: 3px;
    font-size: 24px;
  }
`;

const SectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 70vh;
  /* border-radius: 15px; */
`;

const SectionSubWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  height: 100%;
`;

const BasicItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid var(--fit-support-gray-bright);
  border-radius: 20px;
  background-color: #ffffff;
`;

const ArticleItemWrapper = styled.div`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid var(--fit-support-gray-bright);
  border-radius: 20px;
  background-color: #ffffff;
`;

const YoutubeItemWrapper = styled(ScrollShadow)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  height: 100%;

  width: 100%;
  padding: 15px 10px;
  border: 1px solid var(--fit-support-gray-bright);
  border-radius: 20px;
  background-color: #ffffff;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  @media all and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const YoutubeEmptyWrapper = styled(ScrollShadow)`
  height: 100%;
  width: 100%;
  padding: 15px 10px;
  border: 1px solid var(--fit-support-gray-bright);
  border-radius: 20px;
  background-color: #ffffff;
`;

const YoutubeItem = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  width: 280px;
  height: 210px;
  overflow-x: hidden;

  img {
    width: 256px;
    height: 144px;
    border-radius: 10px;
    margin-bottom: 5px;
    transition: box-shadow 0.25s linear;
  }

  div {
    padding: 8px 10px;
    padding-bottom: 0px;
    width: 100%;
    display: grid;
    grid-template-columns: 7fr 3fr;

    span {
      color: var(--fit-support-gray);
      line-height: 1rem;
      font-weight: 450;
      height: 1rem;
    }
    span:first-child {
      overflow: hidden;
      display: block;
      -webkit-line-clamp: 1;
      display: box;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      white-space: normal;
    }
    span:last-child {
      width: 100%;
      overflow: visible;
      text-align: right;
    }
  }
  &:hover {
    img {
      box-shadow: 1px 1px 2px 2px #909090;
    }
  }
`;

const YoutubeTitle = styled.span`
  width: 100%;
  text-align: left;
  padding: 2px 10px;

  /* for 2 line ellipsis */
  line-height: 1rem;
  font-weight: 450;
  height: 2rem;
  overflow: hidden;
  display: block;
  -webkit-line-clamp: 2;
  display: box;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
`;

const EmptyContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--fit-support-gray);
`;

const GroupItemWrapper = styled.div`
  background-color: #f5fffd;
  width: 100%;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: NanumSquareR;
  border: 1px solid #dbdbdb;
  border-radius: 15px;
  padding: 10px;
  transition: border 0.15s linear;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid #757575;
  }
`;
const GroupName = styled.div`
  width: 100%;
  font-size: 22px;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  display: flex;
  justify-content: center;
  align-items: center;
  > button {
    margin-left: 12px;
  }
`;
const GroupSmallWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  svg {
    color: #2da782;
    margin-right: 3px;
  }
`;

export default InformationDetail;
