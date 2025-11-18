import React, { useState } from "react";
import { useEffect } from "react";
import { useBackHandler } from "@react-native-community/hooks";

import {
  Container,
  Row,
  BackButton,
  BackIcon,
  Input,
  Address,
  AddressName,
  AddressIcon,
} from "./styles";
import { AddressProps } from "modules/attendances/types";
import Empty from "components/empty";
import { Stack } from "expo-router";
import { useDebounce } from "use-debounce";
import useSearchAddresses from "modules/addresses/hooks/use-search-addresses";
import Loading from "components/loading";

interface Props {
  setAddress: (address: AddressProps) => void;
  close: () => void;
}

const SearchAddress: React.FC<Props> = ({ close, setAddress }) => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { isLoading, data } = useSearchAddresses(debouncedSearch);

  const handleAddress = (address: AddressProps) => {
    setAddress(address);
    close();
  };

  useBackHandler(() => {
    close();
    return true;
  });

  return (
    <>
      <Stack.Screen options={{ headerShadowVisible: false }} />
      <Container>
        <Row>
          <BackIcon name="search" />
          <Input placeholder="Digite o endereço" onChangeText={setSearch} />
        </Row>
        {isLoading && <Loading />}
        {!isLoading && data?.length === 0 && (
          <Empty
            description={
              search
                ? "Nenhum endereço encontrado"
                : "Pesquise para encontrar endereços"
            }
          />
        )}
        {!isLoading &&
          data?.map((address, index) => (
            <Address key={index} onPress={() => handleAddress(address)}>
              <AddressIcon name="location-outline" />
              <AddressName>{`${address.street} - ${address.neighborhood}, ${address.city}/${address.state}`}</AddressName>
            </Address>
          ))}
      </Container>
    </>
  );
};

export default SearchAddress;
