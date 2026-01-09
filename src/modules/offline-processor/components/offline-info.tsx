import { RegularText } from "components/text";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OfflineInfo: React.FC = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        minHeight: 30,
        width: "100%",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: bottom + 15,
        paddingTop: 10,
      }}
    >
      <RegularText color="white">Sem conexão</RegularText>
    </View>
  );
};

export default OfflineInfo;
