import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Image} from 'semantic-ui-react';

class _Image extends Component {
    render() {
        const {
            baseUrl,
            dispatch,
            imagePath,
            imageSize,
            ...props
        } = this.props;
        return <Image className='Image' src={`${baseUrl}/${imageSize}${imagePath}`} {...props}/>;
    }
}

_Image.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    imageSize: PropTypes.string.isRequired
};

function mapImageStateToProps({tmdbConfiguration}) {
    return {baseUrl: tmdbConfiguration.images.secure_base_url};
}

function mapBackdropStateToProps({
    tmdbConfiguration
}, {
    size,
    ...props
}) {
    let imageSize;
    switch (size) {
        case 'mini':
        case 'tiny':
        case 'small':
        case 'medium':
            // 35px, 80px, 150px, 300px => w300
            imageSize = tmdbConfiguration
                .images
                .backdrop_sizes[0];
            break;
        case 'large':
        case 'big':
            // 450px, 600px => w780
            imageSize = tmdbConfiguration
                .images
                .backdrop_sizes[1];
            break;
        case 'huge':
        case 'massive':
            // 800px, 960px => w1280
            imageSize = tmdbConfiguration
                .images
                .backdrop_sizes[2];
            break;
        default:
            // original
            imageSize = tmdbConfiguration
                .images
                .backdrop_sizes[3];
    }
    return {
        imageSize,
        size,
        ...props
    };
}

function mapPosterStateToProps({
    tmdbConfiguration
}, {
    size,
    ...props
}) {
    let imageSize;
    switch (size) {
        case 'mini':
        case 'tiny':
            // 35px, 80px => w92
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[0];
            break;
        case 'small':
            // 150px => w154
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[1];
            break;
        case 'medium':
            // 300px => w342
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[3];
            break;
        case 'large':
            // 450px => w500
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[4];
            break;
        case 'big':
            // 600px => w780
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[5];
            break;
        case 'huge':
        case 'massive':
        default:
            // 800px, 960px => original
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[6];
    }
    return {
        imageSize,
        size,
        ...props
    };
}

function mapProfileStateToProps({
    tmdbConfiguration
}, {
    size,
    ...props
}) {
    let imageSize;
    switch (size) {
        case 'mini':
            // 35px => w45
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[0];
            break;
        case 'tiny':
        case 'small':
            // 80px, 150px => w185
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[1];
            break;
        case 'medium':
        case 'large':
        case 'big':
        case 'huge':
        case 'massive':
        default:
            // 300px, 450px, 600px, 800px, 960px => original
            imageSize = tmdbConfiguration
                .images
                .poster_sizes[3];
    }
    return {
        imageSize,
        size,
        ...props
    };
}

const connectImage = connect(mapImageStateToProps),
    connectBackdrop = connect(mapBackdropStateToProps),
    connectPoster = connect(mapPosterStateToProps),
    connectProfile = connect(mapProfileStateToProps),
    ImageComponent = connectImage(_Image);

export const Backdrop = connectBackdrop(ImageComponent),
    Poster = connectPoster(ImageComponent),
    Profile = connectProfile(ImageComponent);

Backdrop.propTypes = Poster.propTypes = Profile.propTypes = {
    imagePath: PropTypes.string.isRequired,
    size: PropTypes.oneOf([
        'mini',
        'tiny',
        'small',
        'medium',
        'large',
        'big',
        'huge',
        'massive'
    ])
};

Backdrop.defaultProps = Poster.defaultProps = Profile.defaultProps = {
    size: 'medium'
};

export default ImageComponent;