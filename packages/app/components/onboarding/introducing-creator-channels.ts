import { useEffect, useContext } from "react";

import { UserContext } from "app/context/user-context";
import { useRedirectToChannelIntro } from "app/hooks/use-redirect-to-channel-intro";
import { getIsShowCreatorChannelIntro } from "app/lib/mmkv-keys";

import { useChannelById } from "../creator-channels/hooks/use-channel-detail";

export const useIntroducingCreatorChannels = () => {
  const context = useContext(UserContext);
  const channelId = context?.user?.data.channels?.[0];
  const { data } = useChannelById(channelId?.toString());
  const redirectToCreatorChannelIntro = useRedirectToChannelIntro();

  useEffect(() => {
    if (
      data?.latest_message_updated_at === null &&
      context?.user?.data?.profile.verified &&
      getIsShowCreatorChannelIntro()
    ) {
      setTimeout(() => {
        redirectToCreatorChannelIntro();
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.latest_message_updated_at]);
};
