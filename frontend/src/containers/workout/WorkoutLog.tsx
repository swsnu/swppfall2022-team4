import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import styled from 'styled-components';
import { RootState } from 'index';
import { FitElement } from 'components/fitelement/FitElement';
import { RedSmallBtn } from 'components/post/button';
import { Hover } from 'components/fitelement/Hover';
import { Fitelement, workoutLogActions } from 'store/slices/workout';
import { userActions } from 'store/slices/user';
import ImageDetailModal from 'components/post/ImageDetailModal';
import { notificationSuccess } from 'utils/sendNotification';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  getDailyLogRequestType,
  createWorkoutLogRequestType,
  editMemoRequestType,
  addFitElementsRequestType,
  createRoutineWithFitElementsRequestType,
  editImageRequestType,
  deleteImageRequestType,
  editIndexRequestType,
} from 'store/apis/workout';
import client from 'store/apis/client';

const CONTENT_IMAGE_LIMIT = 3;

const WorkoutLog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));
  const [selected_year, setSelectedYear] = useState(date.getFullYear());
  const [selected_month, setSelectedMonth] = useState(date.getMonth());
  const [selected_date, setSelectedDay] = useState(date.getDate());
  const [workout_type, setWorkoutType] = useState('');
  const [rep, setRep] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [set, setSet] = useState<number | null>(null);
  const [workout_time, setWorkoutTime] = useState<number | null>(null);
  const [workout_category, setWorkoutCategory] = useState('');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [workout_period, setWorkoutPeriod] = useState<number | null>(null);
  const [memo_write_mode, setMemoWriteMode] = useState<boolean>(false);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<string[] | null>(['default-upload-image.png']);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [copy_date, setCopyDate] = useState<Date>(new Date());
  const [copied_fitelements, setCopiedFitElements] = useState<number[]>([]);
  const user = useSelector(({ user }: RootState) => user);
  const imageModalRef = useRef(null);
  const imageModalAnimRef = useRef(null);
  const [activeImage, setActiveImage] = useState('');

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const imageModalOnClose = () => setImageModalOpen(false);
  useOnClickOutside(imageModalRef, imageModalOnClose, 'mousedown');

  function getStartDayOfMonth(date: Date) {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let selected_day = 0;
    if (day < 7) {
      selected_day = day + 1;
    } else {
      selected_day = 0; // 일요일
    }
    return selected_day;
  }

  const defaultDailyLogConfig: getDailyLogRequestType = {
    year: year,
    month: month + 1,
    specific_date: day,
    username: user.user?.username!,
    data: {
      username: user.user?.username!,
    },
  };

  const clickDate = (year: number, month: number, d: number) => {
    setDate(new Date(year, month, d));
    setSelectedYear(year);
    setSelectedDay(d);
    setSelectedMonth(month);
    const dailyLogConfig: getDailyLogRequestType = {
      year: year,
      month: month + 1,
      specific_date: d,
      username: user.user?.username!,
      data: {
        username: user.user?.username!,
      },
    };
    dispatch(workoutLogActions.getDailyLog(dailyLogConfig));
  };

  const routineClick = () => {
    // TODO: edit 도중 나가는 이벤트
    navigate('/routine');
  };

  const createWorkoutLog = () => {
    if (workout_type === '') {
      alert('운동종류를 입력해주세요.');
    } else if (workout_time === null || workout_time < 0) {
      alert('시간을 입력해야 해요.');
    } else {
      const newLogConfig: createWorkoutLogRequestType = {
        username: user.user?.username!,
        type: 'log',
        workout_type: workout_type,
        period: workout_period,
        category: workout_category,
        weight: weight,
        rep: rep,
        set: set === 0 ? null : set,
        time: workout_time,
        date: String(year) + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0'),
      };
      dispatch(workoutLogActions.createWorkoutLog(newLogConfig));
      cancelWorkoutLog();
    }
  };

  const copyDailyLog = () => {
    if (dailyLog.isDailyLog === true && dailyFitElements.length > 0) {
      setIsCopy(true);
      setCopyDate(new Date(year, month, day));
      setCopiedFitElements(
        dailyFitElements.map(v => {
          return Number(v.data.id);
        }),
      );
    }
  };

  const addRoutineClick = () => {
    if (dailyLog.isDailyLog === true && dailyFitElements.length > 0) {
      const fitelements_id_list = dailyFitElements.map(v => {
        return Number(v.data.id);
      });
      const createRoutineConfig: createRoutineWithFitElementsRequestType = {
        username: user.user?.username!,
        fitelements: fitelements_id_list,
      };
      dispatch(workoutLogActions.createRoutineWithFitElements(createRoutineConfig));

      navigate('/routine');
    }
  };

  const pasteDailyLog = () => {
    setIsCopy(false);

    const addFitElementConfig: addFitElementsRequestType = {
      username: user.user?.username!,
      fitelements: copied_fitelements,
      year: year,
      month: month + 1,
      specific_date: day,
    };
    dispatch(workoutLogActions.addFitElements(addFitElementConfig));
  };

  const cancelWorkoutLog = () => {
    setWorkoutCategory('');
    setWorkoutType('');
    setWeight(null);
    setRep(null);
    setSet(null);
    setWorkoutTime(null);
  };

  const memoOnClick = (click_type: string) => {
    if ((memo_write_mode === false && click_type !== 'complete_button') || click_type === 'edit_button') {
      setMemoWriteMode(true);
    } else if (click_type === 'cancel_button') {
      setMemo(dailyLog.memo || '');
      setMemoWriteMode(false);
    } else {
      const editMemoConfig: editMemoRequestType = {
        username: user.user?.username!,
        memo: memo,
        year: year,
        month: month + 1,
        specific_date: day,
      };
      dispatch(workoutLogActions.editMemo(editMemoConfig));
      setMemoWriteMode(false);
    }
  };

  const fitelementDeleteOnClick = (id: number) => {
    dispatch(
      workoutLogActions.deleteFitElement({
        username: user.user?.username!,
        fitelement_id: id,
      }),
    );
  };

  const dailyLog = useSelector((rootState: RootState) => rootState.workout_log.daily_log);
  const dailyFitElements = useSelector((rootState: RootState) => rootState.workout_log.daily_fit_elements);
  const calendarInfo = useSelector((rootState: RootState) => rootState.workout_log.calendar_info);
  const createDailyLogStatus = useSelector((rootState: RootState) => rootState.workout_log.workoutCreate);
  const deleteFitElementStatus = useSelector((rootState: RootState) => rootState.workout_log.fitelementDelete);
  const pasteStatus = useSelector((rootState: RootState) => rootState.workout_log.add_fit_elements);
  const imageSuccess = useSelector((rootState: RootState) => rootState.workout_log.imageSuccess);
  const memoSuccess = useSelector((rootState: RootState) => rootState.workout_log.memoSuccess);
  const fitElementTypes = useSelector((rootState: RootState) => rootState.workout_log.fitelement_types);
  const visible_input = workout_category === '기타운동' || workout_category === '유산소' ? 'hidden' : 'visible';
  const deleteImageSuccess = useSelector((rootState: RootState) => rootState.workout_log.deleteImageSuccess);
  const indexSuccess = useSelector((rootState: RootState) => rootState.workout_log.indexSuccess);

  const daily_ref = useRef<Fitelement[]>([]);
  const [daily_temp, setDailyTemp] = useState<Fitelement[]>([]);
  daily_ref.current = dailyFitElements;

  useEffect(() => {
    dispatch(workoutLogActions.getDailyLog(defaultDailyLogConfig));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    createDailyLogStatus,
    pasteStatus,
    deleteFitElementStatus,
    imageSuccess,
    memoSuccess,
    deleteImageSuccess,
    indexSuccess,
  ]);

  useEffect(() => {
    setMemo(dailyLog.memo || '');
    setImage(dailyLog.images || ['default-upload-image.png']);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [dailyLog]);

  useEffect(() => {
    setDailyTemp(dailyFitElements);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [dailyFitElements]);

  useEffect(() => {
    dispatch(
      workoutLogActions.getCalendarInfo({
        username: user.user?.username!,
        year: year,
        month: month + 1,
      }),
    );
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isCopy, createDailyLogStatus]);

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
    dispatch(workoutLogActions.getFitElementsType());
    dispatch(userActions.getProfile(user.user?.username || ''));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [date, calendarInfo]);

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days = isLeapYear(date.getFullYear()) ? DAYS_LEAP : DAYS;

  const onChangeDailyLogImage = async (e: any) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하의 파일만 업로드가 가능합니다.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await client.post(process.env.REACT_APP_API_IMAGE_UPLOAD || '', formData);
      const editImageConfig: editImageRequestType = {
        username: user.user?.username!,
        image: result.data.title,
        year: year,
        month: month + 1,
        specific_date: day,
      };
      dispatch(workoutLogActions.editImage(editImageConfig));
      let input = document.getElementById('FileInput_DailyLog') as HTMLInputElement;
      input.value = '';
    } catch (error) {
      alert('이미지 업로드 오류');
    }
  };

  const removeImages = (targetImage: string) => {
    const deleteImageConfig: deleteImageRequestType = {
      username: user.user?.username!,
      image: targetImage,
      year: year,
      month: month + 1,
      specific_date: day,
      delete: true,
    };
    dispatch(workoutLogActions.deleteImage(deleteImageConfig));
    notificationSuccess('Image', '이미지 삭제에 성공했어요!');
  };

  const onDragEnd = (res: DropResult) => {
    const { source, destination } = res;
    console.log(res);

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    let index_list = [...dailyLog.fit_element!];

    const _fit_list = [...dailyFitElements];
    const [target_fit] = _fit_list.splice(source.index, 1);
    _fit_list.splice(destination.index, 0, target_fit);
    setDailyTemp(_fit_list);

    const temp_index = [...dailyLog.fit_element!];
    const [target_index] = temp_index.splice(source.index, 1);
    temp_index.splice(destination.index, 0, target_index);
    index_list = temp_index;

    const editIndexConfig: editIndexRequestType = {
      username: user.user?.username!,
      log_index: index_list,
      year: year,
      month: month + 1,
      specific_date: day,
    };
    dispatch(workoutLogActions.editIndex(editIndexConfig));
  };

  const FitElementList = (fitelement: Fitelement, id: number, index: number) => {
    return (
      <Draggable key={id} draggableId={String(id)} index={index}>
        {provided => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <FitElementWrapper>
              <FitElement
                key={fitelement.data.id}
                id={index + 1}
                type={fitelement.data.type}
                workout_type={fitelement.data.workout_type}
                category={fitelement.data.category}
                weight={fitelement.data.weight}
                rep={fitelement.data.rep}
                set={fitelement.data.set}
                time={fitelement.data.time}
              />
              <DeleteButton>
                <DeleteEmoji
                  data-testid="delete-fitelement"
                  src={require('assets/images/workout_log/fitelement_delete/delete_button.png')}
                  onClick={() => fitelementDeleteOnClick(fitelement.data.id)}
                />
              </DeleteButton>
            </FitElementWrapper>
          </div>
        )}
      </Draggable>
    );
  };

  const fitElementTarget = fitElementTypes.filter(item => item.class_name === workout_category);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <InnerWrapper>
          <LeftWrapper>
            <LeftUpper>
              <DateWrapper>
                {isCopy === true
                  ? String(copy_date.getFullYear()) +
                    '.' +
                    String(copy_date.getMonth() + 1) +
                    '.' +
                    String(copy_date.getDate()) +
                    ' ' +
                    '복사중'
                  : '복사 없음'}
              </DateWrapper>
            </LeftUpper>
            <CalendarWrapper>
              <Frame>
                <CalendarHeader>
                  <Button
                    onClick={() => {
                      dispatch(
                        workoutLogActions.getCalendarInfo({
                          username: user.user?.username!,
                          year: month === 0 ? year - 1 : year,
                          month: month === 0 ? 12 : month,
                        }),
                      );
                      setDate(new Date(year, month - 1, day));
                    }}
                  >
                    {'<'}
                  </Button>
                  <YearMonth>
                    <Year>{year}</Year>
                    <Month>{MONTHS[month]}</Month>
                  </YearMonth>

                  <Button
                    onClick={() => {
                      dispatch(
                        workoutLogActions.getCalendarInfo({
                          username: user.user?.username!,
                          year: month === 11 ? year + 1 : year,
                          month: ((month + 1) % 12) + 1,
                        }),
                      );
                      setDate(new Date(year, month + 1, day));
                    }}
                  >
                    {'>'}
                  </Button>
                </CalendarHeader>
                <Body>
                  {DAYS_OF_THE_WEEK.map(d =>
                    d === 'SUN' ? (
                      <Day className="sunday" key={d}>
                        {d}
                      </Day>
                    ) : d === 'SAT' ? (
                      <Day className="saturday" key={d}>
                        {d}
                      </Day>
                    ) : (
                      <Day key={d}>{d}</Day>
                    ),
                  )}
                  {Array(36)
                    .fill(null)
                    .map((_, index) => {
                      const d = index - (startDay - 2);
                      const visibility_value = d > 0 ? (d <= days[month] ? false : true) : true;
                      // {year}.{selected_month + 1}.{day}
                      let day_type = 'future_day';
                      if (year === selected_year && month === selected_month && d === selected_date) {
                        day_type = 'selected_day';
                      } else if (year > today.getFullYear()) {
                        day_type = 'future_day';
                      } else if (year === today.getFullYear() && month > today.getMonth()) {
                        day_type = 'future_day';
                      } else if (year === today.getFullYear() && month === today.getMonth() && d > today.getDate()) {
                        day_type = 'future_day';
                      } else if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
                        day_type = 'today';
                      } else if (d > 0 && d <= days[month] && calendarInfo.length > 0) {
                        if (calendarInfo[d - 1]?.workouts.length === 0) {
                          day_type = 'type2';
                        } else {
                          day_type = 'type1';
                        }
                      } else {
                        day_type = 'type2';
                      }
                      return (
                        <Day
                          className={day_type}
                          data-testid="day_component"
                          key={index}
                          onClick={() => {
                            clickDate(year, month, d);
                          }}
                        >
                          <DayContent visibility_boolean={visibility_value} className={day_type}>
                            {d > 0 ? (d <= days[month] ? d : '') : ''}
                          </DayContent>
                          <DayToolTip className={calendarInfo[d - 1]?.workouts.length === 0 ? 'nothing' : 'exist'}>
                            <Hover key={0} workouts={calendarInfo[d - 1]?.workouts} types={fitElementTypes} />
                          </DayToolTip>
                        </Day>
                      );
                    })}
                </Body>
                <CalendarFooter>
                  <>
                    {image!.map((v, index) => (
                      <WorkoutImageWrapper key={index}>
                        <WorkoutImage
                          src={process.env.REACT_APP_API_IMAGE + v}
                          alt="workout_image"
                          onClick={() => {
                            setActiveImage(v);
                            setImageModalOpen(true);
                          }}
                        />
                        <RedSmallBtn onClick={() => removeImages(v)}>삭제</RedSmallBtn>
                      </WorkoutImageWrapper>
                    ))}
                  </>
                  {image!.length + 1 > CONTENT_IMAGE_LIMIT ? (
                    ''
                  ) : (
                    <WorkoutImageWrapper>
                      <WorkoutImage
                        src={process.env.REACT_APP_API_IMAGE + 'default-upload-image.png'}
                        alt="workout_image"
                        onClick={() => {
                          document.getElementById('FileInput_DailyLog')?.click();
                        }}
                      />
                      <FileInput
                        type="file"
                        accept="image/*"
                        id="FileInput_DailyLog"
                        onChange={onChangeDailyLogImage}
                      />
                    </WorkoutImageWrapper>
                  )}
                </CalendarFooter>
              </Frame>
            </CalendarWrapper>
            <MemoWrapper>
              <Frame className="memo">
                <MemoTitleWrapper>Notes</MemoTitleWrapper>
                <MemoContentWrapper>
                  {memo_write_mode ? (
                    <MemoInput
                      value={memo}
                      placeholder="수정 버튼을 눌러 메모를 추가해 보세요."
                      onChange={e => setMemo(e.target.value)}
                    />
                  ) : memo === '' ? (
                    '수정 버튼을 눌러 메모를 추가해 보세요.'
                  ) : (
                    memo
                  )}
                </MemoContentWrapper>

                <MemoFooter>
                  <MemoButtonWrapper>
                    <AnyButton
                      className="memo-type"
                      hidden={!memo_write_mode}
                      onClick={() => memoOnClick('cancel_button')}
                    >
                      취소
                    </AnyButton>
                    <AnyButton
                      className="memo-type"
                      data-testid="memo_edit_button"
                      hidden={memo_write_mode}
                      onClick={() => memoOnClick('edit_button')}
                    >
                      수정
                    </AnyButton>
                    <AnyButton
                      className="memo-type"
                      hidden={!memo_write_mode}
                      onClick={() => memoOnClick('complete_button')}
                    >
                      완료
                    </AnyButton>
                  </MemoButtonWrapper>
                </MemoFooter>
              </Frame>
            </MemoWrapper>
          </LeftWrapper>
          <RightWrapper>
            <LogWrapper>
              <LogUpper>
                <DateWrapper>
                  {selected_year}.{selected_month + 1}.{selected_date}
                </DateWrapper>
                <AnyButton onClick={() => routineClick()}>루틴</AnyButton>
                <AnyButton
                  className="disable-type"
                  disabled={
                    isCopy
                      ? copy_date.getFullYear() === selected_year &&
                        copy_date.getMonth() === selected_month &&
                        copy_date.getDate() === selected_date
                        ? true
                        : false
                      : true
                  }
                  onClick={() => pasteDailyLog()}
                >
                  불러오기
                </AnyButton>
                <AnyButton onClick={() => copyDailyLog()}>내보내기</AnyButton>
                <AnyButton>저장</AnyButton>
                <AnyButton onClick={() => addRoutineClick()}>루틴추가</AnyButton>
              </LogUpper>
              <Frame className="right">
                <LogHeader>
                  <LogCategory>부위</LogCategory>
                  <LogCategory className="type">종류</LogCategory>
                  <LogCategory
                    className={workout_category === '기타운동' || workout_category === '유산소' ? 'hide' : 'no_hide'}
                  >
                    강도
                  </LogCategory>
                  <LogCategory
                    className={workout_category === '기타운동' || workout_category === '유산소' ? 'hide' : 'no_hide'}
                  >
                    반복
                  </LogCategory>
                  <LogCategory
                    className={workout_category === '기타운동' || workout_category === '유산소' ? 'hide' : 'no_hide'}
                  >
                    세트
                  </LogCategory>
                  <LogCategory>시간(분)</LogCategory>
                </LogHeader>
                <LogInputBody>
                  <LogInputBodyInput>
                    <WorkoutTypeSelect
                      value={workout_category || '선택'}
                      className="type2"
                      onChange={e => setWorkoutCategory(e.target.value)}
                    >
                      <option disabled>선택</option>
                      {fitElementTypes.map((fitelement_category, index) => (
                        <option key={index}>{fitelement_category.class_name}</option>
                      ))}
                    </WorkoutTypeSelect>
                    <WorkoutTypeSelect
                      value={workout_type || '종류 선택'}
                      onChange={e => setWorkoutType(e.target.value)}
                    >
                      <option disabled>종류 선택</option>
                      {fitElementTarget.length === 1 &&
                        fitElementTarget[0].tags.map((fitelement, index) => (
                          <option key={index}>{fitelement.name}</option>
                        ))}
                    </WorkoutTypeSelect>
                    <WorkoutTypeInput
                      pattern="[0-9]+"
                      type="number"
                      onKeyPress={event => {
                        if (!(48 <= event.charCode && event.charCode <= 57)) {
                          event.preventDefault();
                        }
                      }}
                      className={visible_input}
                      disabled={visible_input === 'hidden' ? true : false}
                      min="0"
                      value={weight || ''}
                      onChange={e => setWeight(Number(e.target.value))}
                    />
                    <WorkoutTypeInput
                      type="number"
                      onKeyPress={event => {
                        if (!(48 <= event.charCode && event.charCode <= 57)) {
                          event.preventDefault();
                        }
                      }}
                      className={visible_input}
                      disabled={visible_input === 'hidden' ? true : false}
                      min="0"
                      value={rep || ''}
                      onChange={e => setRep(Number(e.target.value))}
                    />
                    <WorkoutTypeInput
                      type="number"
                      onKeyPress={event => {
                        if (!(48 <= event.charCode && event.charCode <= 57)) {
                          event.preventDefault();
                        }
                      }}
                      className={visible_input}
                      disabled={visible_input === 'hidden' ? true : false}
                      min="0"
                      value={set || ''}
                      onChange={e => setSet(Number(e.target.value))}
                    />
                    <WorkoutTypeInput
                      type="number"
                      min="0"
                      onKeyPress={event => {
                        if (!(48 <= event.charCode && event.charCode <= 57)) {
                          event.preventDefault();
                        }
                      }}
                      value={workout_time || ''}
                      onChange={e => setWorkoutTime(Number(e.target.value))}
                    />
                  </LogInputBodyInput>
                  <LogInputBodyButton>
                    <AnyButton className="type1" onClick={() => cancelWorkoutLog()}>
                      초기화
                    </AnyButton>
                    <AnyButton className="type1" onClick={() => createWorkoutLog()}>
                      완료
                    </AnyButton>
                  </LogInputBodyButton>
                </LogInputBody>
                <Droppable droppableId="Logs">
                  {provided => (
                    <LogBody ref={provided.innerRef} {...provided.droppableProps}>
                      {daily_temp.length === 0 ? (
                        <CenterContentWrapper>운동 기록을 추가하세요!</CenterContentWrapper>
                      ) : (
                        daily_temp.map((fitelement: Fitelement, index: number) =>
                          FitElementList(fitelement, fitelement.data.id, index),
                        )
                      )}
                      {provided.placeholder}
                    </LogBody>
                  )}
                </Droppable>
                <LogFooter>
                  <FooterItem>{dailyLog.fit_element?.length}종류</FooterItem>
                  <FooterItem>{dailyLog.calories * (user.profile?.weight || 1)} kcal</FooterItem>
                </LogFooter>
              </Frame>
            </LogWrapper>
          </RightWrapper>
        </InnerWrapper>
        {ImageDetailModal({
          isActive: imageModalOpen,
          onClose: imageModalOnClose,
          modalRef: imageModalRef,
          modalAnimRef: imageModalAnimRef,
          activeImage,
        })}
      </Wrapper>
    </DragDropContext>
  );
};

