import React from 'react';
import {
    translate,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    Delete,
    Edit,
    Filter,
    FormTab,
    List,
    LongTextInput,
    NullableBooleanInput,
    NumberField,
    ReferenceManyField,
    TabbedForm,
    TextField,
    TextInput,
    ReferenceArrayInput,
    SelectArrayInput,
} from 'admin-on-rest';
import Icon from 'material-ui/svg-icons/social/person';

import EditButton from '../buttons/EditButton';
import NbItemsField from '../commands/NbItemsField';
import ProductReferenceField from '../products/ProductReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import FullNameField from './FullNameField';
import SegmentReferenceField from '../segments/SegmentReferenceField';

export const VisitorIcon = Icon;

const VisitorFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <DateInput source="lastSeen_gte" label="Last seen" />
        <NullableBooleanInput source="hasOrdered" label="Has ordered" />
        <NullableBooleanInput source="hasNewsletter" label="Has Newsletter" defaultValue />
        <ReferenceArrayInput source="groups.id" reference="Segment" label="resources.Customer.fields.groups">
            <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
    </Filter>
);

const colored = WrappedComponent => props => props.record[props.source] > 500 ?
    <span style={{ color: 'red' }}><WrappedComponent {...props} /></span> :
    <WrappedComponent {...props} />;

const ColoredNumberField = colored(NumberField);
ColoredNumberField.defaultProps = NumberField.defaultProps;

export const VisitorList = props => (
    <List {...props} filters={<VisitorFilter />} sort={{ field: 'lastSeen', order: 'DESC' }} perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <FullNameField />
            <DateField source="lastSeen" type="date" />
            <NumberField source="nbCommands" label="resources.Customer.fields.commands" style={{ color: 'purple' }} />
            <ColoredNumberField source="totalSpent" options={{ style: 'currency', currency: 'USD' }} />
            <DateField source="latestPurchase" showTime />
            <BooleanField source="hasNewsletter" label="News" />
            <SegmentReferenceField />
            <EditButton />
        </Datagrid>
    </List>
);

const VisitorTitle = ({ record }) => record ? <FullNameField record={record} size={32} /> : null;

export const VisitorEdit = props => (
    <Edit title={<VisitorTitle />} {...props}>
        <TabbedForm>
            <FormTab label="resources.Customer.tabs.identity">
                <TextInput source="firstName" style={{ display: 'inline-block' }} />
                <TextInput source="lastName" style={{ display: 'inline-block', marginLeft: 32 }} />
                <TextInput type="email" source="email" validation={{ email: true }} options={{ fullWidth: true }} style={{ width: 544 }} />
                <DateInput source="birthday" />
            </FormTab>
            <FormTab label="resources.Customer.tabs.address">
                <LongTextInput source="address" style={{ maxWidth: 544 }} />
                <TextInput source="zipcode" style={{ display: 'inline-block' }} />
                <TextInput source="city" style={{ display: 'inline-block', marginLeft: 32 }} />
            </FormTab>
            <FormTab label="resources.Customer.tabs.orders">
                <ReferenceManyField addLabel={false} reference="Command" target="customer.id">
                    <Datagrid>
                        <DateField source="date" />
                        <TextField source="reference" />
                        <NbItemsField />
                        <NumberField source="total" options={{ style: 'currency', currency: 'USD' }} />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="resources.Customer.tabs.reviews">
                <ReferenceManyField addLabel={false} reference="Review" target="customer.id">
                    <Datagrid filter={{ status: 'approved' }}>
                        <DateField source="date" />
                        <ProductReferenceField />
                        <StarRatingField />
                        <TextField source="comment" style={{ maxWidth: '20em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                        <EditButton style={{ padding: 0 }} />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="resources.Customer.tabs.stats">
                <SegmentReferenceField />
                <NullableBooleanInput source="hasNewsletter" />
                <DateField source="firstSeen" style={{ width: 128, display: 'inline-block' }} />
                <DateField source="latestPurchase" style={{ width: 128, display: 'inline-block' }} />
                <DateField source="lastSeen" style={{ width: 128, display: 'inline-block' }} />
            </FormTab>
        </TabbedForm>
    </Edit>
);

const VisitorDeleteTitle = translate(({ record, translate }) => <span>
    {translate('resources.Customer.page.delete')}&nbsp;
    {record && <img src={`${record.avatar}?size=25x25`} width="25" alt={`${record.firstName} ${record.lastName}`} />}
    {record && `${record.firstName} ${record.lastName}`}
</span>);

export const VisitorDelete = props => <Delete {...props} title={<VisitorDeleteTitle />} />;
