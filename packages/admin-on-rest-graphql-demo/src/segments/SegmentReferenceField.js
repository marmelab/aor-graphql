import React from 'react';
import { translate, ReferenceArrayField, SingleFieldList } from 'admin-on-rest';

import Chip from 'material-ui/Chip';

const NameField = translate(({ translate: t, source, record = {} }) => (
    <Chip>{t(`resources.Segment.data.${record[source]}`)}</Chip>
));

const SegmentReferenceField = props => (
    <ReferenceArrayField source="groupsIds" reference="Segment" {...props}>
        <SingleFieldList>
            <NameField source="name" />
        </SingleFieldList>
    </ReferenceArrayField>
);

SegmentReferenceField.defaultProps = {
    label: 'resources.Customer.fields.groups',
    source: 'groupsIds',
    addLabel: true,
};

export default SegmentReferenceField;
