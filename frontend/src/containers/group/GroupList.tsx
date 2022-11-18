import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';
import { BsSearch } from 'react-icons/bs';
import styled from 'styled-components';

import Button1 from 'components/common/buttons/Button1';
import Loading from 'components/common/Loading';
import { GroupElement } from 'components/group/GroupElement';

type geolocationResponseType = {
  center: {
    lat: number | null;
    lng: number | null;
  };
  errMsg: string | null;
  isLoading: boolean;
};

type addressNameResponseType = {
  region_type: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  code: string;
  x: number;
  y: number;
};

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const groupList = useSelector((rootState: RootState) => rootState.group.groupList.groups);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentLocation, setCurrentLocation] = useState<geolocationResponseType>({
    center: {
      lat: null,
      lng: null,
    },
    errMsg: null,
    isLoading: true,
  });
  const [currentAddressName, setCurrentAddressName] = useState<string | null>();
  const displayCenterInfo = (result: addressNameResponseType[], status: kakao.maps.services.Status) => {
    if (status === kakao.maps.services.Status.OK) {
      for (let i = 0; i < result.length; i++) {
        if (result[i].region_type === 'H') {
          setCurrentAddressName(result[i].address_name);
          break;
        }
      }
    }
  };

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
        errMsg: 'geolocation을 사용할 수 없습니다.',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (currentLocation.center.lng && currentLocation.center.lat) {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(currentLocation.center.lng, currentLocation.center.lat, displayCenterInfo);
    }
  }, [currentLocation]);

  useEffect(() => {
    dispatch(groupActions.getGroups());
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  if (!groupList) return <Loading />;
  return (
    <Wrapper>
      <SearchWrapper>
        <BsSearch />
        <SearchInput
          placeholder="그룹 검색..."
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
        />
      </SearchWrapper>
      {currentLocation.isLoading && <div>{'위치를 불러오는 중입니다.'}</div>}
      {currentLocation.errMsg && <div>{`${currentLocation.errMsg}`}</div>}
      {currentAddressName && <div>{`유저의 위치는 ${currentAddressName} 입니다`}</div>}
      <Button1 content="지도 보기" clicked={() => navigate('/group/location')} />
      <Button1
        content="Create Group"
        clicked={() => navigate('/group/create')}
        style={{ width: '180px', alignSelf: 'end', marginRight: '10px' }}
      />
      <GroupListWrapper>
        {groupList
          .filter(groupelement => {
            if (searchTerm == '') {
              return groupelement;
            } else {
              return groupelement.group_name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
            }
          })
          .map((groupelement, index) => (
            <GroupElement
              key={index}
              id={groupelement.id}
              group_name={groupelement.group_name}
              number={groupelement.number}
              start_date={groupelement.start_date}
              end_date={groupelement.end_date}
              member_number={groupelement.member_number}
              clicked={() => navigate(`/group/detail/${groupelement.id}/`)}
            />
          ))}
      </GroupListWrapper>
    </Wrapper>
  );
};

export default GroupList;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 50px 0;
`;
const SearchWrapper = styled.div`
  width: 100%;
  height: 45px;
  border-bottom: 2px solid #646464;
  margin-bottom: 25px;
  padding: 5px 10px;
  svg {
    width: 27px;
    height: 27px;
    margin: 0 12px -4px 0;
  }
`;
const SearchInput = styled.input`
  border: none;
  width: calc(100% - 45px);
  font-size: 25px;
  font-family: NanumSquareR;
  margin-bottom: 5px;
`;

const GroupListWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
`;
