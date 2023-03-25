import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import Login from '../../pages/login';

describe('Login page', () => {
    const setup = () => {
        return render(
            <Provider store={store}>
                <Login />
            </Provider>
        );
    };

    it('renders correctly', () => {
        const { asFragment } = setup();
        expect(asFragment()).toMatchSnapshot();
    });

    it('submits the form', async () => {
        setup();

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });
        fireEvent.input(screen.getByLabelText('Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

        await waitFor(() =>
            expect(screen.queryByText('Loading...')).toBeInTheDocument()
        );
    });
});
