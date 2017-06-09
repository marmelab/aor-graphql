import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { translate } from 'admin-on-rest';

const style = { flex: 1 };

export default translate(({ orders = [], customers = {}, translate }) => (
    <Card style={style}>
        <CardTitle title={translate('pos.dashboard.pending_orders')} />
        <List>
            {orders.map(record =>
                <ListItem
                    key={record.id}
                    href={`#/Command/${record.id}`}
                    primaryText={new Date(record.date).toLocaleString('en-GB')}
                    secondaryText={
                        <p>
                            {translate('pos.dashboard.order.items', {
                                smart_count: record.basketIds.length,
                                nb_items: record.basketIds.length,
                                customer_name: customers[record['customer.id']] ? `${customers[record['customer.id']].firstName} ${customers[record['customer.id']].lastName}` : '',
                            })}
                        </p>
                    }
                    rightAvatar={<strong>{record.total}$</strong>}
                    leftAvatar={customers[record['customer.id']] ? <Avatar src={`${customers[record['customer.id']].avatar}?size=32x32`} /> : <Avatar />}
                />,
            )}
        </List>
    </Card>
));
