import styled from 'styled-components';

// Used in PostMain.tsx
export const ArticleItemGrid = styled.div`
  display: grid;
  grid-template-columns: 5fr 30fr 10fr 5fr 5fr;
  grid-template-rows: 1fr;
  place-items: center;
`;

// Used in PostEditorLayout.tsx, PostDetail.tsx
export const RowCenterFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

// Used in PostEditorLayout.tsx, PostMain.tsx, PostDetail.tsx
export const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ColumnCenterFlex = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;
