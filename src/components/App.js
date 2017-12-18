import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import {tmdbFetchConfiguration, tmdbFetchTopRated} from '../actions';

import {Container, Loader, Segment} from 'semantic-ui-react';

import {Featured, SearchResults} from './MediaList';
import Search from './Search';

import './App.css';

class App extends Component {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(tmdbFetchConfiguration());
        dispatch(tmdbFetchTopRated());
    }
    render() {
        const {query, ready} = this.props;
        return ready
            ? <Container className='App'>
                    <Segment className='App-header' inverted={true} padded='very'>
                        <Search/>
                    </Segment>
                    <Segment className='App-main' inverted={true} padded='very'>
                        <Route exact={true} path='/'>
                            {
                                query === ''
                                    ? <Featured/>
                                    : <SearchResults/>
                            }
                        </Route>
                    </Segment>
                </Container>
            : <Loader active={true}/>;
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    ready: PropTypes.bool.isRequired
};

function mapStateToProps({tmdbConfiguration, tmdbSearch}) {
    return {query: tmdbSearch.query, ready: Boolean(tmdbConfiguration)};
}

const connectComponent = connect(mapStateToProps);
export default withRouter(connectComponent(App));