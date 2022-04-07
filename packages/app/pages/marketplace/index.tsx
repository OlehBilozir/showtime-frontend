import { useSafeAreaInsets } from "app/lib/safe-area";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { MarketplaceStackParams } from "app/navigation/types";
import { MarketplaceScreen } from "app/screens/marketplace";

import { useIsDarkMode } from "design-system/hooks";

const MarketplaceStack = createStackNavigator<MarketplaceStackParams>();

function MarketplaceNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <MarketplaceStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <MarketplaceStack.Screen
        name="marketplace"
        component={MarketplaceScreen}
      />
    </MarketplaceStack.Navigator>
  );
}

export default MarketplaceNavigator;
