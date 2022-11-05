import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { GroupElement } from 'components/group/GroupElement';
import { groupActions } from 'store/slices/group';

const GroupCreate = () => {
  const [group_name, setGroupName] = useState('');
  const [max_num, setMaxNum] = useState(true);
  const [group_num, setGroupNum] = useState(0);
  const [set_date, setSetDate] = useState(true);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [free, setFree] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groupCreateStatus = useSelector(({ group }: RootState) => group.groupCreate);

  const example_fit = {
    type: 'goal',
    workout_type: 'TEST TEST',
    category: 'TEST TEST',
    weight: 20,
    rep: 20,
    set: 3,
    time: 2,
  };

  const saveOnClick = () => {
    dispatch(
      groupActions.createGroup({
        group_name: group_name,
        number: group_num,
        start_date: start_date,
        end_date: end_date,
        description: description,
        free: free,
        group_leader: 'testtest',
        goal: [example_fit, example_fit],
      }),
    );
  };

  useEffect(() => {
    if (groupCreateStatus.status) {
      navigate(`/group/detail/${groupCreateStatus.group_id}`);
      dispatch(groupActions.stateRefresh());
    }
  }, [groupCreateStatus]);

  const cancelOnClick = () => {
    navigate('/group');
  };

  const maxnumCheck = () => {
    if (max_num) {
      setGroupNum(0);
    }
    setMaxNum(!max_num);
  };

  const setdateCheck = () => {
    if (set_date) {
      setStartDate('');
      setEndDate('');
    }
    setSetDate(!set_date);
  };

  const freeCheck = () => {
    setFree(!free);
  };

  return (
    <Wrapper>
      <CreateWrapper>
        <input type="text" value={group_name} onChange={e => setGroupName(e.target.value)} />
        <input type="checkbox" checked={max_num} onChange={maxnumCheck} />
        <input
          type="number"
          disabled={!max_num}
          value={group_num}
          max="100"
          onChange={e => setGroupNum(e.target.valueAsNumber)}
        />
        <input type="checkbox" checked={set_date} onChange={setdateCheck} />
        <DateWrapper>
          <input type="date" className="input-date" disabled={!set_date} onChange={e => setStartDate(e.target.value)} />
          <input type="date" className="input-date" disabled={!set_date} onChange={e => setEndDate(e.target.value)} />
        </DateWrapper>
        <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} />
        <input type="checkbox" checked={free} onChange={freeCheck} />
      </CreateWrapper>
      <AnyButton onClick={saveOnClick}>저장</AnyButton>
      <AnyButton onClick={cancelOnClick}>취소</AnyButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const CreateWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 40%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
`;

const DateWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 40%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
`;

const AnyButton = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border-radius: 15px;
  font-size: 10px;
  cursor: pointer;
`;

export default GroupCreate;
