import React from 'react';
import AvatarField from './AvatarField';
import pure from 'recompose/pure';

const FullNameField = ({ record = {}, size = 25 }) => <span>
    <AvatarField record={record} size={size} />
    <span style={{ display: 'inline-block', width: size / 3 }}>&nbsp;</span>
    {record.firstName} {record.lastName}
</span>;


const PureFullNameField = pure(FullNameField);

PureFullNameField.defaultProps = {
    source: 'lastName',
    label: 'resources.Customer.fields.name',
};

export default PureFullNameField;
