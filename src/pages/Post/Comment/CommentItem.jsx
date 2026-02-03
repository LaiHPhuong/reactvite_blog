import PropTypes from 'prop-types';

import { Divider, Avatar, Grid } from '@mui/material';

export const CommentItem = ({ comment }) => {
    return (
        <>
            <Grid container wrap="nowrap" spacing={2} alignItems="flex-start" key={comment.id}>
                {/* Avatar column */}
                <Grid item>
                    <Avatar
                        alt="Remy Sharp"
                        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                        sx={{ width: 56, height: 56 }}
                    />
                </Grid>

                {/* Content column */}
                <Grid justifyContent="left" item xs zeroMinWidth>
                    <h4 style={{ margin: 0, textAlign: 'left' }}>{comment.user.username}</h4>
                    <p style={{ margin: '4px 0', textAlign: 'left' }}>{comment.body}</p>
                    <p style={{ margin: 0, color: 'gray', textAlign: 'left' }}>
                        posted 1 minute ago
                    </p>
                </Grid>
            </Grid>

            <Divider variant="fullWidth" style={{ margin: '30px 0' }} />
        </>
    );
};

CommentItem.propTypes = {
    comment: PropTypes.object,
};
