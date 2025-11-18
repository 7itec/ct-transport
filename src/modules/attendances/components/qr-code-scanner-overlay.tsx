import React from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Mask, Rect } from "react-native-svg";

const QRCodeScannerOverlay: React.FC = () => {
  const rectBorderRadius = 16;
  const rectColor = "transparent";
  const overlayColor = "rgba(0, 0, 0, 0.5)";
  const dimensions = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const width = dimensions.width - 30;
  const height = dimensions.height * 0.5;

  const overlaySize = { width: width * 0.9, height: height * 0.5 };

  const rectOffsetY = 110;
  const rectX = (width - overlaySize.width) / 2 + 15;
  const rectY = rectOffsetY / 2;
  const rectHeight = height - rectOffsetY;
  const rectWidth = overlaySize.width - 30;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 15 }}
    >
      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={overlayColor}
        mask="url(#mask)"
      />

      <Mask id="mask">
        <Rect x="0" y="0" width={width} height={height} fill="white" />
        <Rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={rectBorderRadius}
          fill="black"
        />
      </Mask>

      <Rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        rx={rectBorderRadius}
        fill={rectColor}
      />
    </Svg>
  );
};

export default QRCodeScannerOverlay;