export default WorkoutLog;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const WorkoutImageWrapper = styled.div`
  width: 120px;
  height: 110px;
  border-radius: 15px;
  margin: 3px;
  margin-top: 35px;
  cursor: pointer;
  transition: border 0.15s linear;
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

const WorkoutImage = styled.img`
  width: 120px;
  height: 110px;
  background-color: var(--fit-disabled-gray);
  border-radius: 15px;
  object-fit: cover;
`;
const FileInput = styled.input`
  display: none;
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
`;

const LeftWrapper = styled.div`
  width: 40%;
  height: 92vh;
  min-width: 480px;
  max-width: 480px;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  height: 80%;
  min-height: 500px;
  max-height: 500px;
  min-width: 480px;
  max-width: 480px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const Frame = styled.div`
  width: 90%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &&.right {
    height: 90%;
    justify-content: center;
    min-height: 70.2vh;
  }

  &&.memo {
    min-height: 120px;
  }
`;

const YearMonth = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Year = styled.div`
  height: 40%;
  width: 100%;
  font-size: 15px;
  justify-content: center;

  && {
    font-weight: normal;
  }
`;

const Month = styled.div`
  height: 60%;
  width: 100%;
  font-weight: bold;
  justify-content: center;
`;

const CalendarHeader = styled.div`
  font-size: 18px;
  width: 50%;
  height: 15%;
  padding: 20px 10px 0px 10px;
  font-family: IBMPlexSansThaiLooped;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.div`
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  font-weight: bold;
`;

const Body = styled.div`
  width: 95%;
  height: 50%;
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  font-weight: normal;
`;

const Day = styled.div`
  width: 14.2%;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  color: black;

  && {
    font-weight: normal;
  }

  &&.sunday {
    color: red;
  }

  &&.saturday {
    color: blue;
  }

  &&.future_day {
    font-weight: bold;
    cursor: pointer;
  }
