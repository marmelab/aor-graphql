import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';
import { crudGetManyAccumulate as crudGetManyAccumulateAction } from 'admin-on-rest/lib/actions/accumulateActions';
import linkToRecord from 'admin-on-rest/lib/util/linkToRecord';

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 */
export class ReferenceFields extends Component {
    componentDidMount() {
        this.fetchReference(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReference(nextProps);
        }
    }

    fetchReference(props) {
        const source = get(props.record, props.source);
        if (source !== null && typeof source !== 'undefined') {
            this.props.crudGetManyAccumulate(props.reference, [source]);
        }
    }

    render() {
        const { reference, referenceRecord, basePath, allowEmpty, children } = this.props;

        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        const childrenElements = Children.map(children, child => React.cloneElement(child, {
            record: referenceRecord,
            resource: reference,
            allowEmpty,
            basePath,
            translateChoice: false,
        }));

        return <div>{childrenElements}</div>;
    }
}

ReferenceFields.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    source: PropTypes.string.isRequired,
    linkType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired,
};

ReferenceFields.defaultProps = {
    addLabel: true,
    referenceRecord: null,
    record: {},
    allowEmpty: false,
    linkType: 'edit',
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[get(props.record, props.source)],
    };
}

export default connect(mapStateToProps, {
    crudGetManyAccumulate: crudGetManyAccumulateAction,
})(ReferenceFields);
