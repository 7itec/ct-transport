import { useWindowDimensions } from "react-native";
import Column from "shared/components/column";
import { MediumText, RegularText } from "shared/components/text";
import styled from "styled-components/native";
import Loading from "./loading";
import { colors } from "assets/colors";

interface Props {
  name: string;
  description?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  isLoading?: boolean;
  hideChevron?: boolean;
}

const Option: React.FC<Props> = ({
  name,
  description,
  icon,
  onPress,
  isLoading,
}) => {
  const { width } = useWindowDimensions();

  return (
    <Column
      {...{ onPress }}
      style={{
        backgroundColor: "white",
        padding: 15,
        paddingTop: 10,
        width: (width - 45) / 2,
        height: 130,
        borderRadius: 5,
      }}
      gap={10}
    >
      <MediumText size="small">{name}</MediumText>
      <IconBox>{isLoading ? <Loading color="white" /> : icon}</IconBox>
      <RegularText size="small">{description}</RegularText>
    </Column>
  );
};

export default Option;

const IconBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
`;