`;

const DayToolTip = styled.div`
  visibility: hidden;
  background-color: #eef3fd;
  border: black solid 1px;
  border-radius: 5px;
  color: black;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.25px;
  padding: 5px 11px;
  position: absolute;
  width: 150px;
  height: 190px;
  z-index: 100;
  margin-top: 240px;

  &&.nothing {
    height: 70px;
    margin-top: 120px;
  }

  &::after {
    border-color: white transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    left: 50%;
    margin-left: -6px;
    position: absolute;
    top: -7px;
    width: 0;
    z-index: 1;
  }

  &::before {
    border-color: black transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    left: 50%;
    position: absolute;
    margin-left: -6px;
    top: -8.5px;
    width: 0;
    z-index: 0;
  }
`;

const DayContent = styled.div<{ visibility_boolean: boolean }>`
  visibility: ${props => (props.visibility_boolean ? 'hidden' : 'none')};
  width: auto;
  max-width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  color: black;

  &&.selected_day {
    color: #0000cc;
    background-color: #818281;
    font-weight: bold;
    border-radius: 50%;
  }

  &&.today {
    color: black;
    font-weight: bold;
    background-color: #99ffff;
    border-radius: 50%;
  }

  &&.type1 {
    color: black;
    font-weight: bold;
    background-color: #d7efe3;
    border-radius: 50%;
  }

  &&.type2 {
    color: black;
    font-weight: bold;
  }

  &&.future_day {
    font-weight: bold;
    color: #a9a9a9;
  }

  &:hover + ${DayToolTip} {
    visibility: visible;
    background-color: #ffffff;
  }
