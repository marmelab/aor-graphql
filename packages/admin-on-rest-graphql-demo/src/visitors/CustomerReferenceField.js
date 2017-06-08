import React from 'react';
import { ReferenceField } from 'admin-on-rest';

import FullNameField from './FullNameField';

const CustomerReferenceField = props => (
    <ReferenceField source="customer.id" reference="Customer" {...props}>
        <FullNameField />
    </ReferenceField>
);
CustomerReferenceField.defaultProps = {
    source: 'customer.id',
    addLabel: true,
};

export default CustomerReferenceField;
