import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router';
import PropTypes from 'prop-types';

import {tmdbFetchConfiguration} from '../actions';

import {Container, Loader, Segment} from 'semantic-ui-react';

import {TopRated, SearchResults} from './MediaList';
import Search from './Search';

import './App.css';

const ConnectedSwitch = connect(({router}) => ({location: router.location}))(Switch);

class App extends Component {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(tmdbFetchConfiguration());
    }
    render() {
        const {ready} = this.props;
        return ready
            ? <Container className='App'>
                    <Segment className='App-header' inverted={true} padded='very'>
                        <Search/>
                    </Segment>
                    <Segment className='App-main' inverted={true} padded='very'>
                        <ConnectedSwitch>
                            <Route exact={true} path='/' component={TopRated}/>
                            <Route path='/search/:query' component={SearchResults}/>
                        </ConnectedSwitch>
                    </Segment>
                </Container>
            : <Loader active={true}/>;
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired
};

function mapStateToProps({tmdbConfiguration}) {
    return {ready: Boolean(tmdbConfiguration)};
}

const connectComponent = connect(mapStateToProps);
export default connectComponent(App);