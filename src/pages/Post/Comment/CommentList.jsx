import PropTypes from 'prop-types';

import { Paper } from '@mui/material';
import { CommentItem } from './CommentItem';

export const CommentList = ({ commentList }) => {
    return (
        <>
            <h1>Comments</h1>
            <Paper style={{ padding: '40px 20px' }}>
                {commentList?.map((value, index) => (
                    <CommentItem key={value.id || index} comment={value} />
                ))}
            </Paper>
        </>
    );
};

CommentList.propTypes = {
    commentList: PropTypes.array,
};
