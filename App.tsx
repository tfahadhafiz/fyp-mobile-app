import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './AuthContext';

import LoginScreen from './Login';
import SUMainContainer from './navigation/SUMainContainer';
import FMMainContainer from './navigation/FMMainContainer';
import COMainContainer from './navigation/COMainContainer';
import MOMainContainer from './navigation/MOMainContainer';

// Import screens
import SUProjPropScreen from './navigation/SUscreens/SUProjPropScreen';
import SUMeetCreateScreen from './navigation/SUscreens/SUMeetCreateScreen';
import FMCreateAnnScreen from './navigation/FMscreens/FMCreateAnnScreen';
import COCreateAnnScreen from './navigation/COscreens/COCreateAnnScreen';
import FMPresCreateScreen from './navigation/FMscreens/FMPresCreateScreen';
import FMProjInfoScreen from './navigation/FMscreens/FMProjInfoScreen';
import SUProjInfoScreen from './navigation/SUscreens/SUProjInfoScreen';
import COProjInfoScreen from './navigation/COscreens/COProjInfoScreen';
import MOProjInfoScreen from './navigation/MOscreens/MOProjInfoScreen';
import COModAssignScreen from './navigation/COscreens/COModAssignScreen';
import SUStuAssignScreen from './navigation/SUscreens/SUStuAssignScreen';
import SUStuAssign2Screen from './navigation/SUscreens/SUStuAssign2Screen';
import SUMeetWeekScreen from './navigation/SUscreens/SUMeetWeekScreen';
import SUMeetWeekInputScreen from './navigation/SUscreens/SUMeetWeekInputScreen';
import ListOfStudents from './navigation/LISTscreens/ListOfStudents';
import ListOfModerators from './navigation/LISTscreens/ListOfModerators';
import ListOfSupervisors from './navigation/LISTscreens/ListOfSupervisors';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          {/* Set the Login screen as the initial screen */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

          {/* Main Containers */}
          <Stack.Screen name="SUAnnScreen" component={SUMainContainer} options={{ headerShown: false }} />
          <Stack.Screen name="FMAnnScreen" component={FMMainContainer} options={{ headerShown: false }} />
          <Stack.Screen name="COAnnScreen" component={COMainContainer} options={{ headerShown: false }} />
          <Stack.Screen name="MOAnnScreen" component={MOMainContainer} options={{ headerShown: false }} />

          {/* Screens */}
          <Stack.Screen name="SUProjPropScreen" component={SUProjPropScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SUMeetCreateScreen" component={SUMeetCreateScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FMCreateAnnScreen" component={FMCreateAnnScreen} options={{ headerShown: false }} />
          <Stack.Screen name="COCreateAnnScreen" component={COCreateAnnScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FMPresCreateScreen" component={FMPresCreateScreen} options={{ headerShown: false }} />

          <Stack.Screen name="FMProjInfoScreen" component={FMProjInfoScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SUProjInfoScreen" component={SUProjInfoScreen} options={{ headerShown: true }} />
          <Stack.Screen name="COProjInfoScreen" component={COProjInfoScreen} options={{ headerShown: true }} />
          <Stack.Screen name="MOProjInfoScreen" component={MOProjInfoScreen} options={{ headerShown: true }} />

          <Stack.Screen name="COModAssignScreen" component={COModAssignScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SUStuAssignScreen" component={SUStuAssignScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SUStuAssign2Screen" component={SUStuAssign2Screen} options={{ headerShown: true }} />
          <Stack.Screen name="SUMeetWeekScreen" component={SUMeetWeekScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SUMeetWeekInputScreen" component={SUMeetWeekInputScreen} options={{ headerShown: true }} />

          {/* List screens */}
          <Stack.Screen name="ListOfStudents" component={ListOfStudents} options={{ headerShown: true }} />
          <Stack.Screen name="ListOfModerators" component={ListOfModerators} options={{ headerShown: true }} />
          <Stack.Screen name="ListOfSupervisors" component={ListOfSupervisors} options={{ headerShown: true }} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;
