import { render, screen } from '@testing-library/react';
import { MemberElement } from './MemberElement';

describe('<MemberElement/>', () => {
  it('should render without errors', () => {
    render(<MemberElement id={1} image={'image'} username={'test'} cert_days={7} level={1} leader={true} myself={true}/>);
    screen.getByText('test');
    screen.getByText('Level: 1');
  });
});
