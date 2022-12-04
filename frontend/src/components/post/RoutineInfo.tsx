import { get_image } from 'components/fitelement/FitElement';
import { RoutineTypeInPost } from 'store/slices/workout';
import styled from 'styled-components';

const RoutineItemGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 15fr 20fr 8fr 8fr 8fr 8fr;
`;

const RoutineHeader = () => (
  <RoutineItemGrid style={{ color: 'var(--fit-support-gray)' }}>
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
        <span>태그된 루틴 : {routine.name}</span>
        <div>
          <div>
            <RoutineHeader />
            <RoutineItemsWrapper>
              {routine.fitelements.map((fitelement, index) => (
                <RoutineItems key={index}>
                  <span>{index + 1}</span>
                  <div>
                    <img
                      src={require(`assets/images/workout_log/fitelement_category/${get_image(
                        fitelement.workout_type,
                      )}.png`)}
                    />
                    <span>{fitelement.workout_type}</span>
                  </div>
                  <span>{fitelement.workout_name}</span>
                  <span>{fitelement.weight}</span>
                  <span>{fitelement.rep}</span>
                  <span>{fitelement.set}</span>
                  <span>{fitelement.time}</span>
                </RoutineItems>
              ))}
            </RoutineItemsWrapper>
          </div>
        </div>
      </RoutineInfoWrapper>
    );
  } else {
    return <></>;
  }
};

const RoutineInfoWrapper = styled.div`
  width: 100%;
  background-color: var(--fit-white);
  border-radius: 15px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;

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
    text-align: center;
    > div:first-child {
      width: 100%;
      > div:first-child {
        border-bottom: 0.2px solid var(--fit-support-gray);
        padding-bottom: 5px;
        margin-bottom: 5px;
      }
    }
  }
`;

const RoutineItemsWrapper = styled.div`
  display: grid;
  row-gap: 10px;
`;
const RoutineItems = styled(RoutineItemGrid)`
  align-items: center;
  > span:first-child {
    color: var(--fit-support-gray);
  }
  > div:nth-child(2) {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    span {
      margin-left: 10px;
    }
  }
`;
