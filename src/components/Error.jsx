import { Alert } from '@mui/material';

export const Error = () => {
    return (
        <Alert variant="filled" severity="error">
            Đã có lỗi xảy ra. Vui lòng quay lại sau.
        </Alert>
    );
};
