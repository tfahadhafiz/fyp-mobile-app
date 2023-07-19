import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import AnnScreen from './FMscreens/FMAnnScreen';
import ProjScreen from './FMscreens/FMProjScreen';
import PresScreen from './FMscreens/FMPresScreen';
import RecScreen from './FMscreens/FMRecScreen';

// Screen names
const AnnName = 'Announcement';
const ProjName = 'Project';
const PresName = 'Presentation';
const RecName = 'Record';

const Tab = createBottomTabNavigator();

function CustomHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleLogoPress = () => {
    navigation.navigate(AnnName);
  };

  return (
    <>
      <StatusBar
        backgroundColor="#243DB7"
        barStyle="light-content"
      />
      <TouchableWithoutFeedback onPress={handleLogoPress}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <Image
            source={require('./assets/mmulogo.png')}
            style={{ width: 45, height: 45, marginTop: insets.top }}
          />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

function FMMainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={AnnName}
      screenOptions={({ route }) => ({
        headerShown: true,
        header: () => <CustomHeader />,

        tabBarActiveTintColor: '#0038FF',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { paddingBottom: 15, fontSize: 11 },
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === AnnName) {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (rn === ProjName) {
            iconName = focused ? 'school' : 'school-outline';
          } else if (rn === PresName) {
            iconName = focused ? 'easel' : 'easel-outline';
          } else if (rn === RecName) {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={AnnName} component={AnnScreen} />
      <Tab.Screen name={ProjName} component={ProjScreen} />
      <Tab.Screen name={PresName} component={PresScreen} />
      <Tab.Screen name={RecName} component={RecScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#243DB7',
  },
  tabBarStyle: {
    height: 70,
    borderTopWidth: 1,
    elevation: 0,
  },
});

export default FMMainContainer;
