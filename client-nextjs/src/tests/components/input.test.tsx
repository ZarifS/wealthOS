import { render } from '@testing-library/react';
import Input from '../../components/input';

describe('Input component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Input label="Email" name="email" inputType="email" onChange={() => {}} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
