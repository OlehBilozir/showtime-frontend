import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

function SvgSmile(props: SvgProps) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7.4 13.2a1 1 0 011.397.196l.005.006a3.667 3.667 0 00.194.219c.147.153.368.362.655.57.577.42 1.374.809 2.349.809.975 0 1.772-.39 2.35-.809a4.953 4.953 0 00.815-.748l.034-.041.004-.006A1 1 0 0116.8 14.6L16 14l.8.6-.001.001-.001.002-.003.004-.007.009-.021.027-.07.086a6.936 6.936 0 01-1.17 1.08c-.8.58-2.002 1.191-3.527 1.191-1.525 0-2.728-.61-3.526-1.191a6.942 6.942 0 01-1.17-1.08 4.14 4.14 0 01-.07-.086l-.022-.027-.007-.01-.003-.003-.001-.002S7.2 14.6 8 14l-.8.6a1 1 0 01.2-1.4zM8 9a1 1 0 011-1h.01a1 1 0 110 2H9a1 1 0 01-1-1zM15 8a1 1 0 100 2h.01a1 1 0 100-2H15z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12a9 9 0 1118 0 9 9 0 01-18 0z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgSmile;