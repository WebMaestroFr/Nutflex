import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Divider, Item} from 'semantic-ui-react';

import MediaList from './MediaList';
import {Profile} from './Image';

export class PersonItem extends Component {
    render() {
        const {known_for, name, profile_path} = this.props;
        return <Item>
            <Profile as={Item.Image} imagePath={profile_path} rounded={true} size='small'/>
            <Item.Content>
                <Item.Header as='h1'>{name}</Item.Header>
                {
                    known_for.length
                        ? <Item.Extra>
                                <Divider inverted={true}/>
                                <MediaList results={known_for}/>
                            </Item.Extra>
                        : null
                }
            </Item.Content>
        </Item>;
    }
}

PersonItem.propTypes = {
    known_for: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    profile_path: PropTypes.string.isRequired
}