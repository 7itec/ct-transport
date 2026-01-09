import React, { useState } from "react";
import useAlerts from "../hooks/use-alerts";
import Loading from "components/loading";
import Alert from "../components/alert";
import { FlatList, RefreshControl, View } from "react-native";
import { RegularText } from "components/text";

const Alerts: React.FC = () => {
  const { data = [], isLoading, refetch } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) return <Loading />;

  return (
    <FlatList
      contentContainerStyle={{
        gap: 10,
        padding: 15,
        flexGrow: data?.length ? undefined : 1,
      }}
      data={data}
      keyExtractor={(alert) => alert._id}
      refreshControl={<RefreshControl {...{ refreshing, onRefresh }} />}
      renderItem={({ item }) => <Alert key={item._id} {...item} />}
      ListEmptyComponent={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <RegularText>Nenhum alerta registrado</RegularText>
        </View>
      }
    />
  );
};

export default Alerts;
