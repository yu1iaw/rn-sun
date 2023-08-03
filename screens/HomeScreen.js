import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import tw from "twrnc";
import { Foundation, Feather, Ionicons } from "@expo/vector-icons";
import { debounce } from 'lodash';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native';

import { theme, weatherImages } from "../theme";
import { fetchLocation, fetchWeatherForecast } from "../api/weather";
import { getHistory, storeHistory } from "../utils/asyncStorage";


export const HomeScreen = () => {
	const [showSearch, setShowSearch] = useState(false);
	const [locations, setLocations] = useState([]);
    const [cityTitle, setCityTitle] = useState('Toronto');
    const [inputOnFocus, setInputOnFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [weather, setWeather] = useState({});
    const scrollviewRef = useRef(null);

    useEffect(() => {
        const defaultWeather = async () => {
            let myCity = await getHistory("city");
            let title = await getHistory("cityName");
            let cityCoord = {lat: 43.7001, lon: -79.4163};
            if (myCity) {
                cityCoord = JSON.parse(myCity);
            }
            const data = await fetchWeatherForecast({city: cityCoord});
            title && setCityTitle(title);
            setWeather(data);
            setIsLoading(false);
        }
        defaultWeather();
    }, [])

    const handleLocation = async (loc) => {
        setLocations([]);
        setShowSearch(false);
        setIsLoading(true);
        const data = await fetchWeatherForecast({city: {lat: loc.lat, lon: loc.lon}});
        setCityTitle(loc.name);
        // console.log(data.list)
        setWeather(data);
        setIsLoading(false);
        await storeHistory("city", JSON.stringify({lat: loc.lat, lon: loc.lon}));
        await storeHistory("cityName", loc.name);
    }

    const handleSearch = async (txt) => {
        if (txt.length) {
            const data = await fetchLocation({city: txt});
            setLocations(data);
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    const timestamp = Number(weather?.city?.sunrise + '000');
    const hours = new Date(timestamp).getHours();
    const minutes = new Date(timestamp).getMinutes();
    const formattedMinutes = ('0' + minutes).slice(-2);


	return (
		<View style={tw`flex-1 relative`}>
			<StatusBar style="light" />
			<Image source={require("../assets/images/bg.png")} style={tw`absolute w-full h-full`} blurRadius={55} />
			{
                isLoading ? (
                    <View style={tw`flex-1 flex-row justify-center items-center`}>
                        <Progress.CircleSnail thickness={7} size={110} color="#20B2AA" />
                    </View>
                ) : (
                <SafeAreaView style={tw`flex-1`}>
                    <View style={tw.style("mx-4 mt-10 relative z-50", { height: "7%" })}>
                        <View style={tw.style(`flex-row h-14 justify-end items-center rounded-full`, showSearch && !inputOnFocus && { backgroundColor: theme.bgWhite(0.2) }, showSearch && inputOnFocus && {backgroundColor: 'rgba(0, 51, 51, .95)', borderWidth: 1, borderColor: theme.bgWhite(0.5)})}>
                            {showSearch && (
                                <TextInput 
                                    placeholder="Search city" 
                                    placeholderTextColor={"lightgray"} 
                                    style={tw`pl-6 flex-1 text-base text-white`}
                                    onFocus={() => setInputOnFocus(true)}
                                    onBlur={() => setInputOnFocus(false)}
                                    onChangeText={handleTextDebounce} />
                            )}
                            <Pressable
                                style={tw.style("px-3 py-2 m-1 rounded-full", { backgroundColor: theme.bgWhite(0.3) })}
                                onPress={() => {
                                    setShowSearch(state => !state);
                                    if (inputOnFocus) setInputOnFocus(false);
                                }}>
                                <Foundation name="magnifying-glass" size={33} color="white" />
                            </Pressable>
                        </View>
                        {locations.length && showSearch ? (
                            <View style={tw`absolute w-full bg-[#faf0e6fa] top-16 rounded-3xl`}>
                                {locations.map((loc, index) => {
                                    const showBorder = index + 1 !== locations.length;
                                    const borderClass = showBorder ? 'border-b-2 border-b-white' : '';
                                    return (
                                        <Pressable 
                                            key={index} 
                                            style={tw.style(`flex-row items-center border-0 p-4 mb-1`, borderClass)}
                                            onPress={() => handleLocation(loc)}
                                        >
                                            <Feather name="map-pin" size={20} color="gray" />
                                            <Text style={tw`text-gray-900 text-base ml-2`}>{loc?.name}, {loc?.country}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        ) : null}
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        if (showSearch) setShowSearch(false)
                    }}>
                        <View style={tw`mx-4 justify-evenly flex-1 my-3`}>
                            <Text style={tw`text-white text-center text-2xl font-bold`}>
                                {cityTitle},
                                <Text style={tw`text-lg font-semibold text-gray-300`}> {weather.city.country}</Text>
                            </Text>
                            <View style={tw`flex-row justify-center`}>
                                {/* <Image source={{uri: `https:${current?.condition?.icon}`}} style={tw`w-16 h-16`}/> */}
                                <LottieView source={weatherImages(weather.list[0].weather[0].description)} style={styles.lottieImage} autoPlay loop />
                            </View>
                            <View style={tw`mb-2`}>
                                <Text style={tw`text-center font-bold text-white text-5xl ml-4`}>{Math.round(weather.list[0].main.temp)}&#176;</Text>
                                <Text style={tw`text-center text-white text-xl tracking-wider`}>{weather.list[0].weather[0].description}</Text>
                            </View>
                            <View style={tw`flex-row justify-between mx-3`}>
                                <View style={tw`flex-row items-center`}>
                                    <Image source={require('../assets/icons/wind.png')} style={tw`w-6 h-6`} />
                                    <Text style={tw`text-white font-semibold text-base ml-2`}>{Math.round(weather.list[0].wind.speed)}km</Text>
                                </View>
                                <View style={tw`flex-row items-center`}>
                                    <Image source={require('../assets/icons/drop.png')} style={tw`w-6 h-6`} />
                                    <Text style={tw`text-white font-semibold text-base ml-1`}>{weather.list[0].main.humidity}%</Text>
                                </View>
                                <View style={tw`flex-row items-center`}>
                                    <Image source={require('../assets/icons/sun.png')} style={tw`w-6 h-6`} />
                                    <Text style={tw`text-white font-semibold text-base ml-2`}>{hours}:{formattedMinutes} AM</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={tw.style(showSearch && 'hidden')}>
                        <View style={tw`flex-row items-center mx-5`}>
                            <Ionicons name="calendar" size={24} color="white" />
                            <Text style={tw`text-white text-base ml-1.5`}>Daily forecast</Text>
                        </View>
                        <ScrollView 
                            horizontal 
                            contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}
                            showsHorizontalScrollIndicator={false}
                            ref={ref => scrollviewRef.current = ref}
                            onLayout={() => new Date().getHours() < 15 ? scrollviewRef.current.scrollTo({x:100}) : undefined}
                        >
                            {
                                weather.list
                                .filter((item, i) => item.dt_txt.slice(-8) === '12:00:00')
                                .map((item, index) => {
                                    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                                    return (
                                        <View key={index} style={tw.style(`justify-center items-center w-24 rounded-3xl py-3 mr-3`, {backgroundColor: theme.bgWhite(0.15)})}>
                                            <LottieView source={weatherImages(item.weather[0].description)} style={tw`w-11 h-11`} autoPlay loop />
                                            <Text style={tw`text-white mb-2`}>{week[new Date(item.dt_txt.slice(0, -9)).getDay()]}, {new Date(item.dt_txt.slice(0, -9)).getDate()}</Text>
                                            <Text style={tw`text-white text-xl font-semibold`}>{Math.round(item.main.temp)}&#176;</Text>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </SafeAreaView>
                )
            }
		</View>
	);
};

const {height} = Dimensions.get('screen');
const formattedSize = height * 0.24;

const styles = StyleSheet.create({
    lottieImage: {
        width: formattedSize,
        height: formattedSize
    }
})
