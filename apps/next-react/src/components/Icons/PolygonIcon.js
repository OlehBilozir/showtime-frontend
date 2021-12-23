import { forwardRef } from "react";

const PolygonIcon = forwardRef(({ className = "" }, ref) => (
  <svg
    ref={ref}
    className={className}
    viewBox="0 0 16 15"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.074 4.829a1.029 1.029 0 00-1.003 0L8.768 6.164l-1.565.872L4.901 8.37a1.03 1.03 0 01-1.004 0l-1.83-1.045a.999.999 0 01-.502-.842V4.422a.939.939 0 01.502-.842l1.8-1.016a1.03 1.03 0 011.004 0l1.8 1.016a.999.999 0 01.502.842v1.336l1.565-.9V3.522a.939.939 0 00-.502-.842L4.901.764a1.03 1.03 0 00-1.004 0L.502 2.68A.939.939 0 000 3.522v3.862a.939.939 0 00.502.842l3.395 1.916a1.029 1.029 0 001.003 0l2.303-1.306 1.564-.9 2.303-1.307a1.028 1.028 0 011.004 0l1.8 1.016a1 1 0 01.502.842v2.062a.939.939 0 01-.501.842l-1.801 1.045a1.03 1.03 0 01-1.004 0l-1.8-1.016a.999.999 0 01-.502-.842V9.242l-1.565.9v1.336a.939.939 0 00.502.842l3.395 1.916a1.029 1.029 0 001.003 0l3.395-1.916a1 1 0 00.502-.842V7.616a.938.938 0 00-.502-.842L12.074 4.83z" />
  </svg>
));

PolygonIcon.displayName = "PolygonIcon";

export default PolygonIcon;