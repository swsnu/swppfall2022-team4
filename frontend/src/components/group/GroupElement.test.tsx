import { render, screen } from '@testing-library/react';
import { GroupElement } from './GroupElement';


describe("<GroupElement />", () => {
  it("should render without errors", () => {
    render(<GroupElement id={1} group_name={"test"} clicked={()=>0} number={12} member_number={10} start_date={"2019-01-01"} end_date={"2019-12-31"}/>);
    screen.getByText('test');
    screen.getByText('시작일 : 2019-01-01');
    screen.getByText('마감일 : 2019-12-31');
    screen.getByText('최대인원 : 12');
    screen.getByText('현재인원 : 10');
  });
  it("should render without errors", () => {
    render(<GroupElement id={1} group_name={"test"} clicked={()=>0} number={12} member_number={10} start_date={null} end_date={null}/>);
    screen.getByText('test');
    screen.getByText('시작일 : 기한없음');
    screen.getByText('마감일 : 기한없음');
    screen.getByText('최대인원 : 12');
    screen.getByText('현재인원 : 10');
  });
  it("should render without errors", () => {
    render(<GroupElement id={1} group_name={"test"} clicked={()=>0} number={null} member_number={10} start_date={"2019-01-01"} end_date={"2019-12-31"}/>);
    screen.getByText('test');
    screen.getByText('시작일 : 2019-01-01');
    screen.getByText('마감일 : 2019-12-31');
    screen.getByText('최대인원 : 제한없음');
    screen.getByText('현재인원 : 10');
  });
});
