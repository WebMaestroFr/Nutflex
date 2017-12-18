import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Item, Loader} from 'semantic-ui-react';

import {Backdrop, Poster} from './Image';

export class MovieItem extends Component {
    render() {
        const {backdrop_path, overview, poster_path, release_date, title} = this.props,
            date = new Date(release_date);
        return <Item>
            {
                poster_path
                    ? <Poster as={Item.Image} imagePath={poster_path} rounded={true} size='medium'/>
                    : null
            }
            <Item.Content>
                <Item.Header as='h1'>{title}</Item.Header>
                <Item.Meta>{date.getFullYear()}</Item.Meta>
                {
                    backdrop_path
                        ? <Item.Extra><Backdrop imagePath={backdrop_path} rounded={true} size='huge'/></Item.Extra>
                        : <Loader active={true}/>
                }
                <Item.Description>{overview}</Item.Description>
            </Item.Content>
        </Item>;
    }
}

MovieItem.propTypes = {
    backdrop_path: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    poster_path: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};