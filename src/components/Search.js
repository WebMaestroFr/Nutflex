import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {tmdbFetchSearch} from '../actions';

import {Container, Input} from 'semantic-ui-react';

class Header extends Component {
    render() {
        return <Container as='header' className="Header">
            <Input
                fluid={true}
                icon="search"
                inverted={true}
                loading={this.props.loading}
                onChange={this.props.onChange}
                placeholder="Nutflex"
                size="massive"/>
        </Container>;
    }
}

Header.propTypes = {
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        loading: !state.tmdbSearch.ready
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onChange: (event, data) => dispatch(tmdbFetchSearch(data.value))
    };
};

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(Header);