import React from 'react';
import Icon from 'material-ui/svg-icons/action/stars';

const style = { opacity: 0.87, width: 20, height: 20 };

const StarRatingField = ({ record }) => (
    <span>
        {Array(record.rating).fill(true).map((_, i) => <Icon key={i} style={style} />)}
    </span>
);

StarRatingField.defaultProps = {
    source: 'rating',
    addLabel: true,
};

export default StarRatingField;
