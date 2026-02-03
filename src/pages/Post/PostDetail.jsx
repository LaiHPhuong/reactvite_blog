import { Avatar, Box, Button, Container, Link, Stack, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { LinkBehavior } from '../../components/LinkBehavior';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, selectorOnePost, selectorStatus } from '../../redux/slide/PostSlide';
import { useParams } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { CommentList } from './Comment/CommentList';
import axios from 'axios';
import { getEnv } from '../../utils/env';

export const PostDetail = () => {
    const post = useSelector(selectorOnePost);
    const status = useSelector(selectorStatus);
    const dispatch = useDispatch();
    const idPost = useParams();

    const [commentList, setCommentList] = useState([]);

    // const getCommentList = useCallback(async (id) => {
    //     const response = await axios.get(`${getEnv('VITE_SERVER_API')}/comments/post/${id}`);
    //     const data = await response.data;
    //     setCommentList(data.comments);
    // }, []);

    useEffect(() => {
        dispatch(getPost(idPost));

        const getCommentList = async (id) => {
            const response = await axios.get(`${getEnv('VITE_SERVER_API')}/comments/post/${id}`);
            const data = await response.data;
            setCommentList(data.comments);
        };

        getCommentList(idPost.id);
    }, [dispatch, idPost]);

    useEffect(() => {
        if (post?.title) {
            document.title = post.title;
        }
    }, [post?.title]);

    return (
        <>
            <Container maxWidth="lg">
                {status === 'error' && <Error />}

                {status === 'pending' && <Loading />}

                {status === 'idle' && (
                    <Box mb={3} py={3}>
                        <Typography variant="h1" fontWeight={700} fontSize={40} gutterBottom>
                            {post.title}
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                            <Typography variant="body2" color="text.secondary">
                                {post?.user ? (
                                    <Link component={LinkBehavior} to={`/author/${post.user.id}`}>
                                        {post.user.username}
                                    </Link>
                                ) : (
                                    'Chưa xác định'
                                )}
                                • 20/01/2026 • Lượt xem: {post.views}
                            </Typography>
                        </Stack>

                        <Typography mb={3}>{post.body}</Typography>

                        {post.tags?.length && (
                            <Box sx={{ marginBottom: 2 }}>
                                Tags:
                                {post.tags.map((tag, index) => (
                                    <Button
                                        sx={{ marginInline: 1 }}
                                        key={index}
                                        variant="outlined"
                                        size="small"
                                        component={LinkBehavior}
                                        to={`/tag/${tag}`}
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </Box>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                marginBottom: 2,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <ThumbUpIcon color="primary" /> {post.reactions?.likes}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <ThumbDownAltIcon color="error" /> {post.reactions?.dislikes}
                            </div>
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <CommentList commentList={commentList} />
                        </Box>

                        <Button variant="outlined" component={LinkBehavior} to={`/`}>
                            Quay lại
                        </Button>
                    </Box>
                )}
            </Container>
        </>
    );
};
