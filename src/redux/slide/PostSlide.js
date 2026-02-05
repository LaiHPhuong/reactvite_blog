import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getEnv } from '../../utils/env';
import axios from 'axios';
import { parseQueryString } from '../../utils/convertQueryString';

// merge vào defaultPostSearchParams ngay khi có location.search(queryString)
const getInitialSearchParams = () => {
    if (typeof window === 'undefined') return defaultPostSearchParams;

    const { search } = window.location;
    if (!search) return defaultPostSearchParams;

    const query = parseQueryString(search);
    if (!query || Object.keys(query).length === 0) {
        return defaultPostSearchParams;
    }

    return {
        ...defaultPostSearchParams,
        ...query,
        //skip: query.skip !== undefined ? Number(query.skip) : defaultPostSearchParams.skip,
        //limit: query.limit !== undefined ? Number(query.limit) : defaultPostSearchParams.limit,
    };
};

export const defaultPostSearchParams = {
    _context: 'default',
    q: '',
    limit: getEnv('VITE_LIMIT'),
    skip: 0,
    //keyword: '',
    //page: 1,
    //limit: 10,
    //sortBy: undefined,
    //order: undefined,
    //filters: {}, // ví dụ: status, authorId
};

export const PostSlide = createSlice({
    name: 'post',
    initialState: {
        data: [],
        total: '',
        skip: '',

        post: {},

        status: 'idle',

        searchParams: getInitialSearchParams(),
    },
    reducers: {
        setSearchParams(state, action) {
            state.searchParams = {
                ...state.searchParams,
                ...action.payload,
            };
        },

        resetSearch(state, action) {
            const nextContext = action?.payload?._context ?? defaultPostSearchParams._context;

            state.searchParams = {
                ...defaultPostSearchParams,
                _context: nextContext,
            };
        },
    },

    extraReducers: (builder) => {
        // danh sách
        builder
            .addCase(getPosts.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.status = 'idle';

                state.data = action.payload.posts;
                state.total = action.payload.total;
                state.skip = action.payload.skip;
            })
            .addCase(getPosts.rejected, (state) => {
                state.status = 'error';
            });

        // chi tiết
        builder
            .addCase(getPost.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.status = 'idle';

                state.post = action.payload;
            })
            .addCase(getPost.rejected, (state) => {
                state.status = 'error';
            });

        // danh sách bài viết theo userId
        builder
            .addCase(getPostsByUserId.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getPostsByUserId.fulfilled, (state, action) => {
                state.status = 'idle';

                state.data = action.payload.posts;
                state.total = action.payload.total;
                state.skip = action.payload.skip;
            })
            .addCase(getPostsByUserId.rejected, (state) => {
                state.status = 'error';
            });

        // danh sách bài viết theo tag
        builder
            .addCase(getPostsByTag.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getPostsByTag.fulfilled, (state, action) => {
                state.status = 'idle';

                state.data = action.payload.posts;
                state.total = action.payload.total;
                state.skip = action.payload.skip;
            })
            .addCase(getPostsByTag.rejected, (state) => {
                state.status = 'error';
            });
    },
});

export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (searchParams = {}, { rejectWithValue }) => {
        // phụ thuộc vào endpoint API để check sao cho phù hợp
        const hasSearch = searchParams.q.trim().length > 0;
        const endpoint = hasSearch ? 'posts/search' : 'posts';

        const { _context, ...apiParams } = searchParams;
        const response = await axios.get(`${getEnv('VITE_SERVER_API')}/${endpoint}`, {
            params: apiParams, // {} | { q } | { q, page, limit, sort }
        });

        // dispatch(getPosts(selectorSearchParams));
        // dispatch(getPosts({ q: 'react' }));
        // dispatch(
        //     getPosts({
        //         q: 'redux',
        //         page: 1,
        //         limit: 10,
        //         sort: 'desc',
        //     })
        // );
        //Axios sẽ tự convert thành: /posts?q=redux&page=1&limit=10&sort=desc

        if (response.status !== 200) {
            return rejectWithValue('Fetching data error');
        }
        const data = await response.data;

        //console.log(data);

        return data;
    }
);

export const getPost = createAsyncThunk('posts/getPost', async ({ id }, { rejectWithValue }) => {
    const response = await axios.get(`${getEnv('VITE_SERVER_API')}/posts/${id}`);
    if (response.status !== 200) {
        return rejectWithValue('Fetching data error');
    }
    const data = await response.data;
    //console.log(data);

    const responseUser = await axios.get(`${getEnv('VITE_SERVER_API')}/users/${data.userId}`);
    if (responseUser.status === 200) {
        const user = await responseUser.data;
        data.user = user;
    }
    //console.log(data);
    return data;
});

export const getPostsByUserId = createAsyncThunk(
    'posts/getPostsByUser',
    async ({ value, searchParams }, { rejectWithValue }) => {
        const { _context, ...apiParams } = searchParams;
        const response = await axios.get(`${getEnv('VITE_SERVER_API')}/users/${value}/posts`, {
            params: apiParams,
        });

        if (response.status !== 200) {
            return rejectWithValue('Fetching data error');
        }

        const data = await response.data;
        //console.log(data);

        return data;
    }
);

export const getPostsByTag = createAsyncThunk(
    'posts/getPostsByTag',
    async ({ value, searchParams }, { rejectWithValue }) => {
        const { _context, ...apiParams } = searchParams;
        const response = await axios.get(`${getEnv('VITE_SERVER_API')}/posts/tag/${value}`, {
            params: apiParams,
        });

        if (response.status !== 200) {
            return rejectWithValue('Fetching data error');
        }

        const data = await response.data;
        //console.log(data);

        return data;
    }
);

// create action
export const { setSearchParams, resetSearch } = PostSlide.actions;

// selector
export const selectorPosts = (state) => state.posts.data;
export const selectorTotalPosts = (state) => state.posts.total;
export const selectorSkipPosts = (state) => state.posts.skip;
export const selectorSearchParams = (state) => state.posts.searchParams;
export const selectorStatus = (state) => state.posts.status;

export const selectorOnePost = (state) => state.posts.post;

export const selectorPostsByUserId = (state) => state.posts.postsByUserId;
