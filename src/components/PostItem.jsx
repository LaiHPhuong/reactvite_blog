import PropTypes from 'prop-types';

import { Button, Card, CardActions, CardContent, CardMedia, Link, Typography } from '@mui/material';
import { LinkBehavior } from './LinkBehavior';

export const PostItem = ({ value }) => {
    return (
        <>
            <Card sx={{ maxWidth: '100%' }}>
                <Link component={LinkBehavior} to={`/post/${value.id}`}>
                    <CardMedia
                        sx={{ height: 200 }}
                        image="https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE"
                        title={value.title}
                    />
                </Link>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <Link
                            color="inherit"
                            style={{ textDecoration: 'none' }}
                            component={LinkBehavior}
                            to={`/post/${value.id}`}
                        >
                            {value.id}-{value.title}
                        </Link>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="outlined"
                        component={LinkBehavior}
                        to={`/post/${value.id}`}
                    >
                        Xem chi tiết
                    </Button>
                </CardActions>
            </Card>
        </>
    );
};
PostItem.protoTypes = {
    value: PropTypes.object,
};
