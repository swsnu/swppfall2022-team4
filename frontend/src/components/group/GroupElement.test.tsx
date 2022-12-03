import { render, screen } from '@testing-library/react';
import { GroupElement } from './GroupElement';
import { TagVisual } from 'store/apis/tag';

const single_tag: TagVisual = {
  id: '1',
  name: '데드리프트',
  color: '#dbdbdb'
}

const onClick = jest.fn();
beforeEach(() => jest.clearAllMocks());

describe('<GroupElement />', () => {
  it('All full', () => {
    render(
      <GroupElement
        id={1}
        group_name={'test'}
        clicked={onClick}
        number={12}
        member_number={10}
        start_date={'2022-01-01'}
        end_date={'2023-12-31'}
        address={'서울시 관악구 봉천동'}
        free={true}
        prime_tag={single_tag}
      />,
    );
    screen.getByText('test');
    screen.getByText('장소 : 서울시 관악구 봉천동');
    screen.getByText('최대인원 : 12');
    screen.getByText('현재인원 : 10');
    screen.getByText('자유가입O');
    screen.getByText('시작일 : 2022-01-01');
    screen.getByText('마감일 : 2023-12-31');
    screen.getByText('데드리프트');
  });
  it('long address & done', () => {
    render(
      <GroupElement
        id={1}
        group_name={'test'}
        clicked={onClick}
        number={12}
        member_number={10}
        start_date={'2019-01-01'}
        end_date={'2019-12-31'}
        address={'서울특별시 관악구 봉천동 대천에이스빌 505호'}
        free={true}
        prime_tag={single_tag}
      />,
    );
    screen.getByText('장소 : 서울특별시 관악구 봉천동 대...');
  });
  it('all null', () => {
    render(
      <GroupElement
        id={1}
        group_name={'test'}
        clicked={onClick}
        number={null}
        member_number={10}
        start_date={null}
        end_date={null}
        address={null}
        free={false}
        prime_tag={undefined}
      />,
    );
    screen.getByText('test');
    screen.getByText('장소 : 장소없음');
    screen.getByText('최대인원 : 제한없음');
    screen.getByText('현재인원 : 10');
    screen.getByText('자유가입X');
    screen.getByText('시작일 : 기한없음');
    screen.getByText('마감일 : 기한없음');
    screen.getByText('None');
  });
});
