export const theme = {
    bgWhite: (opacity) => `rgba(255, 255, 255, ${opacity})`
}

export const weatherImages = (condition) => {
    if (condition === 'mist' || condition === 'haze' || condition === 'fog' || condition === 'smoke') {
        return require('../assets/images/overcast-fog.json');
    }
    else if (condition.includes('sand') || condition.includes('dust')) {
        return require('../assets/images/dust.json');
    }
    else if (condition.includes('few clouds')) {
        return require('../assets/images/partly-cloudy-day.json')
    }
    else if (condition.includes('scattered clouds')) {
        return require('../assets/images/cloudy.json')
    }
    else if (condition.includes('broken clouds') || condition.includes('overcast clouds')) {
        return require('../assets/images/overcast-day.json')
    }
    else if (condition === 'light rain' || condition === 'drizzle' || condition === 'drizzle rain') {
        return require('../assets/images/overcast-day-drizzle.json');
    }
    else if (condition.includes('thunderstorm')) {
        return require('../assets/images/thunderstorms-day-extreme-rain.json');
    }
    else if (condition.includes('drizzle')) {
        return require('../assets/images/drizzle.json');
    }
    else if (condition === 'moderate rain') {
        return require('../assets/images/rain.json');
    }
    else if (condition === 'heavy intensity rain' || condition === 'very heavy rain') {
        return require('../assets/images/overcast-rain.json');
    }
    else if (condition.includes('rain')) {
        return require('../assets/images/extreme-rain.json');
    }
    else if (condition === 'light snow' || condition === 'snow') {
        return require('../assets/images/overcast-day-snow.json');
    }
    else if (condition === 'heavy snow') {
        return require('../assets/images/snow.json');
    }
    else if (condition.includes('snow')) {
        return require('../assets/images/overcast-snow.json');
    }
    else if (condition.includes('sleet')) {
        return require('../assets/images/overcast-sleet.json');
    }
    else if (condition === 'tornado') {
        return require('../assets/images/tornado.json');
    }
    else if (condition === 'clear sky') {
        return require('../assets/images/clear-day.json');
    }
    else {
        return require('../assets/images/partly-cloudy-day.json');
    }
}