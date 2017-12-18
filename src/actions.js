import API from './api';
import config from './config';

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
        .fetch('configuration')
        .done(configuration => dispatch({type: TMDB_CONFIGURATION, configuration}));
}

export function tmdbFetchSearch(query) {
    return dispatch => {
        dispatch({type: TMDB_SEARCH_QUERY, query});
        return query
            ? theMovieDB
                .fetch(`search/multi`, {
                    query
                }, 4 * 60 * 60, true)
                .done(data => dispatch({
                    type: TMDB_SEARCH_RESULTS,
                    query,
                    results: data
                        ? data.results
                        : []
                }))
            : null;
    };
}

export function tmdbFetchTopRated() {
    const results = {
        movies: null,
        tvShows: null
    };
    return dispatch => {
        const dispatchIfReady = () => results.movies && results.tvShows
            ? dispatch({
                type: TMDB_TOP_RATED,
                ...results
            })
            : null;
        theMovieDB
            .fetch(`movie/top_rated`)
            .done(data => {
                results.movies = data.results;
                return dispatchIfReady();
            });
        theMovieDB
            .fetch(`tv/top_rated`)
            .done(data => {
                results.tvShows = data.results;
                return dispatchIfReady();
            });
    };
}