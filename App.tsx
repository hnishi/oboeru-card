import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CardStudyScreen } from "./src/screens/CardStudyScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { AppProvider } from "./src/contexts/AppContext";
import { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: "slide_from_right" as const,
  gestureEnabled: true,
  gestureDirection: "horizontal" as const,
  animationDuration: 250,
  presentation: "card" as const,
  transitionSpec: {
    open: {
      animation: "spring",
      config: {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
    close: {
      animation: "spring",
      config: {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
  },
};

export default function App() {
  return (
    <AppProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={screenOptions}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="CardStudy"
              component={CardStudyScreen}
              options={{
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{
                animation: "fade_from_bottom",
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                animation: "slide_from_right",
                presentation: "modal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}
