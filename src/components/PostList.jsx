import PropTypes from 'prop-types';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEnv } from '../utils/env';
import {
    getPosts,
    selectorPosts,
    selectorTotalPosts,
    selectorSkipPosts,
    selectorStatus,
    selectorSearchParams,
    setSearchParams,
    resetSearch,
    defaultPostSearchParams,
    getPostsByUserId,
    getPostsByTag,
} from '../redux/slide/PostSlide';
import { PostItem } from '../components/PostItem';
import { SearchForm } from '../components/SearchForm';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

import { parseQueryString, buildQueryString } from '../utils/convertQueryString';

import { Alert, Box, Container, Divider, Grid, Pagination, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export const PostList = ({ filter, value }) => {
    //console.log(import.meta.env.VITE_API_KEY);

    const listPost = useSelector(selectorPosts);
    const totalPost = useSelector(selectorTotalPosts);
    const skipPost = useSelector(selectorSkipPosts);

    const status = useSelector(selectorStatus);
    const searchParams = useSelector(selectorSearchParams);

    const dispatch = useDispatch();

    const page = Math.ceil(skipPost / getEnv('VITE_LIMIT') + 1);
    const pageCount = Math.ceil(totalPost / getEnv('VITE_LIMIT'));

    const navigate = useNavigate();
    const location = useLocation();
    const didInitRef = useRef(false);
    
    const pathname = location.pathname;
    const prevPathname = useRef(pathname);
    const isSearchReadyRef = useRef(false);
    const justResetRef = useRef(false);
    
    const handleChangePage = (event, value) => {
        //console.log(event, value);

        dispatch(
            setSearchParams({
                skip: (value - 1) * getEnv('VITE_LIMIT'),
            })
        );

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!didInitRef.current) {
        //Kiểm tra xem đã init chưa , false = lần render đầu tiên, true = đã init rồi → bỏ qua toàn bộ logic

        didInitRef.current = true;
        //	Đánh dấu đã init xong
        //→ các render sau không chạy lại đoạn code này
        //→ đảm bảo không dispatch nhiều lần

        if (location.search) {
            const query = parseQueryString(location.search);

            if (Object.keys(query).length > 0) {
                dispatch(setSearchParams(query));

                //console.log(query);
            }
        }
    }

    //resetSearch khi router thay đổi nếu không sẽ bị dính searchParams cũ trước đó
    useEffect(() => {
        //console.log(`current: `, prevPathname.current);
        //console.log(`pathname: `, pathname);
        if (prevPathname.current !== pathname) {
            justResetRef.current = true;   // 🔥 đánh dấu vừa reset
            dispatch(resetSearch());
            prevPathname.current = pathname;
        }
    }, [pathname]);

    useEffect(() => {
        if (justResetRef.current) {
            justResetRef.current = false;
            return;
        }
        
        if (filter === 'user') {
            dispatch(getPostsByUserId({ value, searchParams }));
            document.title = 'Trang danh sách bài viết theo tác giả';
        } else if (filter === 'tag') {
            dispatch(getPostsByTag({ value, searchParams }));
            document.title = 'Trang danh sách bài viết theo tag';
        } else {
            dispatch(getPosts(searchParams));
            document.title = 'Trang chủ';
        }
    }, [dispatch, searchParams]);

    useEffect(() => {
        const queryString = buildQueryString(searchParams, defaultPostSearchParams);

        const newUrl = queryString ? `${location.pathname}?${queryString}` : location.pathname;

        const currentUrl = `${location.pathname}${location.search}`;

        if (newUrl !== currentUrl) {
            navigate(newUrl, { replace: true });
        }
    }, [searchParams]);

    // console.log(listPost);

    // console.log(`filter: `, filter);
    // console.log(`value: `, value);
    return (
        <>
            {/* Bài viết */}
            <Box py={3}>
                {status === 'error' && <Error />}

                {status === 'pending' && <Loading />}

                {status === 'idle' && (
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight={600}>
                            Bài viết mới nhất
                        </Typography>
                        <Divider sx={{ mt: 1, mb: 2 }} />

                        {listPost.length > 0 ? (
                            <>
                                <Grid container spacing={2} mb={3}>
                                    {listPost.map((value, index) => (
                                        <Grid size={3} key={value.id || index}>
                                            <PostItem value={value} />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Pagination
                                    count={pageCount}
                                    variant="outlined"
                                    color="secondary"
                                    siblingCount={3}
                                    page={page}
                                    onChange={handleChangePage}
                                />
                            </>
                        ) : (
                            <Alert severity="warning">Không tìm thấy nội dung chỉ định</Alert>
                        )}
                    </Box>
                )}
            </Box>
        </>
    );
};
PostList.propTypes = {
    filter: PropTypes.string,
    value: PropTypes.string,
};
