import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const LinkBehavior = forwardRef(function Link(props, ref) {
    return <RouterLink ref={ref} to={props.to} {...props} role={undefined} />;
});
