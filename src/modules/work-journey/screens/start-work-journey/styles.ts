import styled from "styled-components/native";

export const Container = styled.ScrollView`
  background-color: "#f1f0f5";
`;

export const Header = styled.View`
  height: 120px;
  background-color: #959096;
  margin-bottom: 35px;
`;

export const Avatar = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: #f1f0f5;
  position: absolute;
  bottom: -35px;
  left: 15px;
  border-width: 4px;
  border-color: white;
  justify-content: center;
  align-items: center;
  elevation: 1;
  overflow: hidden;
`;

export const Content = styled.View`
  flex: 1;
  padding: 15px;
  gap: 15px;
`;

export const Card = styled.View`
  padding: 15px;
  border-radius: 10px;
  background-color: white;
  width: 100%;
`;

export const Exit = styled.Text`
  text-align: center;
  padding-bottom: 15px;
`;

export const AvatarImage = styled.Image`
  width: 70px;
  height: 70px;
  resize-mode: cover;
`;
