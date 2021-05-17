import { render, fireEvent } from '@testing-library/react';
import Header, { HeaderProps } from './header';
import { useHeaderDatePickerState } from './hooks';
import '@testing-library/jest-dom';

describe('Header', () => {
  const props: HeaderProps = { title: '', onClick: jest.fn() };
  const date = new Date(2021, 4, 16);
  const HeaderWithHook = () => {
    const datePickerState = useHeaderDatePickerState({ date: date });
    return <Header {...props} {...datePickerState} />;
  };
  it('should render successfully', () => {
    const { baseElement } = render(<Header {...props} />);
    expect(baseElement).toBeTruthy();
  });
  it('hook should change date correctly', async () => {
    const { baseElement, getByTitle, getByText } = render(<HeaderWithHook />);
    expect(baseElement).toBeTruthy();
    const dateDisplay = getByText('Données au 16/05/2021', {
      exact: false,
      trim: true,
    });
    fireEvent.click(getByTitle('Left Chevron'));
    expect(dateDisplay).toHaveTextContent('Données au 15/05/2021');
    fireEvent.click(getByTitle('Right Chevron'));
    expect(dateDisplay).toHaveTextContent('Données au 16/05/2021');
    fireEvent.click(getByTitle('Right Chevron'));
    /* expect(dateDisplay).toHaveTextContent('Données au 16/05/2021'); */
  });
});
