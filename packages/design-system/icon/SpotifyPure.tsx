import * as React from "react";

import Svg, { SvgProps, Path } from "react-native-svg";

const SvgSpotifyPure = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12Zm5.503 17.308a.747.747 0 0 1-1.029.247c-2.817-1.72-6.364-2.11-10.541-1.156A.748.748 0 0 1 5.6 14.94c4.571-1.044 8.492-.595 11.655 1.339a.748.748 0 0 1 .248 1.029Zm1.469-3.268a.936.936 0 0 1-1.287.308c-3.226-1.983-8.142-2.557-11.958-1.399a.937.937 0 0 1-1.167-.623.937.937 0 0 1 .624-1.167c4.358-1.322 9.775-.682 13.48 1.595.44.27.579.846.308 1.286Zm.126-3.403C15.23 8.34 8.849 8.13 5.157 9.25a1.122 1.122 0 1 1-.652-2.148c4.24-1.286 11.286-1.038 15.738 1.606a1.122 1.122 0 1 1-1.146 1.93Z"
    />
  </Svg>
);
export default SvgSpotifyPure;