`;
const MemoWrapper = styled.div`
  width: 100%;
  height: 20%;
  min-height: 100px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const MemoInput = styled.input`
  width: 400px;
  height: 80%;
  padding: 5px 15px 5px 15px;
  font-size: 14px;
  font-weight: normal;
  font-family: IBMPlexSansThaiLooped;
`;

const MemoTitleWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 10%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 20px;
  font-weight: 600;
  justify-content: start;
`;

const DateWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 20%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 15px;
  font-weight: 600;
  justify-content: start;
`;

const MemoContentWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 70%;
  align-items: center;
  font-family: IBMPlexSansThaiLooped;
  font-size: 14px;
  font-weight: 600;
  color: #818281;
`;

const MemoButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: end;
  justify-content: end;
  flex-direction: row;
  font-family: IBMPlexSansThaiLooped;
  font-size: 14px;
  font-weight: 600;
  color: #818281;
`;

const CenterContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 60vh;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  font-size: 30px;
  font-weight: 400;
  color: #818281;
`;

const AnyButton = styled.button`
  width: 180px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border: 0;
  border-radius: 8px;
  font-family: FugazOne;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }

  &&.type1 {
    width: 120px;
    height: 20px;
  }

  &&.disable-type {
    background-color: #d7efe3;
    cursor: default;
  }

  &&.memo-type {
    width: 60px;
    height: 20px;
  }

  &&.image-type {
    width: 110px;
    height: 20px;
    margin-left: 0px;
  }
