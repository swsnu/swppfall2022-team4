import styled from 'styled-components';
import { BtnBlueprint } from './button';
import 'styles/color.css';

interface IProps {
  page: number;
  setPage: (value: React.SetStateAction<number>) => void;
  maxPage: number | null;
}

export const postPaginator = ({ page, setPage, maxPage }: IProps) => {
  const firstPage = () => setPage(1);
  const prevPage = () => (page >= 2 ? setPage(page => page - 1) : null);
  const gotoPage = (p: number) => (p != page ? setPage(p) : null);
  const nextPage = () => (maxPage && page < maxPage ? setPage(page => page + 1) : null);
  const lastPage = () => (maxPage ? setPage(maxPage) : null);
  return (
    <PostPaginatorWrapper>
      <PageNumber disabled={page < 2} onClick={firstPage}>
        ◀◀
      </PageNumber>
      <PageNumber disabled={page < 2} onClick={prevPage}>
        ◀
      </PageNumber>
      {maxPage &&
        [...Array(5)]
          .map((_, i) => Math.floor((page - 1) / 5) * 5 + i + 1)
          .map(
            p =>
              p <= maxPage && (
                <PageNumber disabled={p == page} key={p} onClick={() => gotoPage(p)}>
                  {p}
                </PageNumber>
              ),
          )}
      {maxPage && (
        <PageNumber disabled={page >= maxPage} onClick={nextPage}>
          ▶︎
        </PageNumber>
      )}
      {maxPage && (
        <PageNumber disabled={page >= maxPage} onClick={lastPage}>
          ▶︎▶︎
        </PageNumber>
      )}
      <CurrentPageWrapper>현재 페이지 : {page}</CurrentPageWrapper>
    </PostPaginatorWrapper>
  );
};

const PostPaginatorWrapper = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;
  position: absolute;
  bottom: 0px;
`;

const CurrentPageWrapper = styled.div`
  position: absolute;
  right: 20px;
  font-size: 14px;
`;

const PageNumber = styled(BtnBlueprint)`
  background: none;
  margin: 0px 5px;
  cursor: pointer;
  color: var(--fit-green-deep);

  :disabled {
    background: none;
    cursor: default;
    color: black;

    :hover {
      background: none;
    }
  }
`;
