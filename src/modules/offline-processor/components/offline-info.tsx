import { RegularText } from "components/text";
import { View } from "react-native";

const OfflineInfo: React.FC = () => {
  return (
    <View
      style={{
        height: 30,
        width: "100%",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RegularText color="white">Sem conexão</RegularText>
    </View>
  );
};

export default OfflineInfo;
