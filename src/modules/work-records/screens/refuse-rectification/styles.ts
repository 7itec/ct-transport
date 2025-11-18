import styled from "styled-components/native";

interface TextProps {
  size?: number;
  color?: string;
}

interface RowProps {
  gap?: number;
}

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 15,
    gap: 15,
  },
})`
  background-color: #f1f0f5;
`;

export const Header = styled.ImageBackground`
  height: 140px;
  background-color: #959096;
`;

export const Card = styled.Pressable`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
  gap: 10px;
`;

export const ListCard = styled.View`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  margin: 0 15px;
`;

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Row = styled.View<RowProps>`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.gap ?? 0}px;
`;

export const Column = styled.Pressable<RowProps>`
  gap: ${(props) => props.gap ?? 0}px;
`;

export const SpaceBetweenRow = styled.View<RowProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${(props) => props.gap ?? 0}px;
`;

export const RegularText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
`;

export const MediumText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
  font-weight: 500;
`;

export const SemilBoldText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
  font-weight: 600;
`;

export const BoldText = styled.Text<TextProps>`
  font-size: ${(props) => props.size ?? 14}px;
  color: ${(props) => props.color ?? "black"};
  font-weight: 700;
`;
