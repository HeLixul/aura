import { area, scaleLinear } from "d3";
import { useEffect } from "react";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Circle,
  Group,
  Skia,
  Text,
} from "@shopify/react-native-skia";

type Props = {
  size: number;
  value: number;
  color?: string;
};

export const LiquidGaugeProgress = ({ size, value, color = "#178BCA" }: Props) => {
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;
  const circleFillGap = 0.0 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;

  const minValue = 0;
  const maxValue = 100;
  const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;

  const waveCount = 1;
  const waveClipCount = waveCount + 1;
  const waveLength = (fillCircleRadius * 2) / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleRadius * 0.1;

  const fontSize = radius / 2;
  const textTranslateX = radius - fontSize * 0.8;
  const textTranslateY = radius + fontSize * 0.3; // Adjust text position

  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area()
    .x((d) => waveScaleX(d[0]))
    .y0((d) => waveScaleY(Math.sin(d[1] * 2 * Math.PI)))
    .y1(() => fillCircleRadius * 2 + waveHeight);

  const clipSvgPath = clipArea(data);

  const translateXAnimated = useSharedValue(0);
  const translateYPercent = useSharedValue(0);
  const textValue = useSharedValue(0);

  useEffect(() => {
    textValue.value = withTiming(value, { duration: 1000 });
  }, [value]);

  const text = useDerivedValue(() => {
    return `${Math.round(value)}%`;
  }, [value]);

  useEffect(() => {
    translateYPercent.value = withTiming(fillPercent, { duration: 1000 });
  }, [fillPercent]);

  useEffect(() => {
    translateXAnimated.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.linear }),
      -1
    );
  }, []);

  const clipPath = useDerivedValue(() => {
    const clipP = Skia.Path.MakeFromSVGString(clipSvgPath);
    const transformMatrix = Skia.Matrix();
    transformMatrix.translate(
      fillCircleMargin - waveLength * translateXAnimated.value,
      fillCircleMargin +
        (1 - translateYPercent.value) * fillCircleRadius * 2 -
        waveHeight
    );
    clipP.transform(transformMatrix);
    return clipP;
  }, [translateXAnimated, translateYPercent]);

  return (
    <Canvas style={{ width: size, height: size }}>
      {/* Outer Circle Stroke */}
      <Circle
        cx={radius}
        cy={radius}
        r={radius - circleThickness * 0.5}
        color={color}
        style="stroke"
        strokeWidth={circleThickness}
      />

      {/* Text Above Wave */}
      <Text
        x={textTranslateX}
        y={textTranslateY}
        text={text}
        color="black"
        fontSize={fontSize}
      />

      {/* Wave & Inner Text */}
      <Group clip={clipPath}>
        <Circle cx={radius} cy={radius} r={fillCircleRadius} color={color} />
        <Text
          x={textTranslateX}
          y={textTranslateY}
          text={text}
          color="white" // Text inside wave should be visible
          fontSize={fontSize}
        />
      </Group>
    </Canvas>
  );
};
