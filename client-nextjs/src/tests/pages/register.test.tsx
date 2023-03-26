import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import Register from '../../pages/register';

describe('Register page', () => {
  const setup = () => {
    return render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
  };

  it('renders correctly', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('submits the form', async () => {
    setup();

    fireEvent.input(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.input(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeInTheDocument());
  });
});
