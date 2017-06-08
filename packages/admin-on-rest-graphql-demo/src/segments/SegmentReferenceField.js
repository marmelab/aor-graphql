import React from 'react';
import { translate, ReferenceArrayField, SingleFieldList, ChipField } from 'admin-on-rest';

const SegmentReferenceField = ({ translate, ...props }) => (
    <ReferenceArrayField source="groups.id" reference="Segment" {...props}>
        <SingleFieldList>
            <ChipField source="name" />
        </SingleFieldList>
    </ReferenceArrayField>
);
SegmentReferenceField.defaultProps = {
    label: 'resources.Customer.fields.segments',
    source: 'groups.id',
    addLabel: true,
};

export default translate(SegmentReferenceField);
