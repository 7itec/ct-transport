import { Dimensions, Platform } from "react-native";

const isAndroid = Platform.OS === 'android';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

export {deviceHeight, deviceWidth, isAndroid};