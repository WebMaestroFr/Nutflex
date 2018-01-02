import {TMDB_CONFIGURATION, TMDB_SEARCH_QUERY, TMDB_SEARCH_RESULTS, TMDB_TOP_RATED} from './actions';

const completeMedia = result => {
    switch (result.media_type) {
        case 'movie':
            return result.backdrop_path && result.overview && result.poster_path && result.release_date && result.title;
        case 'person':
            result.known_for = result
                .known_for
                .filter(completeMedia);
            return result.name && result.profile_path && result.known_for.length;
        case 'tv':
            return result.id && result.name && result.poster_path;
        default:
            return false;
    }
};

export function tmdbConfiguration(state = null, action) {
    switch (action.type) {
        case TMDB_CONFIGURATION:
            return action.configuration;
        default:
            return state;
    }
}

export function tmdbSearch(state = {
    query: '',
    ready: true,
    results: []
}, action) {
    switch (action.type) {
        case TMDB_SEARCH_QUERY:
            return {
                query: action.query,
                ready: !action.query,
                results: []
            };
        case TMDB_SEARCH_RESULTS:
            if (action.query === state.query) {
                return {
                    query: state.query, ready: true, results: action
                        .results
                        .filter(completeMedia)
                };
            }
            return state;
        default:
            return state;
    }
}

export function tmdbTopRated(state = {
    ready: false,
    results: []
}, action) {
    switch (action.type) {
        case TMDB_TOP_RATED:
            return {
                ready: true,
                results: action
                    .results
                    .filter(completeMedia)
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 12)
            };
        default:
            return state;
    }
}

export default {tmdbConfiguration, tmdbSearch, tmdbTopRated};