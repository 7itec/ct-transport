import { colors } from "assets/colors";

export const textSizes = {
  "extra-small": 10,
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  "extra-large": 24,
};

export interface TextProps {
  size?: keyof typeof textSizes;
  color?: keyof typeof colors;
  textAlign?: "left" | "center" | "right";
}
