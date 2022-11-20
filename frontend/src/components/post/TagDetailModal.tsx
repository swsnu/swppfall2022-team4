import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { CSSTransition } from 'react-transition-group';
import { TagClass, TagVisual } from 'store/apis/tag';
import { RowCenterFlex } from './layout';
import { TagBubble } from 'components/tag/tagbubble';
import React from 'react';

export interface TagDetailModalIprops {
  isActive: boolean;
  onClose: () => void;
  modalRef: React.MutableRefObject<null>;
  modalAnimRef: React.MutableRefObject<null>;
  tagList: TagClass[] | null;
  selected: TagVisual[];
  setSelected: (value: React.SetStateAction<TagVisual[]>) => void;
  isFiltering: boolean;
  setIsFiltering: (value: React.SetStateAction<boolean>) => void;
}

const UNSELECTED = '#dbdbdb';

const TagDetailModal = ({
  isActive,
  onClose,
  modalRef,
  modalAnimRef,
  tagList,
  selected,
  setSelected,
  isFiltering,
  setIsFiltering,
}: TagDetailModalIprops) => {
  const filterOnClick = (tag: TagVisual) => {
    if (selected.filter(item => item.id == tag.id).length === 0) {
      setSelected(state => {
        return [...state, tag];
      });
    } else {
      setSelected(state => {
        return state.filter(item => item.id !== tag.id);
      });
    }
  };

  const closeHandler = () => {
    onClose?.();
  };

  const Modal = (
    <CSSTransition in={isActive} nodeRef={modalAnimRef} timeout={110} classNames="modal" unmountOnExit>
      <ModalOverlay ref={modalAnimRef}>
        <ModalContent className="modal" ref={modalRef}>
          <Divdiv>
            <ModalTitleWrapper>
              <ModalTitle>태그 자세히보기</ModalTitle>
              <ModalExitWrapper>
                <ModalCloseBtn onClick={closeHandler} data-testid="tagModalCloseBtn">
                  <FontAwesomeIcon icon={faX} />
                </ModalCloseBtn>
              </ModalExitWrapper>
            </ModalTitleWrapper>
            <TagClassSection>
              <div>
                <h1>태그로 필터링하기 :</h1>
                <h1 onClick={() => setIsFiltering(state => !state)}>{isFiltering ? 'True' : 'False'}</h1>
              </div>
            </TagClassSection>
            {tagList?.map(tagClass => (
              <TagClassSection key={tagClass.id}>
                <div>
                  <h1>{tagClass.class_name}</h1>
                  <div style={{ backgroundColor: tagClass.color }}></div>
                </div>
                <div>
                  {tagClass.tags.map(tag => (
                    <TagBubble
                      key={tag.id}
                      color={
                        isFiltering && selected.filter(item => item.id == tag.id).length === 0 ? UNSELECTED : tag.color
                      }
                      onClick={() => filterOnClick(tag)}
                    >
                      {tag.name}
                    </TagBubble>
                  ))}
                </div>
              </TagClassSection>
            ))}
          </Divdiv>
        </ModalContent>
      </ModalOverlay>
    </CSSTransition>
  );
  return Modal;
};

export const ModalOverlay = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;

  background-color: var(--fit-modal-background);
`;

const TagClassSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  padding: 10px 20px;
  div:first-child {
    h1 {
      /* Title */
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    div {
      width: 15px;
      height: 15px;
      margin-left: 5px;
      border-radius: 20px;
    }
  }
  div {
    display: flex;
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
`;
const ModalContent = styled.div`
  width: fit-content;
  height: fit-content;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 15px;
  /* Modal Shadow */
  -webkit-box-shadow: 0 10px 12px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 10px 12px rgba(0, 0, 0, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
`;

const ModalTitleWrapper = styled(RowCenterFlex)`
  width: 100%;
  padding: 15px 20px;
`;

const ModalTitle = styled.span`
  font-size: 24px;
`;
const ModalExitWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 20px;

  font-size: 25px;
  color: var(--fit-red-neg);
`;

const Divdiv = styled.div`
  width: 1000px;
  height: 600px;
  background-color: var(--fit-white);
  overflow: auto;
  border-radius: inherit;
`;

const ModalCloseBtn = styled.div`
  width: fit-content;
  cursor: pointer;
`;

export default TagDetailModal;
