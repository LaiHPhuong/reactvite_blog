import { Box, Container, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { PostList } from '../../components/PostList';

export const Tag = () => {
    const { value } = useParams();

    return (
        <>
            <Container maxWidth="lg">
                <Box py={3}>
                    <Typography variant="h1" fontWeight={700} fontSize={40} gutterBottom>
                        Tag: {value}
                    </Typography>
                </Box>

                {/* Danh sách bài viết */}
                <PostList filter="tag" value={value} />
            </Container>
        </>
    );
};