`;

const RightWrapper = styled.div`
  width: 60%;
  height: 100%;
  min-width: 680px;
  max-width: 680px;
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: start;
  background-color: #ffffff;
`;

const LeftUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  margin-left: 35px;
  display: flex;
  justify-content: start;
  align-items: end;
`;

const LogUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  display: flex;
  align-items: end;
  justify-content: end;
`;

const LogWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 78vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogHeader = styled.div`
  font-size: 18px;
  width: 100%;
  height: 10%;
  border-bottom: 1px solid black;
  padding: 10px 0px 5px 0px;
  font-family: IBMPlexSansThaiLooped;
  display: flex;

  justify-content: center;
  align-items: center;
`;

const LogCategory = styled.div`
  width: 15%;
  height: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  color: black;
  margin-left: 5px;
  margin-right: 5px;
  padding: 4px 10px;

  &&.type {
    width: 20%;
  }

  &&.hide {
    color: #dcdcdc;
  }
`;

const LogInputBodyInput = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  min-height: 60px;
  font-weight: normal;
`;

const WorkoutTypeInput = styled.input`
  width: 15%;
  height: 100%;
  padding: 8px 10px;
  font-size: 14px;
  margin: 5px;
  margin-top: 7px;

  &&.hidden {
    disabled: true;
    readonly: true;
    background: #f0f0f0;
    border: #dcdcdc;
  }

  &:invalid {
    border: 1px solid red;
  }
`;

