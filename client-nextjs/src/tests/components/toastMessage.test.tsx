import { render } from '@testing-library/react';
import ToastMessage from '../../components/toastMessage';

describe('ToastMessage component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <ToastMessage message="This is a success message" state="success" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
