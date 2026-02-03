import { FormControl, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchParams, resetSearch } from '../redux/slide/PostSlide';
import { useSearchParams } from 'react-router-dom';

export const SearchForm = () => {
    const [searchParams] = useSearchParams();

    const initialKeyword = searchParams.get('q') ?? '';
    const [keyword, setKeyword] = useState(initialKeyword);

    const [showClearIcon, setShowClearIcon] = useState(initialKeyword ? 'flex' : 'none');

    const isUserTypingRef = useRef(false); //DÙNG CỜ isUserTyping (chìa khóa 🔑)

    const handleChange = (event) => {
        isUserTypingRef.current = true; //Chỉ set cờ khi user THỰC SỰ gõ

        setShowClearIcon(event.target.value === '' ? 'none' : 'flex');
        setKeyword(event.target.value);
    };

    const handleClick = () => {
        isUserTypingRef.current = true;
        dispatch(resetSearch());
        setKeyword('');
    };

    const dispatch = useDispatch();

    //Effect sync URL / dispatch CHỈ chạy khi user gõ
    useEffect(() => {
        if (!isUserTypingRef.current) return; // CỜ false => return

        // CỜ true chạy
        // phải có nếu không nó sẽ re-render 2 lần cho lần đầu
        if (keyword.trim() === '') {
            //setKeyword('');
            dispatch(resetSearch());
            return;
        }

        const timer = setTimeout(() => {
            dispatch(setSearchParams({ q: keyword, skip: 0 }));
        }, 1000);

        return () => clearTimeout(timer); // cleanup reset timer trước
    }, [dispatch, keyword]);

    /*
    CẤM CỜ (User Intent Flag)

    1. Khởi tạo
        isUserTypingRef.current = false

    2. Component mount (load / reload / share link)
        - keyword được khởi tạo từ URL (?q=abc) hoặc '' nếu không có query
        - Đây là SYSTEM INIT, không phải hành động của user

    3. useEffect chạy sau render
        - kkeyword đã có giá trị (lấy từ queryString hoặc rỗng)
        - isUserTypingRef.current === false (chưa có hành động từ user)
        => RETURN, KHÔNG dispatch / KHÔNG call API

    4. Khi USER thao tác (gõ, xoá, click clear)
        - Set: isUserTypingRef.current = true
        - setKeyword(newValue)

    5. useEffect chạy lại
        - keyword thay đổi
        - isUserTypingRef.current === true
        => ALLOW dispatch / call API
    */

    return (
        <>
            <FormControl style={{ margin: 0, width: '400px' }}>
                {/* <TextField
                    size="small"
                    variant="outlined"
                    onChange={handleChange}
                    placeholder="Nhập từ khóa tìm kiếm"
                    value={keyword}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                style={{ display: showClearIcon, cursor: 'pointer' }}
                                onClick={handleClick}
                            >
                                <ClearIcon />
                            </InputAdornment>
                        ),
                    }}
                /> */}
                <TextField
                    size="small"
                    value={keyword}
                    onChange={handleChange}
                    placeholder="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: keyword && (
                            <InputAdornment
                                position="end"
                                style={{ display: showClearIcon, cursor: 'pointer' }}
                                sx={{ cursor: 'pointer' }}
                                onClick={handleClick}
                            >
                                <ClearIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
        </>
    );
};
