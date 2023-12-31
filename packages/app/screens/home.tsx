import { ErrorBoundary } from "app/components/error-boundary";
import { Feed } from "app/components/feed";
import FeedDesktop from "app/components/feed/feed.md";
import { withColorScheme } from "app/components/memo-with-theme";
import { useIntroducingCreatorChannels } from "app/components/onboarding/introducing-creator-channels";
import { useTrackPageViewed } from "app/lib/analytics";

import { Hidden } from "design-system/hidden";

const HomeScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Home" });
  useIntroducingCreatorChannels();
  return (
    <ErrorBoundary>
      <Hidden from="md">
        <Feed />
      </Hidden>
      <Hidden until="md">
        <FeedDesktop />
      </Hidden>
    </ErrorBoundary>
  );
});

export { HomeScreen };
