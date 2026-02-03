import { configureStore } from '@reduxjs/toolkit';
import { PostSlide } from './slide/PostSlide';
import { UserSlide } from './slide/UserSlide';

export const store = configureStore({
    reducer: {
        posts: PostSlide.reducer,
        users: UserSlide.reducer,
    },
});
