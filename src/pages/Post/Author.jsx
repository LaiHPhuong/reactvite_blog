import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectorStatus, selectorOneUser, getUser } from '../../redux/slide/UserSlide';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { PostList } from '../../components/PostList';

export const Author = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const status = useSelector(selectorStatus);
    const user = useSelector(selectorOneUser);

    useEffect(() => {
        dispatch(getUser(id));
    }, [id, dispatch]);

    //console.log(user);

    return (
        <>
            <Container maxWidth="lg">
                <Box py={3}>
                    {status === 'error' && <Error />}

                    {status === 'pending' && <Loading />}

                    {status === 'idle' && (
                        <Typography variant="h1" fontWeight={700} fontSize={40} gutterBottom>
                            {user.id}-{user.username} - {user.email}
                        </Typography>
                    )}
                </Box>

                {/* Danh sách bài viết */}
                {status === 'idle' && <PostList filter="user" value={id} />}
            </Container>
        </>
    );
};
