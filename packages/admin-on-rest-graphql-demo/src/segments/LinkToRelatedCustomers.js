import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { translate } from 'admin-on-rest';
import { stringify } from 'query-string';

import { VisitorIcon } from '../visitors';

const LinkToRelatedCustomers = ({ record, translate }) => (
    <FlatButton
        primary
        label={translate('resources.Segment.fields.customers')}
        icon={<VisitorIcon />}
        containerElement={<Link
            to={{
                pathname: '/Customer',
                search: stringify({ filter: JSON.stringify({ 'groups.id': record.id }) }),
            }}
        />}
    />
);

export default translate(LinkToRelatedCustomers);
