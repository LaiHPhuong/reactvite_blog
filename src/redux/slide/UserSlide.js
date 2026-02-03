import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { getEnv } from '../../utils/env';

export const UserSlide = createSlice({
    name: 'user',
    initialState: {
        data: [],
        user: [],

        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'idle';

                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state) => {
                state.status = 'error';
            });
    },
});

export const getUser = createAsyncThunk('user/getUser', async (id, { rejectWithValue }) => {
    const response = await axios.get(`${getEnv('VITE_SERVER_API')}/users/${id}`);
    if (response.status !== 200) {
        return rejectWithValue('Fetching data error');
    }

    const data = await response.data;
    //console.log(data);

    return data;
});

//selector
export const selectorStatus = (state) => state.users.status;
export const selectorOneUser = (state) => state.users.user;
