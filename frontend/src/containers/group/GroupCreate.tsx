/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import {
  geolocationResponseType,
  coordinateType,
  co2addResponseType,
  keywordSearchResultType,
} from 'assets/types/group';
import { FitelementRequestType } from 'store/apis/group';
import { workoutLogActions } from 'store/slices/workout';
import { PostContentWrapper, PostPageWrapper } from 'components/post/layout';
import { TagVisual } from 'store/apis/tag';
import { tagActions } from 'store/slices/tag';
import { GreenBigBtn, RedBtn } from 'components/post/button';
import TagSelector from 'components/tag/TagSelector';
import { get_image } from 'components/fitelement/FitElement';

interface IPropsCharNum {
  isFull: boolean;
}

const TITLE_CHAR_LIMIT = 20;
const CONTENT_CHAR_LIMIT = 400;

const GroupCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(({ user }: RootState) => user.user);
  const groupCreateStatus = useSelector(({ group }: RootState) => group.groupCreate);
  const fitElementTypes = useSelector((rootState: RootState) => rootState.workout_log.fitelement_types);
  const { tagList, tagSearch } = useSelector(({ tag }: RootState) => ({
    tagList: tag.tagList,
    tagSearch: tag.tagSearch,
    tagCreate: tag.tagCreate,
  }));

  const [group_name, setGroupName] = useState('');
  const [max_num, setMaxNum] = useState(true);
  const [group_num, setGroupNum] = useState(1);
  const [set_date, setSetDate] = useState(true);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [free, setFree] = useState(true);
  // goal
  const [workout_category, setWorkoutCategory] = useState('?????????');
  const [workout_type, setWorkoutType] = useState<string | null>(null);
  const visible_input = workout_category === '????????????' || workout_category === '?????????' ? 'hidden' : 'visible';
  const [weight, setWeight] = useState<number | null>(null);
  const [rep, setRep] = useState<number | null>(null);
  const [set, setSet] = useState<number | null>(null);
  const [wtime, setWTime] = useState<number | null>(null);
  const [goal_list, setGoalList] = useState<FitelementRequestType[]>([]);
  // place
  const [place, setPlace] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<geolocationResponseType>({
    center: {
      lat: 37.480966,
      lng: 126.952317,
    },
    errMsg: null,
    isLoading: true,
  });
  const [clickedPosition, setClickedPosition] = useState<coordinateType>({
    lat: null,
    lng: null,
  });
  const [clickedAddress, setClickedAddress] = useState('');
  const [searchResult, setSearchResult] = useState<keywordSearchResultType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [keyword, setKeyword] = useState('');
  const [markerInfo, setMarkerInfo] = useState<string | null>(null);

  const displayCenterInfo = (result: co2addResponseType[], status: kakao.maps.services.Status) => {
    if (status === kakao.maps.services.Status.OK) {
      setClickedAddress(`${result[0].address.address_name} ${markerInfo || ''}`);
    }
  };

  const createGoal = () => {
    if (workout_category && workout_type && wtime) {
      const goal: FitelementRequestType = {
        type: 'goal',
        category: workout_category,
        workout_type: workout_type,
        weight: weight,
        rep: rep,
        set: set,
        time: wtime,
      };
      setGoalList([...goal_list, goal]);
      setWorkoutCategory('back');
      setWorkoutType(null);
      setWeight(null);
      setRep(null);
      setSet(null);
      setWTime(null);
    } else alert('????????? ?????? ???????????????');
  };

  const removeGoal = (id: number) => {
    const new_list = [...goal_list];
    new_list.splice(id, 1);
    setGoalList(new_list);
  };

  const saveOnClick = () => {
    if (!user) return;
    if (group_name === '') {
      alert('???????????? ????????? ?????????.');
      return;
    } else if (description === '') {
      alert('????????? ?????? ????????? ???????????? ?????????.');
    } else if (set_date && (start_date === '' || end_date === '')) {
      alert('????????? ????????? ?????????.');
      return;
    } else if (set_date && start_date > end_date) {
      alert('????????? ???????????? ????????????.');
      return;
    } else if (goal_list.length === 0) {
      alert('????????? ?????? ??????????????? ?????????.');
      return;
    } else if (place && clickedAddress === '') {
      alert('????????? ?????? ????????? ???????????? ?????????.');
      return;
    }

    const param_num = max_num ? group_num : null;
    const param_start_date = set_date ? start_date : null;
    const param_end_date = set_date ? end_date : null;
    const param_lat = place ? clickedPosition.lat : null;
    const param_lng = place ? clickedPosition.lng : null;
    const param_address = place ? clickedAddress : null;

    dispatch(
      groupActions.createGroup({
        group_name: group_name,
        number: param_num,
        start_date: param_start_date,
        end_date: param_end_date,
        description: description,
        free: free,
        group_leader: user.username,
        lat: param_lat,
        lng: param_lng,
        address: param_address,
        goal: goal_list,
        tags,
        prime_tag: primeTag,
      }),
    );
  };

  useEffect(() => {
    dispatch(workoutLogActions.getFitElementsType());
    dispatch(tagActions.getTags());
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);
  useEffect(() => {
    if (groupCreateStatus.group_id) {
      navigate(`/group/detail/${groupCreateStatus.group_id}`);
    }
  }, [groupCreateStatus.group_id]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation(prev => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        err => {
          setCurrentLocation(prev => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        },
      );
    } else {
      setCurrentLocation(prev => ({
        ...prev,
        errMsg: 'geolocation??? ????????? ??? ????????????.',
        isLoading: false,
      }));
    }
  }, []);
  useEffect(() => {
    if (clickedPosition.lng && clickedPosition.lat) {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2Address(clickedPosition.lng, clickedPosition.lat, displayCenterInfo);
    }
  }, [clickedPosition]);
  useEffect(() => {
    if (!map) return;
    if (keyword === '') {
      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(new kakao.maps.LatLng(currentLocation.center.lat, currentLocation.center.lng));
      map.setBounds(bounds);
    }
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        const psResults = [];
        for (const item of data) {
          psResults.push({
            position: {
              lat: +item.y,
              lng: +item.x,
            },
            content: item.place_name,
          });
          bounds.extend(new kakao.maps.LatLng(+item.y, +item.x));
        }
        setSearchResult(psResults);
        map.setBounds(bounds);
      }
    });
  }, [map, keyword]);

  const fitElementTarget = fitElementTypes.filter(item => item.class_name === workout_category);
  // MODIFIED
  const [tags, setTags] = useState<TagVisual[]>([]);
  const [primeTag, setPrimeTag] = useState<TagVisual>();

  // Event Handlers ------------------------------------------------------------------
  const setSelectedTags = (callback: (sim: TagVisual[]) => TagVisual[]) => {
    setTags(callback(tags));
  };
  const tagOnChange = (tag: TagVisual) => {
    if (tags.length === 0) setPrimeTag(tag);

    setSelectedTags(s => {
      if (s.filter(item => item.id === tag.id).length === 0) return [...s, tag];
      else return s;
    });
  };
  const tagOnRemove = (tagId: string) => {
    setSelectedTags(s => s.filter(item => item.id !== tagId));
    if (primeTag && primeTag.id === tagId) {
      setPrimeTag(undefined);
    }
  };
  return (
    <PostPageWrapper>
      <PostContentWrapper>
        <div></div>
        <MainSideWrapper>
          <ContentWrapper>
            {/* // ------------------------------------------------------------------------------------------------------------------------------ */}
            <CreateWrapper>
              <CreateSectionInline>
                <CreateSectionTitle>?????? ??????</CreateSectionTitle>
                <GroupNameInput
                  type="text"
                  value={group_name}
                  onChange={e => {
                    const charInput = e.target.value;
                    if (charInput.length <= TITLE_CHAR_LIMIT) setGroupName(charInput);
                  }}
                  placeholder="????????? ??????"
                />
                <CharNumIndicator isFull={group_name.length >= TITLE_CHAR_LIMIT}>
                  {group_name.length} / {TITLE_CHAR_LIMIT}
                </CharNumIndicator>
              </CreateSectionInline>
              <CreateSection>
                <CreateSectionTitle>?????? ??????</CreateSectionTitle>
                <CreateSectionBody>
                  <CreateSectionTitleArea
                    rows={10}
                    value={description}
                    onChange={e => {
                      const charInput = e.target.value;
                      if (charInput.length <= CONTENT_CHAR_LIMIT) setDescription(charInput);
                    }}
                    placeholder="????????? ??????"
                  />
                  <ContentNumIndicator isFull={description.length >= CONTENT_CHAR_LIMIT}>
                    {description.length} / {CONTENT_CHAR_LIMIT}
                  </ContentNumIndicator>
                </CreateSectionBody>
              </CreateSection>
              <CreateSectionInline>
                <CreateSectionTitle>
                  <CreateCheck
                    data-testid="maxNumCheck"
                    type="checkbox"
                    checked={max_num}
                    onChange={() => setMaxNum(!max_num)}
                  />
                  ?????? ?????? ??????{' '}
                </CreateSectionTitle>
                <CreateSectionBody>
                  <div style={{ display: 'flex' }}>
                    <GroupNumberInput
                      data-testid="maxNum"
                      type="number"
                      disabled={!max_num}
                      value={group_num}
                      min="1"
                      max="100"
                      onChange={e => setGroupNum(e.target.valueAsNumber)}
                    />
                  </div>
                </CreateSectionBody>
              </CreateSectionInline>
              <CreateSectionInline>
                <CreateSectionTitle>
                  <CreateCheck
                    data-testid="setDate"
                    type="checkbox"
                    checked={set_date}
                    onChange={() => setSetDate(!set_date)}
                  />
                  ?????? ??????
                </CreateSectionTitle>
                <CreateSectionBody>
                  <div style={{ display: 'flex' }}>
                    <DateWrapper>
                      <input
                        data-testid="start_date"
                        type="date"
                        className="input-date"
                        disabled={!set_date}
                        onChange={e => setStartDate(e.target.value)}
                      />
                      <input
                        data-testid="end_date"
                        type="date"
                        className="input-date"
                        disabled={!set_date}
                        onChange={e => setEndDate(e.target.value)}
                      />
                    </DateWrapper>
                  </div>
                </CreateSectionBody>
              </CreateSectionInline>
              <CreateSectionInline>
                <CreateSectionTitle>
                  <CreateCheck data-testid="freeCheck" type="checkbox" checked={free} onChange={() => setFree(!free)} />
                  ?????? ?????? ??????
                </CreateSectionTitle>
              </CreateSectionInline>
              <CreateSection>
                <CreateSectionTitle>??????</CreateSectionTitle>
                <CreateSectionBodyColumn>
                  <GoalGridWrapper className="index">
                    <span></span>
                    <div>WorkoutCategory</div>
                    <div>WorkoutType</div>
                    <div>Weight</div>
                    <div>Rep</div>
                    <div>Set</div>
                    <div>Time</div>
                  </GoalGridWrapper>
                  <GoalGridWrapper>
                    <span></span>
                    <WorkoutTypeSelect
                      data-testid="category"
                      defaultValue="??????"
                      className="type2"
                      onChange={e => setWorkoutCategory(e.target.value)}
                    >
                      <option disabled>??????</option>
                      {fitElementTypes.map((fitelement_category, index) => (
                        <option key={index}>{fitelement_category.class_name}</option>
                      ))}
                    </WorkoutTypeSelect>
                    <WorkoutTypeSelect
                      data-testid="workoutType"
                      defaultValue="?????? ??????"
                      onChange={e => setWorkoutType(e.target.value)}
                    >
                      <option disabled>?????? ??????</option>
                      {fitElementTarget.length === 1 &&
                        fitElementTarget[0].tags.map((fitelement, index) => (
                          <option key={index}>{fitelement.name}</option>
                        ))}
                    </WorkoutTypeSelect>
                    <WorkoutTypeInput
                      data-testid="weight"
                      className="type2"
                      type="number"
                      min="0"
                      disabled={visible_input === 'hidden'}
                      value={weight || ''}
                      onChange={e => setWeight(Number(e.target.value))}
                    />
                    <WorkoutTypeInput
                      data-testid="rep"
                      className="type2"
                      type="number"
                      min="0"
                      disabled={visible_input === 'hidden'}
                      value={rep || ''}
                      onChange={e => setRep(Number(e.target.value))}
                    />
                    <WorkoutTypeInput
                      data-testid="set"
                      className="type2"
                      type="number"
                      min="0"
                      disabled={visible_input === 'hidden'}
                      value={set || ''}
                      onChange={e => setSet(Number(e.target.value))}
                    />
                    <WorkoutTypeInput
                      data-testid="time"
                      className="type2"
                      type="number"
                      min="0"
                      value={wtime || ''}
                      onChange={e => setWTime(Number(e.target.value))}
                    />
                    <GreenBigBtn onClick={createGoal}>??????</GreenBigBtn>
                  </GoalGridWrapper>

                  {goal_list.map((go_obj, index) => (
                    <GoalGridWrapper key={index} className="goals">
                      <span className="type3">{index + 1}</span>
                      <GoalGridImg
                        src={require(`assets/images/workout_log/fitelement_category/${get_image(go_obj.category)}.png`)}
                      />
                      <span className="type">{go_obj.workout_type}</span>
                      <span className="type2">{go_obj.weight}</span>
                      <span>{go_obj.rep}</span>
                      <span>{go_obj.set}</span>
                      <span className="type2">
                        <span>{go_obj.time}</span>
                      </span>

                      <div
                        data-testid="removeGoal"
                        onClick={() => removeGoal(goal_list.indexOf(go_obj))}
                        style={{
                          cursor: 'pointer',
                          color: 'gray',
                        }}
                      >
                        X
                      </div>
                    </GoalGridWrapper>
                  ))}
                </CreateSectionBodyColumn>
              </CreateSection>
              <CreateSection>
                <CreateSectionTitle>
                  <CreateCheck
                    data-testid="placeCheck"
                    type="checkbox"
                    checked={place}
                    onChange={() => setPlace(!place)}
                  />
                  ?????? ?????? ??????{' '}
                </CreateSectionTitle>
                <MapSectionBody>
                  {place && (
                    <>
                      <MapSearchInput
                        type="text"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="?????? ??????"
                      />
                      {clickedAddress && (
                        <div
                          style={{
                            marginTop: '10px',
                            fontFamily: 'Noto Sans KR',
                          }}
                        >{`?????? ????????? ${clickedAddress} ??? ?????????.`}</div>
                      )}
                      <Map // ???????????? ????????? Container
                        center={{
                          lat: currentLocation.center.lat || 37.480966,
                          lng: currentLocation.center.lng || 126.952317,
                        }}
                        style={{
                          marginTop: '10px',
                          width: '80%',
                          height: '350px',
                        }}
                        level={3}
                        onClick={(_t, mouseEvent) => {
                          setClickedPosition({
                            lat: mouseEvent.latLng.getLat(),
                            lng: mouseEvent.latLng.getLng(),
                          });
                          setMarkerInfo(null);
                        }}
                        onCreate={setMap}
                      >
                        <MapMarker
                          position={{
                            lat: currentLocation.center.lat,
                            lng: currentLocation.center.lng,
                          }}
                        />
                        {clickedPosition.lat && clickedPosition.lng && (
                          <MapMarker
                            position={{
                              lat: clickedPosition.lat,
                              lng: clickedPosition.lng,
                            }}
                          />
                        )}
                        {searchResult.map(marker => (
                          <MapMarker
                            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                            position={marker.position}
                            onClick={() => {
                              setMarkerInfo(marker.content);
                              setClickedPosition({
                                lat: marker.position.lat,
                                lng: marker.position.lng,
                              });
                            }}
                          >
                            {markerInfo === marker.content && (
                              <div
                                style={{
                                  fontSize: '13px',
                                  backgroundColor: 'white',
                                  padding: '3px',
                                  textAlign: 'center',
                                  borderRadius: '4px',
                                  fontFamily: 'NanumSquareR',
                                  border: '1px solid',
                                }}
                              >
                                {marker.content}
                              </div>
                            )}
                          </MapMarker>
                        ))}
                      </Map>
                      <div style={{ paddingTop: '15px', fontFamily: 'FugazOne' }}>
                        {currentLocation.errMsg && (
                          <div>{`${'???????????? ???????????? ?????? ????????????????????? ?????? ????????? ?????????.'}`}</div>
                        )}
                        <div style={{ fontFamily: 'Noto Sans KR' }}>
                          {currentLocation.isLoading
                            ? '???????????? ???????????? ????????????.'
                            : '???????????? ??????????????? ???????????????.'}
                        </div>
                      </div>
                    </>
                  )}
                </MapSectionBody>
              </CreateSection>
              <GroupCreateBtn>
                <RedBtn onClick={() => navigate(`/group`)}>Cancel</RedBtn>
                <GreenBigBtn onClick={saveOnClick}>Create</GreenBigBtn>
              </GroupCreateBtn>
            </CreateWrapper>
            {/* // ------------------------------------------------------------------------------------------------------------------------------ */}
          </ContentWrapper>
          <TagSelector
            tagContent={{
              tags,
              primeTag,
              tagList,
              tagSearch,
            }}
            tagOnChange={tagOnChange}
            tagOnRemove={tagOnRemove}
            setPrimeTag={setPrimeTag}
          />
        </MainSideWrapper>
      </PostContentWrapper>
    </PostPageWrapper>
  );
};

const CreateWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: #fafff5;
  border: 1px solid #e1e1e1;
  border-radius: 20px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const CreateSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CreateSectionTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-family: NanumSquareR;
  margin: 10px 0px 10px 40px;
`;

const CreateSectionBody = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  position: relative;
`;
const CreateSectionBodyColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`;
const MapSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
`;

const CreateSectionInline = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
`;

const GoalGridWrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 15fr 15fr 10fr 10fr 10fr 10fr 12fr;
  column-gap: 10px;
  margin-left: 40px;
  place-items: center;

  &.index {
    margin-bottom: 10px;
  }
  &.goals {
    margin-top: 10px;
  }
`;

const GoalGridImg = styled.img`
  max-width: 40px;
`;

const GroupNameInput = styled.input`
  width: 75%;
  font-size: 18px;
  font-family: NanumSquareR;
  text-align: center;
  background-color: transparent;
  border: none;
  border-bottom: 1.8px solid #929292;
  margin-left: 30px;
`;
const GroupNumberInput = styled.input`
  width: 90px;
  font-size: 20px;
  font-family: NanumSquareR;
  text-align: center;
  padding-left: -10px;
  margin: 0;
  background-color: transparent;
  border: none;
  border-bottom: 1.8px solid #929292;
  margin-left: 30px;
`;

