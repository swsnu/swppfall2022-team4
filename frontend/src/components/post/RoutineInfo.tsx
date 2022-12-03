import { get_image } from 'components/fitelement/FitElement';
import { RoutineTypeInPost } from 'store/slices/workout';
import styled from 'styled-components';

const RoutineItemGrid = styled.div`
  display: grid;
  grid-template-columns: 5fr 10fr 20fr 8fr 8fr 8fr 8fr;
`;

const RoutineHeader = () => (
  <RoutineItemGrid>
    <span></span>
    <span></span>
    <span>종류</span>
    <span>강도</span>
    <span>반복</span>
    <span>세트</span>
    <span>시간</span>
  </RoutineItemGrid>
);

export const RoutineInfo = ({ routine }: { routine: RoutineTypeInPost | null | undefined }) => {
  if (routine) {
    return (
      <RoutineInfoWrapper>
        <span>태그된 루틴</span>
        <div>
          <span>{routine.name}</span>
          <div>
            <RoutineHeader />
            {routine.fitelements.map((fitelement, index) => (
              <RoutineItems key={index}>
                <span>{index + 1}</span>
                <div>
                  <LogImage
                    src={require(`assets/images/workout_log/fitelement_category/${get_image(
                      fitelement.workout_type,
                    )}.png`)}
                  />
                  {fitelement.workout_type}
                </div>
                <span>{fitelement.workout_name}</span>
                <span>{fitelement.weight}</span>
                <span>{fitelement.rep}</span>
                <span>{fitelement.set}</span>
                <span>{fitelement.time}</span>
              </RoutineItems>
            ))}
          </div>
        </div>
      </RoutineInfoWrapper>
    );
  } else {
    return <></>;
  }
};

const LogImage = styled.img`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoutineInfoWrapper = styled.div`
  width: 100%;
  background-color: var(--fit-white);
  border-radius: 15px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  > span:first-child {
    /* 태그된 루틴 */
    font-size: 14px;
    color: var(--fit-support-gray);
    margin-bottom: 10px;
  }
  > div:nth-child(2) {
    /* 루틴 내용 */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 5px 10px;
    > span:first-child {
      /* 루틴 이름 */
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    > div:nth-child(2) {
      width: 100%;
    }
  }
`;

const RoutineItems = styled(RoutineItemGrid)`
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }
`;
