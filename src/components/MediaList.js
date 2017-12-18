import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Item, Loader} from 'semantic-ui-react';

import {MovieItem} from './Movie';
import {PersonItem} from './Person';
import {TvShowItem} from './TvShow';

export default class MediaList extends Component {
    render() {
        const {ready, results} = this.props;
        return ready
            ? <Item.Group className='MediaList' divided={true} relaxed='very'>{
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
                    }</Item.Group>
            : <Loader active={true}/>;
    }
}

MediaList.propTypes = {
    ready: PropTypes.bool,
    results: PropTypes.array.isRequired
};

MediaList.defaultProps = {
    ready: true
};

function mapFeaturedToProps({tmdbTopRated}) {
    return {
        ready: tmdbTopRated.ready,
        results: tmdbTopRated
            .results
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 12)
    };
}

function mapSearchToProps({tmdbSearch}) {
    return {ready: tmdbSearch.ready, results: tmdbSearch.results};
}

const connectFeatured = connect(mapFeaturedToProps),
    connectSearch = connect(mapSearchToProps);
export const Featured = connectFeatured(MediaList),
    SearchResults = connectSearch(MediaList);