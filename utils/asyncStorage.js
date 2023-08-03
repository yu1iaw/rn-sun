import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeHistory = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch(e) {
        console.log(e)
    }
}

export const getHistory = async (key) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data;
    } catch(e) {
        console.log(e);
    }
}

