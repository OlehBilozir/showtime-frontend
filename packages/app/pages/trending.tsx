import { Platform } from "react-native";
import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { TrendingScreen } from "app/screens/trending";
import { TrendingStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);

const TrendingStack = createStackNavigator<TrendingStackParams>();

function TrendingNavigator() {
  return (
    <TrendingStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions}
    >
      <TrendingStack.Group>
        <TrendingStack.Screen
          name="trending"
          component={TrendingScreen}
          options={{ title: "Trending", headerTitle: "Trending" }}
        />
      </TrendingStack.Group>
      <TrendingStack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <TrendingStack.Screen name="login" component={LoginScreen} />
        <TrendingStack.Screen name="nft" component={NftScreen} />
      </TrendingStack.Group>
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;