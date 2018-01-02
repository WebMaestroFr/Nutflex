import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {theMovieDB} from '../actions';

import {Divider, Item, List, Loader} from 'semantic-ui-react';

import {Poster, Still} from './Image';

function pad(n, l = 2) {
    n = String(n);
    return n.length >= l
        ? n
        : new Array(l - n.length + 1).join('0') + n;
}

class TvShowSeasonEpisode extends Component {
    render() {
        const {episode_number, name, season_number, still_path, tvShowName} = this.props,
            episodeNumber = pad(episode_number),
            seasonNumber = pad(season_number),
            image = still_path
                ? <Still imagePath={still_path} rounded={true} size='medium'/>
                : null;
        return <List.Item as='a'>
            <List.Content as='h3'>{
                    season_number !== 0
                        ? `s${seasonNumber}e${episodeNumber} - ${name}`
                        : name
                }</List.Content>
        </List.Item>;
    }
}

TvShowSeasonEpisode.propTypes = {
    episode_number: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    season_number: PropTypes.number.isRequired
}

class TvShowSeason extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            episodes: [],
            overview: '',
            ready: false
        };
    }
    componentDidMount() {
        const {tvShowId, season_number} = this.props;
        this._fetch = theMovieDB.fetch(`tv/${tvShowId}/season/${season_number}`);
        this
            ._fetch
            .done(data => this.setState(
                data
                    ? {
                        ready: true,
                        name: data.name,
                        episodes: data.episodes,
                        overview: data.overview
                    }
                    : {
                        ready: true
                    }
            ));
    }
    componentWillUnmount() {
        this
            ._fetch
            .cancel();
    }
    render() {
        const {air_date, poster_path, season_number, tvShowName} = this.props, {name, episodes, overview, ready} = this.state,
            date = air_date !== null
                ? new Date(air_date)
                : null;
        return <Item>
            {
                poster_path
                    ? <Poster as={Item.Image} imagePath={poster_path} rounded={true} size='small'/>
                    : null
            }
            {
                ready
                    ? <Item.Content>
                            {
                                name
                                    ? <Item.Header as='h2'>{name}</Item.Header>
                                    : null
                            }
                            {
                                date !== null && season_number !== 0
                                    ? <Item.Meta>{date.getFullYear()}</Item.Meta>
                                    : null
                            }
                            {
                                overview
                                    ? <Item.Description>{overview}</Item.Description>
                                    : null
                            }
                            {
                                episodes.length
                                    ? <Item.Extra>
                                            <Divider inverted={true}/>
                                            <List divided={true} inverted={true} relaxed={true}>
                                                {
                                                    episodes.map(
                                                        episode => <TvShowSeasonEpisode key={`tv-episode-${episode.id}`} tvShowName={tvShowName} {...episode}/>
                                                    )
                                                }
                                            </List>
                                        </Item.Extra>
                                    : null
                            }
                        </Item.Content>
                    : <Item.Content><Loader active={true} inline='centered'/></Item.Content>
            }
        </Item>;
    }
}

TvShowSeason.propTypes = {
    air_date: PropTypes.string,
    poster_path: PropTypes.string,
    season_number: PropTypes.number.isRequired,
    tvShowId: PropTypes.number.isRequired,
    tvShowName: PropTypes.string.isRequired
}

export class TvShowItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            number_of_seasons: 0,
            overview: '',
            ready: false,
            seasons: []
        };
    }
    componentDidMount() {
        const {id} = this.props;
        this._fetch = theMovieDB.fetch(`tv/${id}`);
        this
            ._fetch
            .done(data => this.setState(
                data
                    ? {
                        number_of_seasons: data.number_of_seasons,
                        overview: data.overview,
                        ready: true,
                        seasons: data.seasons
                    }
                    : {
                        ready: true
                    }
            ));
    }
    componentWillUnmount() {
        this
            ._fetch
            .cancel();
    }
    render() {
        const {id, name, poster_path} = this.props, {number_of_seasons, overview, ready, seasons} = this.state;
        return <Item className='TvShowItem'>
            {
                poster_path
                    ? <Poster as={Item.Image} imagePath={poster_path} rounded={true} size='medium'/>
                    : null
            }
            {
                ready
                    ? <Item.Content>
                            <Item.Header as='h1'>{name}</Item.Header>
                            <Item.Meta>{`${number_of_seasons} Seasons`}</Item.Meta>
                            {
                                overview
                                    ? <Item.Description>{overview}</Item.Description>
                                    : null
                            }
                            {
                                seasons.length
                                    ? <Item.Extra>
                                            <Divider inverted={true} section={true}/>
                                            <Item.Group divided={true} relaxed={true}>
                                                {
                                                    seasons
                                                        .sort(
                                                            (a, b) => a.season_number === 0
                                                                ? 1
                                                                : a.season_number - b.season_number
                                                        )
                                                        .map(
                                                            season => <TvShowSeason key={`tv-season-${season.id}`} tvShowId={id} tvShowName={name} {...season}/>
                                                        )
                                                }
                                            </Item.Group>
                                        </Item.Extra>
                                    : null
                            }
                        </Item.Content>
                    : <Item.Content><Loader active={true} inline='centered'/></Item.Content>
            }
        </Item>;
    }
}

TvShowItem.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    poster_path: PropTypes.string.isRequired
}