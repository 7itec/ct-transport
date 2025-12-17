import React from "react";
import { ScrollView } from "react-native";
import useWorkRecords from "../hooks/use-work-records";
import Empty from "components/empty";
import Loading from "components/loading";
import WorkRecord from "../components/work-record";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WorkRecords: React.FC = () => {
  const { data, isLoading } = useWorkRecords();
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (!data || data?.length === 0) && (
        <Empty description="Nenhum registro encontrado" />
      )}
      {!isLoading && data?.length! > 0 && (
        <ScrollView
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 10,
            paddingTop: 15,
            paddingBottom: bottom + 15,
          }}
        >
          {data?.map((workRecord) => (
            <WorkRecord key={workRecord._id} {...{ workRecord }} />
          ))}
        </ScrollView>
      )}
      <Stack.Screen
        options={{ title: "Registros de trabalho", headerShown: true }}
      />
    </>
  );
};

export default WorkRecords;
