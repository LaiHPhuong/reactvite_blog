import { Box, Container } from '@mui/material';
import { PostList } from '../../components/PostList';
import { SearchForm } from '../../components/SearchForm';

export const Home = () => {
    return (
        <>
            <Container maxWidth="lg">
                <Box py={3}>
                    <Box mb={1}>
                        <SearchForm />
                        {/* truyền setPage qua component con để xử lý trường hợp reset */}
                    </Box>
                </Box>

                {/* Danh sách bài viết */}
                <PostList />
            </Container>
        </>
    );
};
