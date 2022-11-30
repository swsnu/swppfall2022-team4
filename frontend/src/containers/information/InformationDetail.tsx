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
    <YoutubeItem
      onClick={() => {
        window.location.href = `https://www.youtube.com/watch?v=${youtube.video_id}`;
      }}
    >
      <img src={youtube.thumbnail} />
      <YoutubeTitle>{youtube.title}</YoutubeTitle>
      <div>
        <span>{youtube.channel}</span>
        <span>{timeAgoFormat(new Date(), new Date(youtube.published))}</span>
      </div>
    </YoutubeItem>
  );
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <InfoDetailHeader>
          <span onClick={() => navigate('/information')}>◀︎</span>
          <img
            src={require(`assets/images/workout_log/fitelement_category/${get_image(
              info.contents?.basic.class_name,
            )}.png`)}
          />
          <span>{name}</span>
        </InfoDetailHeader>

        {info.error === 'NOTERROR' && (
          <SectionWrapper>
            <SectionSubWrapper>
              <BasicItemWrapper>
                <span>Tagged Group</span>
              </BasicItemWrapper>
              <ArticleItemWrapper>
                {info.contents?.posts.map(post => (
                  <ArticleItemCompact
                    key={post.post_id}
                    post={post}
                    onClick={() => navigate(`/post/${post.post_id}`)}
                  />
                ))}
              </ArticleItemWrapper>
            </SectionSubWrapper>
            <YoutubeItemWrapper>
              {info.contents?.youtubes.map(youtube => (
                <InfoPageYoutubeItem key={youtube.video_id} youtube={youtube} />
              ))}
            </YoutubeItemWrapper>
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
    margin-left: 12px;
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

export default InformationDetail;
