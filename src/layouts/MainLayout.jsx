import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

export const MainLayout = () => {
    return (
        <>
            <Container fixed="lg">
                <div>Header</div>
            </Container>

            <Outlet />

            <Container maxWidth="lg">
                <div>Footer</div>
            </Container>
        </>
    );
};
