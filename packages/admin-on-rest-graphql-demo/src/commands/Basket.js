import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { translate, crudGetMany as crudGetManyAction } from 'admin-on-rest';
import compose from 'recompose/compose';

class Basket extends Component {
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const { record: { basket }, crudGetMany } = this.props;
        crudGetMany('Product', basket.map(item => item.product && item.product.id).filter(v => !!v));
    }
    render() {
        const { record, translate } = this.props;
        const { basket } = record;

        return (
            <Paper style={{ width: '42em', float: 'right' }} zDepth={2}>
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>
                                {translate('resources.Command.fields.basket.reference')}
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{ textAlign: 'right' }}>
                                {translate('resources.Command.fields.basket.unit_price')}
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{ textAlign: 'right' }}>
                                {translate('resources.Command.fields.basket.quantity')}
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{ textAlign: 'right' }}>
                                {translate('resources.Command.fields.basket.total')}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {basket.map(item => item.product && (
                            <TableRow key={item.product.id}>
                                <TableRowColumn>
                                    {item.product.reference}
                                </TableRowColumn>
                                <TableRowColumn style={{ textAlign: 'right' }}>
                                    {item.product.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                </TableRowColumn>
                                <TableRowColumn style={{ textAlign: 'right' }}>
                                    {item.quantity}
                                </TableRowColumn>
                                <TableRowColumn style={{ textAlign: 'right' }}>
                                    {(item.product.price * item.quantity).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                </TableRowColumn>
                            </TableRow>),
                        )}
                        <TableRow>
                            <TableRowColumn colSpan={2} />
                            <TableRowColumn>{translate('resources.Command.fields.basket.sum')}</TableRowColumn>
                            <TableRowColumn style={{ textAlign: 'right' }}>
                                {record.totalExTaxes.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                            </TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn colSpan={2} />
                            <TableRowColumn>{translate('resources.Command.fields.basket.delivery')}</TableRowColumn>
                            <TableRowColumn style={{ textAlign: 'right' }}>
                                {record.deliveryFees.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                            </TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn colSpan={2} />
                            <TableRowColumn>{translate('resources.Command.fields.basket.tax_rate')}</TableRowColumn>
                            <TableRowColumn style={{ textAlign: 'right' }}>
                                {record.taxRate.toLocaleString(undefined, { style: 'percent' })}
                            </TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn colSpan={2} />
                            <TableRowColumn style={{ fontWeight: 'bold' }}>{translate('resources.Command.fields.basket.total')}</TableRowColumn>
                            <TableRowColumn style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                {record.total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                            </TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const mapStateToProps = (state, props) => {
    const { record: { basket } } = props;
    const productIds = basket.map(item => item.product && item.product.id);
    return {
        products: productIds
            .map(productId => state.admin.Product.data[productId])
            .filter(r => typeof r !== 'undefined')
            .reduce((prev, next) => {
                prev[next.id] = next;
                return prev;
            }, {}),
    };
};

const enhance = compose(
    translate,
    connect(mapStateToProps, {
        crudGetMany: crudGetManyAction,
    }),
);

export default enhance(Basket);
