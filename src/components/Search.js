import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {tmdbFetchSearch} from '../actions';

import {Container, Input} from 'semantic-ui-react';

import {productName} from '../../package.json';

class Search extends Component {
    render() {
        return <Container as='header' className="Search">
            <Input
                fluid={true}
                icon="search"
                inverted={true}
                loading={this.props.loading}
                onChange={(event, {value}) => this.props.onChange(value)}
                placeholder={productName}
                size="massive"/>
        </Container>;
    }
}

Search.propTypes = {
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

const mapStateToProps = ({router, tmdbSearch}) => {
    return {
        loading: !tmdbSearch.ready
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onChange: query => dispatch(tmdbFetchSearch(query))
    };
};

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(Search);