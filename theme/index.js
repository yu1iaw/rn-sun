export const theme = {
    bgWhite: (opacity) => `rgba(255, 255, 255, ${opacity})`
}

export const weatherImages = (condition) => {
    switch(condition) {
        case 'Partly cloudy': 
            return require('../assets/images/partlycloudy.png');
        case 'Moderate rain':
            return require('../assets/images/moderaterain.png');
        case 'Patchy rain possible': 
            return require('../assets/images/moderaterain.png');
        case 'Sunny':
            return require('../assets/images/sun.png');
        case 'Clear':
            return require('../assets/images/sun.png');
        case 'Overcast':
            return require('../assets/images/cloud.png');
        case 'Cloudy':
            return require('../assets/images/cloud.png');
        case 'Light rain':
            return require('../assets/images/moderaterain.png');
        case 'Light rain shower':
            return require('../assets/images/moderaterain.png');
        case 'Moderate rain at times':
            return require('../assets/images/moderaterain.png');
        case 'Heavy rain':
            return require('../assets/images/heavyrain.png');
        case 'Heavy rain at times':
            return require('../assets/images/heavyrain.png');
        case 'Moderate or heavy freezing rain':
            return require('../assets/images/heavyrain.png');
        case 'Moderate or heavy rain shower':
            return require('../assets/images/heavyrain.png');
        case 'Moderate or heavy rain with thunder':
            return require('../assets/images/heavyrain.png');
        case 'Mist':
            return require('../assets/images/mist.png');
        case 'other':
            return require('../assets/images/partlycloudy.png');
        default:
            return require('../assets/images/sun.png');
    }
}