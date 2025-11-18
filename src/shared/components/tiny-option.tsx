import { View } from "react-native";
import Column from "shared/components/column";
import { MediumText } from "shared/components/text";
import Loading from "./loading";

interface Props {
  name: string;
  icon: React.ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
}

const TinyOption: React.FC<Props> = ({ name, icon, onPress, isLoading }) => {
  return (
    <Column style={{ width: 50 }} gap={5} {...{ onPress }}>
      <View
        style={{
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(128, 128, 128, .1)",
          borderRadius: 5,
        }}
      >
        {!isLoading && icon}
        {isLoading && <Loading />}
      </View>
      <MediumText size="small" textAlign="center">
        {name}
      </MediumText>
    </Column>
  );
};

export default TinyOption;
