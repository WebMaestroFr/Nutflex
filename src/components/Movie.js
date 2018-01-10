import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {theMovieDB} from '../actions';

import {Item} from 'semantic-ui-react';

import {Backdrop, Poster} from './Image';

export class MovieItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            directors: []
        };
    }
    componentDidMount() {
        const {id} = this.props;
        this._fetch = theMovieDB.get(`movie/${id}/credits`);
        this
            ._fetch
            .done(
                data => data
                    ? this.setState({
                        directors: data
                            .crew
                            .filter(credit => credit.job === 'Director')
                    })
                    : null
            );
    }
    componentWillUnmount() {
        this
            ._fetch
            .cancel();
    }
    render() {
        const {backdrop_path, overview, poster_path, release_date, title} = this.props, {directors} = this.state,
            date = new Date(release_date),
            fullYear = date.getFullYear(),
            poster = poster_path
                ? <Poster as={Item.Image} imagePath={poster_path} rounded={true} size='medium'/>
                : null;
        return <Item as='a'>
            {poster}
            <Item.Content>
                <Item.Header as='h1'>{title}</Item.Header>
                <Item.Meta as='h2'>{fullYear}</Item.Meta>
                {
                    directors.length
                        ? <Item.Header as='h3'>{
                                    directors
                                        .map(d => d.name)
                                        .join(', ')
                                }</Item.Header>
                        : null
                }
                {
                    backdrop_path
                        ? <Item.Extra>
                                <Backdrop imagePath={backdrop_path} rounded={true} size='huge'/>
                            </Item.Extra>
                        : null
                }
                <Item.Description>{overview}</Item.Description>
            </Item.Content>
        </Item>;
    }
}

MovieItem.propTypes = {
    backdrop_path: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    overview: PropTypes.string.isRequired,
    poster_path: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};