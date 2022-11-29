/*global kakao*/
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';
import { BsSearch } from 'react-icons/bs';
import styled from 'styled-components';
import { Group } from 'store/apis/group';

import Button1 from 'components/common/buttons/Button1';
import Loading from 'components/common/Loading';
import { GroupElement } from 'components/group/GroupElement';
import { listGeoStateType, co2regionResponseType } from 'assets/types/group';

const distance = (lat1: number | null, lng1: number | null, lat2: number | null, lng2: number | null) => {
  return (((lat1 || 0) - (lat2 || 0)) ^ 2) + (((lng1 || 0) - (lng2 || 0)) ^ 2);
};

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const groupList = useSelector((rootState: RootState) => rootState.group.groupList.groups);

  const [groupListOrdered, setGroupListOrdered] = useState<Group[] | null>(null);
  const [recent, setRecent] = useState<boolean>(true);
  const [old, setOld] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);
  const [mygroup, setMyGroup] = useState<boolean>(false);
  const [freeGroup, setFreeGroup] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLocation, setCurrentLocation] = useState<listGeoStateType>({
    center: {
      lat: null,
      lng: null,
    },
    errMsg: null,
    isLoading: true,
  });
  const [currentAddressName, setCurrentAddressName] = useState<string | null>(null);
  const displayCenterInfo = (result: co2regionResponseType[], status: kakao.maps.services.Status) => {
    if (status === kakao.maps.services.Status.OK) {
      for (const item of result) {
        if (item.region_type === 'H') {
          setCurrentAddressName(item.address_name);
          break;
        }
      }
    }
  };

  useEffect(() => {
    dispatch(groupActions.getGroups());
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  useEffect(() => {
    setGroupListOrdered(groupList);
  }, [groupList]);

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

  const orderRecentClicked = () => {
    if (groupList) {
      const newGroupOrdered: Group[] = [...groupList];
      newGroupOrdered.sort((a, b) => b.id - a.id);
      setGroupListOrdered(newGroupOrdered);
      setRecent(true);
      setOld(false);
      setClose(false);
      setMyGroup(false);
      setFreeGroup(false);
    }
  };

  const orderOldClicked = () => {
    if (groupList) {
      const newGroupOrdered: Group[] = [...groupList];
      newGroupOrdered.sort((a, b) => a.id - b.id);
      setGroupListOrdered(newGroupOrdered);
      setRecent(false);
      setOld(true);
      setClose(false);
      setMyGroup(false);
      setFreeGroup(false);
    }
  };

  const orderCloseClicked = () => {
    if (groupList) {
      const newGroupOrdered: Group[] = [...groupList];
      newGroupOrdered.sort((a, b) => {
        return (
          distance(b.lat, b.lng, currentLocation.center.lat, currentLocation.center.lng) -
          distance(a.lat, a.lng, currentLocation.center.lat, currentLocation.center.lng)
        );
      });
      setGroupListOrdered(newGroupOrdered);
      setRecent(false);
      setOld(false);
      setClose(true);
      setMyGroup(false);
      setFreeGroup(false);
    }
  };

  const freeGroupClicked = () => {
    if (groupList) {
      const newGroupOrdered: Group[] = [...groupList];
      setGroupListOrdered(newGroupOrdered.filter(gr_obj => gr_obj.free));
      setRecent(false);
      setOld(false);
      setClose(false);
      setMyGroup(false);
      setFreeGroup(true);
    }
  };

  const myGroupClicked = () => {
    if (groupList) {
      const newGroupOrdered: Group[] = [...groupList];
      setGroupListOrdered(newGroupOrdered.filter(gr_obj => gr_obj.my_group != 'not_member'));
      setRecent(false);
      setOld(false);
      setClose(false);
      setMyGroup(true);
      setFreeGroup(false);
    }
  };

  if (!groupListOrdered) return <Loading />;
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
      <UnderSearch>
        <div style={{ paddingLeft: '30px' }}>
          {currentLocation.errMsg && <div>{`${currentLocation.errMsg}`}</div>}
          {currentAddressName && <div>{`유저의 위치는 ${currentAddressName} 입니다`}</div>}
        </div>
        <div style={{ display: 'flex', paddingRight: '30px' }}>
          <SortButton onClick={orderRecentClicked} style={recent ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
            최신순
          </SortButton>
          <SortButton onClick={orderOldClicked} style={old ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
            오래된순
          </SortButton>
          <SortButton onClick={orderCloseClicked} style={close ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
            가까운순
          </SortButton>
          <SortButton onClick={freeGroupClicked} style={freeGroup ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
            자유가입
          </SortButton>
          <SortButton onClick={myGroupClicked} style={mygroup ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
            나의그룹
          </SortButton>
        </div>
      </UnderSearch>
      <Button1
        content="Create Group"
        clicked={() => navigate('/group/create')}
        style={{ width: '180px', alignSelf: 'end', marginRight: '10px' }}
      />
      <GroupListWrapper>
        {groupListOrdered
          .filter(groupListOrdered => {
            if (searchTerm == '') {
              return groupListOrdered;
            } else {
              return groupListOrdered.group_name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
            }
          })
          .map((groupListOrdered, index) => (
            <GroupElement
              key={index}
              id={groupListOrdered.id}
              group_name={groupListOrdered.group_name}
              address={groupListOrdered.address}
              number={groupListOrdered.number}
              free={groupListOrdered.free}
              start_date={groupListOrdered.start_date}
              end_date={groupListOrdered.end_date}
              member_number={groupListOrdered.member_number}
              prime_tag={groupListOrdered.prime_tag}
              clicked={() => navigate(`/group/detail/${groupListOrdered.id}/`)}
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

const SortButton = styled.div`
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
`;

const UnderSearch = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
`;