const MapSearchInput = styled.input`
  width: 80%;
  font-size: 18px;
  font-family: NanumSquareR;
  text-align: center;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #929292;
  padding-bottom: 0px;
  margin-bottom: 10px;
`;

const CreateCheck = styled.input`
  width: 18px;
  height: 18px;
  margin: 0px 10px 0px -30px;
`;

const DateWrapper = styled.div`
  gap: 4px;
  padding-top: 3px;
  display: flex;
  flex-direction: row;
  font-size: 18px;
  font-family: NanumSquareR;
`;

const CreateSectionTitleArea = styled.textarea`
  width: 100%;
  max-height: 230px;
  margin: 0px 0px 0px 15px;
  padding: 15px;
  font-size: 18px;
  font-family: NanumSquareR;
  border: 2px solid #c5e7cb;
  border-radius: 10px;
  background-color: #ffffff;
  resize: none;
`;

const WorkoutTypeInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 4px 20px;
  font-size: 14px;

  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;
`;

const GroupCreateBtn = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
`;

const WorkoutTypeSelect = styled.select`
  width: 100%;
  height: 100%;
  padding: 4px 10px;
  font-size: 14px;
  margin: 5px;
  margin-top: 7px;
`;

// Layout from PostEditorLayout
const MainSideWrapper = styled.div`
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

const ContentNumIndicator = styled.span<IPropsCharNum>`
  position: absolute;
  right: 22px;
  bottom: 12px;
  color: var(--fit-support-gray);
  ${({ isFull }) =>
    isFull &&
    `
      color: var(--fit-red-neg-hover);
    `}
`;

export default GroupCreate;
