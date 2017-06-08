import React from 'react';
import { translate, SingleFieldList } from 'admin-on-rest';
import ReferenceArrayField from '../admin-on-rest-overrides/ReferenceArrayField';

import Chip from 'material-ui/Chip';

const NameField = translate(({ translate: t, source, record = {} }) => (
    <Chip>{t(`resources.Segment.data.${record[source]}`)}</Chip>
));

const SegmentReferenceField = props => (
    <ReferenceArrayField source="groups.id" reference="Segment" {...props}>
        <SingleFieldList>
            <NameField source="name" />
        </SingleFieldList>
    </ReferenceArrayField>
);
SegmentReferenceField.defaultProps = {
    label: 'resources.Customer.fields.groups',
    source: 'groups.id',
    addLabel: true,
};

export default SegmentReferenceField;
