import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, DateField, TextField, EditButton, DisabledInput, TextInput, LongTextInput, DateInput } from 'admin-on-rest';
import BookIcon from 'material-ui/svg-icons/action/book';
export const BoardMemberIcon = BookIcon;

export const BoardMemberList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EditButton basePath="/BoardMember" />
        </Datagrid>
    </List>
);

const BoardMemberTitle = ({ record }) => {
    return <span>BoardMember {record ? `"${record.body}"` : ''}</span>;
};

export const BoardMemberEdit = (props) => (
    <Edit title={<BoardMemberTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <LongTextInput source="name" />
        </SimpleForm>
    </Edit>
);

export const BoardMemberCreate = (props) => (
    <Create title="Create a BoardMember" {...props}>
        <SimpleForm>
            <LongTextInput source="name" />
        </SimpleForm>
    </Create>
);