const WorkoutTypeSelect = styled.select`
  width: 20%;
  height: 100%;
  padding: 8px 10px;
  font-size: 14px;
  margin: 5px;
  margin-top: 7px;

  &&.type2 {
    width: 15%;
  }
`;

const LogInputBodyButton = styled.div`
  width: 100%;
  height: 20%;
  min-height: 40px;
  display: flex;
  justify-content: end;
  font-weight: normal;
`;

const LogInputBody = styled.div`
  width: 100%;
  height: 10%;
  max-height: 90px;
  display: flex;
  flex-direction: column;
  font-weight: normal;
  border-bottom: 1px solid black;
`;

const LogBody = styled.div`
  width: 100%;
  height: 90%;
  min-height: 62vh;
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  align-items: start;
  font-weight: normal;
`;

const LogFooter = styled.div`
  width: 100%;
  height: 10%;
  min-height: 8vh;
  display: flex;
  flex-wrap: wrap;
  font-weight: normal;
  padding: 15px 20px;
  background-color: #d7efe3;
  border-top: 1px solid black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  align-items: center;
`;

const FooterItem = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-family: IBMPlexSansThaiLooped;
  font-weight: 500;
`;

const MemoFooter = styled.div`
  display: flex;
  height: 20%;
  width: 100%;
  padding: 10px 10px;
  flex-direction: row;
`;

const CalendarFooter = styled.div`
  width: 88%;
  height: 35%;
  display: flex;
  justify-content: start;
  align-items: start;
`;

const FitElementWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
  align-items: center;
`;

const DeleteButton = styled.div`
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteEmoji = styled.img`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
