import { colors } from "assets/colors";
import { Text, View } from "react-native";
import Button from "./button";
import { router } from "expo-router";

interface Props {
  error: Error;
}

const ErrorHandler: React.FC<Props> = ({ error }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "80%",
          gap: 15,
        }}
      >
        <Text
          style={{
            fontSize: 50,
            fontWeight: 100,
            marginBottom: 5,
          }}
        >
          Oops!
        </Text>
        <View>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Ocorreu um erro inesperado
          </Text>
          <Text>Erro: {error.message}</Text>
        </View>
        <Button
          label="Voltar"
          onPress={() => {
            router.dismissAll();
            router.replace("/");
          }}
        />
      </View>
    </View>
  );
};

export default ErrorHandler;
