import { Backdrop, CircularProgress } from '@mui/material';

export const Loading = () => {
    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};
