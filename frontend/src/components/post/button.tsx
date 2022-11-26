import styled from 'styled-components';

export const BtnBlueprint = styled.button`
  padding: 0px;
  margin: 0px;
  width: auto;
  height: auto;

  border: none;

  font-size: 15px;

  cursor: pointer;
  :disabled {
    background-color: var(--fit-disabled-gray);
    cursor: default;
    &:hover {
      background-color: var(--fit-disabled-gray);
    }
  }
`;

// Blueprint with color.
const RedBtnBlueprint = styled(BtnBlueprint)`
  background-color: var(--fit-red-neg);
  &:hover {
    background-color: var(--fit-red-neg-hover);
  }
  &:active {
    background-color: var(--fit-red-neg-active);
  }
`;
const GreenBtnBlueprint = styled(BtnBlueprint)`
  background-color: var(--fit-green-btn);
  &:hover {
    background-color: var(--fit-green-btn-hover);
  }
  &:active {
    background-color: var(--fit-green-btn-active);
  }
`;
const BlueBtnBlueprint = styled(BtnBlueprint)`
  background-color: var(--fit-blue-pos);
  &:hover {
    background-color: var(--fit-blue-pos-hover);
  }
  &:active {
    background-color: var(--fit-blue-pos-active);
  }
`;

// Real Instance.
export const BlueBigBtn = styled(BlueBtnBlueprint)`
  padding: 8px 20px;
  margin: 0px 0px 10px 0px;
  width: 100%;
`;

export const RedBigBtn = styled(RedBtnBlueprint)`
  padding: 8px 80px;
  border-radius: 30px;
  width: auto;
  height: fit-content;
`;

export const BlueBigActiveBtn = styled(BlueBigBtn)`
  padding: 8px 80px;
  margin: 0px 0px 10px 30px;
  border-radius: 30px;
  width: auto;
  height: fit-content;
`;

export const GreenBigBtn = styled(GreenBtnBlueprint)`
  padding: 5px 8px;
  margin: 6px 10px;
  font-size: 14px;
  border-radius: 4px;
`;

export const RedBtn = styled(RedBtnBlueprint)`
  padding: 5px 8px;
  margin: 6px 10px;
  font-size: 14px;
  border-radius: 4px;
`;

export const GreenCommentSubmitBtn = styled(GreenBtnBlueprint)`
  width: 10%;
  padding: 10px 6px;
  margin-left: 5px;
  background: var(--fit-green-mid-btn1);
`;

export const CommentBtn = styled(BtnBlueprint)`
  padding: 4px 8px;
  font-size: 10px;
  border-radius: 4px;
  margin: 0px 4px;
`;

export const CommentGreenBtn = styled(CommentBtn)`
  background-color: var(--fit-green-btn);
  &:hover {
    background-color: var(--fit-green-btn-hover);
  }
  &:active {
    background-color: var(--fit-green-btn-active);
  }
`;
export const RedSmallBtn = styled(CommentBtn)`
  background-color: var(--fit-red-neg);
  &:hover {
    background-color: var(--fit-red-neg-hover);
  }
  &:active {
    background-color: var(--fit-red-neg-active);
  }
`;

const SpanBtnBlueprint = styled.span`
  padding: 0px;
  margin: 0px;
  width: auto;
  height: auto;

  border: none;

  font-size: 15px;

  cursor: pointer;
  :disabled {
    background-color: var(--fit-disabled-gray);
    cursor: default;
    &:hover {
      background-color: var(--fit-disabled-gray);
    }
  }
`;
const GreenSpanBtnBlueprint = styled(SpanBtnBlueprint)`
  background-color: var(--fit-green-btn);
  &:hover {
    background-color: var(--fit-green-btn-hover);
  }
  &:active {
    background-color: var(--fit-green-btn-active);
  }
`;
export const GreenBigSpanBtn = styled(GreenSpanBtnBlueprint)`
  padding: 5px 8px;
  font-size: 14px;
  border-radius: 4px;
`;
