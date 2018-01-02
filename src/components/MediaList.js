import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {tmdbFetchSearch, tmdbFetchTopRated} from '../actions';

import {Item, Loader} from 'semantic-ui-react';

import {MovieItem} from './Movie';
import {PersonItem} from './Person';
import {TvShowItem} from './TvShow';

export default class MediaList extends Component {
    render() {
        const {ready, results} = this.props;
        return ready
            ? <Item.Group className='MediaList' divided={true} relaxed='very'>
                    {
                        results.map(result => {
                            const key = `${result.media_type}-${result.id}`;
                            switch (result.media_type) {
                                case 'movie':
                                    return <MovieItem key={key} {...result}/>;
                                case 'person':
                                    return <PersonItem key={key} {...result}/>;
                                case 'tv':
                                    return <TvShowItem key={key} {...result}/>;
                                default:
                                    return null;
                            }
                        })
                    }
                </Item.Group>
            : <Loader active={true}/>;
    }
}

MediaList.propTypes = {
    ready: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired
};

class TopRatedMediaList extends MediaList {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(tmdbFetchTopRated());
    }
}

class SearchResultsMediaList extends MediaList {
    componentDidMount() {
        const {dispatch, match} = this.props;
        dispatch(tmdbFetchSearch(match.params.query.replace(/-/g, ' ')));
    }
}

function mapTopRatedToProps({tmdbTopRated}) {
    return tmdbTopRated;
}

function mapSearchResultsToProps({tmdbSearch}) {
    return tmdbSearch;
}

const connectTopRated = connect(mapTopRatedToProps),
    connectSearchResults = connect(mapSearchResultsToProps);
export const TopRated = connectTopRated(TopRatedMediaList),
    SearchResults = connectSearchResults(SearchResultsMediaList);