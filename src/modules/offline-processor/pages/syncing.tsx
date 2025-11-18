import { RegularText } from "components/text";
import { Stack } from "expo-router";
import OfflineRequest from "modules/offline-processor/components/offline-request";
import useOfflineRequests, {
  OfflineRequestProps,
} from "modules/offline-processor/hooks/use-offline-requests";
import { FlatList, ListRenderItem } from "react-native";

const Syncing: React.FC = () => {
  const { requests } = useOfflineRequests();

  const renderItem: ListRenderItem<OfflineRequestProps> = ({ item }) => {
    return <OfflineRequest {...item} />;
  };

  return (
    <>
      <FlatList
        data={requests.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
        {...{ renderItem }}
        contentContainerStyle={
          requests.length === 0
            ? {
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }
            : { padding: 15, gap: 15, paddingTop: 15, paddingBottom: 90 }
        }
        ListEmptyComponent={
          <RegularText>Nenhum registro encontrado</RegularText>
        }
      />
      <Stack.Screen options={{ headerShown: true, title: "Sincronismo" }} />
    </>
  );
};

export default Syncing;
