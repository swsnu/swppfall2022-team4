import styled from 'styled-components';
import '../../styles/color.css';

export const articleItemGrid = styled.div`
  display: grid;
  grid-template-columns: 5fr 30fr 10fr 5fr 5fr;
  grid-template-rows: 1fr;
  place-items: center;
`;
export const width100percentDiv = styled.div`
  width: 100%;
  background-color: var(--fit-white);
`;
