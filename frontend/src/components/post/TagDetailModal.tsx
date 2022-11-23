import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { RowCenterFlex } from './layout';
import { CSSTransition } from 'react-transition-group';

export interface TagDetailModalIprops {
  isActive: boolean;
  onClose: () => void;
  modalRef: React.MutableRefObject<null>;
  modalAnimRef: React.MutableRefObject<null>;
}

const TagDetailModal = ({ isActive, onClose, modalRef, modalAnimRef }: TagDetailModalIprops) => {
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

  border-radius: inherit;
`;

const ModalCloseBtn = styled.div`
  width: fit-content;
  cursor: pointer;
`;

export default TagDetailModal;
