import API from './api';
import config from './config';

import {replace} from 'react-router-redux';
export function updateLocation(pathname) {
    return dispatch => dispatch(replace(pathname));
}

export const theMovieDB = new API('https://api.themoviedb.org/3', {
    api_key: config.theMovieDBAPIKey,
    include_adult: false,
    language: navigator.language || navigator.userLanguage
}, 1000 / 4);

export const TMDB_CONFIGURATION = 'TMDB_CONFIGURATION';
export const TMDB_SEARCH_QUERY = 'TMDB_SEARCH_QUERY';
export const TMDB_SEARCH_RESULTS = 'TMDB_SEARCH_RESULTS';
export const TMDB_TOP_RATED = 'TMDB_TOP_RATED';

export function tmdbFetchConfiguration() {
    return dispatch => theMovieDB
        .get('configuration', {}, 24 * 60 * 60)
        .done(configuration => dispatch({type: TMDB_CONFIGURATION, configuration}));
}

let searchRequest = null;
export function tmdbFetchSearch(search) {
    if (searchRequest) {
        searchRequest.cancel();
    }
    return dispatch => {
        if (search === '') {
            searchRequest = null;
            dispatch(updateLocation('/'));
            dispatch({type: TMDB_SEARCH_QUERY, query: null});
        } else {
            const param = search
                    .trim()
                    .replace(/\s+/g, '-')
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, ''),
                query = param.replace(/-/g, ' ');
            searchRequest = theMovieDB.get(`search/multi`, {
                query
            }, 24 * 60 * 60);
            searchRequest.done(data => dispatch({
                type: TMDB_SEARCH_RESULTS,
                query,
                results: data
                    ? data.results
                    : []
            }));
            dispatch(updateLocation(`/search/${param}`));
            dispatch({type: TMDB_SEARCH_QUERY, query});
        }
    };
}

export function tmdbFetchTopRated() {
    const fetchMovies = theMovieDB
            .get(`movie/top_rated`, {}, 12 * 60 * 60)
            .done(data => data.results.map(movie => {
                movie.media_type = 'movie';
                return movie;
            })),
        fetchTvShows = theMovieDB
            .get(`tv/top_rated`, {}, 12 * 60 * 60)
            .done(data => data.results.map(tvShow => {
                tvShow.media_type = 'tv';
                return tvShow;
            }));
    return dispatch => Promise
        .all([fetchMovies, fetchTvShows])
        .then(results => dispatch({
            type: TMDB_TOP_RATED,
            results: [].concat(...results)
        }));
}