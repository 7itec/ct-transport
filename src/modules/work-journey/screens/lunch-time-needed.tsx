import React from "react";

import { lunchIcon } from "assets/images";
import Button from "components/button";
import styled from "styled-components/native";
import { colors } from "assets/colors";
import Column from "components/column";

const LunchTimeNeeded: React.FC = () => {
  return (
    <>
      <Container>
        <Banner source={lunchIcon} />
        <Title>Parada para alimentação pendente</Title>
        <Description>
          Você deve fazer uma pausa para alimentação agora!
        </Description>
        <Column gap={10} style={{ width: "100%" }}>
          <Button label="Parar para alimentação" />
          <Button label="Parar depois" />
        </Column>
      </Container>
    </>
  );
};

export default LunchTimeNeeded;

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 10%;
`;

const Banner = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 200px;
  height: 80px;
`;

const Title = styled.Text`
  font-size: 22px;
  color: black;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
`;

const Description = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  text-align: center;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const StopLaterButton = styled(Button).attrs({
  backgroundColor: colors.error,
})``;
