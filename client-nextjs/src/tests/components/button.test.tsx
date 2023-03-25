import { render } from '@testing-library/react';
import Button from '../../components/button';

describe('Button component', () => {
    it('renders correctly', () => {
        const { asFragment } = render(
            <Button text="Click me" onClick={() => { }} />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
