import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { Foundation, Feather, Ionicons } from "@expo/vector-icons";
import { debounce } from 'lodash';
import * as Progress from 'react-native-progress';

import { theme, weatherImages } from "../theme";
import { fetchLocation, fetchWeatherForecast } from "../api/weather";
import { getHistory, storeHistory } from "../utils/asyncStorage";

export const HomeScreen = () => {
	const [showSearch, setShowSearch] = useState(false);
	const [locations, setLocations] = useState([]);
    const [inputOnFocus, setInputOnFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [weather, setWeather] = useState({});
    const {location, current} = weather;

    useEffect(() => {
        const defaultWeather = async () => {
            let myCity = await getHistory("city");
            let cityName = 'New York';
            if (myCity) {
                cityName = myCity;
            }
            const data = await fetchWeatherForecast({city: cityName, days: 7});
            setWeather(data);
            setIsLoading(false);
        }
        defaultWeather();
    }, [])

    const handleLocation = async (loc) => {
        setLocations([]);
        setShowSearch(false);
        setIsLoading(true);
        const data = await fetchWeatherForecast({city: loc.name, days: 7});
        setWeather(data);
        setIsLoading(false);
        await storeHistory("city", loc.name);
    }

    const handleSearch = async (txt) => {
        if (txt.length) {
            const data = await fetchLocation({city: txt});
            setLocations(data);
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1500), [])

    
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
                            <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl`}>
                                {locations.map((loc, index) => {
                                    const showBorder = index + 1 !== locations.length;
                                    const borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                                    return (
                                        <Pressable 
                                            key={index} 
                                            style={tw.style(`flex-row items-center border-0 p-3 px-4 mb-1`, borderClass)}
                                            onPress={() => handleLocation(loc)}
                                        >
                                            <Feather name="map-pin" size={20} color="gray" />
                                            <Text style={tw`text-gray-900 text-lg ml-2`}>{loc?.name}, {loc?.country}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        ) : null}
                    </View>
                    <View style={tw`mx-4 justify-around flex-1 my-3`}>
                        <Text style={tw`text-white text-center text-2xl font-bold`}>
                            {location?.name},
                            <Text style={tw`text-lg font-semibold text-gray-300`}> {location?.country}</Text>
                        </Text>
                        <View style={tw`flex-row justify-center`}>
                            {/* <Image source={{uri: `https:${current?.condition?.icon}`}} style={tw`w-16 h-16`}/> */}
                            <Image source={weatherImages(current?.condition?.text)} style={tw`w-32 h-32`} />
                        </View>
                        <View style={tw`mb-2`}>
                            <Text style={tw`text-center font-bold text-white text-5xl ml-5`}>{Math.round(current?.temp_c)}&#176;</Text>
                            <Text style={tw`text-center text-white text-xl tracking-wider`}>{current?.condition?.text}</Text>
                        </View>
                        <View style={tw`flex-row justify-between mx-3`}>
                            <View style={tw`flex-row items-center`}>
                                <Image source={require('../assets/icons/wind.png')} style={tw`w-6 h-6`} />
                                <Text style={tw`text-white font-semibold text-base ml-2`}>{current?.wind_kph}km</Text>
                            </View>
                            <View style={tw`flex-row items-center`}>
                                <Image source={require('../assets/icons/drop.png')} style={tw`w-6 h-6`} />
                                <Text style={tw`text-white font-semibold text-base ml-1`}>{current?.humidity}%</Text>
                            </View>
                            <View style={tw`flex-row items-center`}>
                                <Image source={require('../assets/icons/sun.png')} style={tw`w-6 h-6`} />
                                <Text style={tw`text-white font-semibold text-base ml-2`}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={tw`flex-row items-center mx-5`}>
                            <Ionicons name="calendar" size={24} color="white" />
                            <Text style={tw`text-white text-base ml-1.5`}>Daily forecast</Text>
                        </View>
                        <ScrollView 
                            horizontal 
                            contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                weather?.forecast?.forecastday.map((item, index) => {
                                    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                                    return (
                                        <View key={index} style={tw.style(`justify-center items-center w-24 rounded-3xl py-3 mr-3`, {backgroundColor: theme.bgWhite(0.15)})}>
                                            <Image source={weatherImages(item?.day?.condition?.text)} style={tw`w-11 h-11`} />
                                            <Text style={tw`text-white mb-2`}>{week[new Date(item.date).getDay()]}, {new Date(item.date).getDate()}</Text>
                                            <Text style={tw`text-white text-xl font-semibold`}>{Math.round(item.day.avgtemp_c)}&#176;</Text>
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
