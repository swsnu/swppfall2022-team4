import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';

import Button1 from 'components/common/buttons/Button1';
import Button4 from 'components/common/buttons/Button4';

const GroupCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(({ user }: RootState) => user.user);
  const groupCreateStatus = useSelector(({ group }: RootState) => group.groupCreate);

  const [group_name, setGroupName] = useState('');
  const [max_num, setMaxNum] = useState(true);
  const [group_num, setGroupNum] = useState(0);
  const [set_date, setSetDate] = useState(true);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [free, setFree] = useState(true);

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
    if (!user) return;
    if (group_name === '') {
      alert('그룹명을 입력해 주세요.');
      return;
    } else if (max_num && group_num < 2) {
      alert('최대 인원은 2 이상이어야 합니다.');
      return;
    } else if (set_date && (start_date === '' || end_date === '')) {
      alert('기간을 설정해 주세요.');
      return;
    } else if (set_date && start_date > end_date) {
      alert('기간이 올바르지 않습니다.');
      return;
    } else if (description === '') {
      alert('그룹에 대한 설명을 작성해야 합니다.');
      return;
    }

    const param_num = max_num ? group_num : null;
    const param_start_date = set_date ? start_date : null;
    const param_end_date = set_date ? end_date : null;

    dispatch(
      groupActions.createGroup({
        group_name: group_name,
        number: param_num,
        start_date: param_start_date,
        end_date: param_end_date,
        description: description,
        free: free,
        group_leader: user.username,
        goal: [example_fit, example_fit],
      }),
    );
  };

  useEffect(() => {
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);
  useEffect(() => {
    if (groupCreateStatus.group_id) {
      navigate(`/group/detail/${groupCreateStatus.group_id}`);
    }
  }, [groupCreateStatus.group_id]);

  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="Back" clicked={() => navigate(`/group`)} />
        <Title>그룹 생성</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>

      <CreateWrapper>
        <CreateText style={{ marginTop: '10px' }}>그룹명</CreateText>
        <CreateInput
          type="text"
          value={group_name}
          onChange={e => setGroupName(e.target.value)}
          placeholder="그룹의 이름"
        />

        <CreateText>최대 인원</CreateText>
        <div style={{ display: 'flex' }}>
          <CreateSmallText>최대 인원 설정</CreateSmallText>
          <CreateCheck type="checkbox" checked={max_num} onChange={() => setMaxNum(!max_num)} />
          <CreateInput
            type="number"
            disabled={!max_num}
            value={group_num}
            max="100"
            onChange={e => setGroupNum(e.target.valueAsNumber)}
            style={{ width: '90px' }}
          />
        </div>

        <CreateText>기간</CreateText>
        <div style={{ display: 'flex' }}>
          <CreateSmallText>기간 설정</CreateSmallText>
          <CreateCheck type="checkbox" checked={set_date} onChange={() => setSetDate(!set_date)} />
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

        <CreateText>그룹 설명</CreateText>
        <CreateTextArea
          rows={10}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="그룹의 설명"
        />

        <CreateText>그룹 공개 설정</CreateText>
        <CreateCheck type="checkbox" checked={free} onChange={() => setFree(!free)} />
      </CreateWrapper>

      <Button1 content="Create" clicked={saveOnClick} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 50px 20px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  padding: 0 20px;

  @media all and (max-width: 560px) {
    margin: 40px 0 20px 0;
  }
`;
const Title = styled.div`
  margin-top: 20px;
  font-size: 45px;
  font-family: NanumSquareR;

  @media all and (max-width: 560px) {
    display: none;
  }
`;

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
const CreateText = styled.div`
  font-size: 21px;
  font-weight: 600;
  font-family: NanumSquareR;
  margin-top: 40px;
  margin-bottom: 15px;
`;
const CreateInput = styled.input`
  width: 240px;
  height: 36px;
  font-size: 21px;
  font-family: NanumSquareR;
  text-align: center;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #929292;
  padding-bottom: 10px;
  margin: 15px 0;
`;
const CreateSmallText = styled.div`
  height: 66px;
  padding-top: 18px;
  font-size: 18px;
  font-family: NanumSquareR;
  margin-right: 10px;
`;
const CreateCheck = styled.input`
  width: 24px;
  height: 24px;
  margin: 15px 10px 15px 0;
`;
const DateWrapper = styled.div`
  height: 66px;
  gap: 4px;
  padding-top: 3px;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-family: NanumSquareR;
`;
const CreateTextArea = styled.textarea`
  width: 100%;
  max-width: 600px;
  padding: 15px;
  font-size: 18px;
  font-family: NanumSquareR;
  border: 3px solid #c5e7cb;
  border-radius: 10px;
  background-color: #ffffff;
  resize: none;
`;

export default GroupCreate;
