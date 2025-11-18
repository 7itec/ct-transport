import useApiQuery from "hooks/use-api-query";
import { AddressProps } from "modules/attendances/types";

const useSearchAddresses = (search: string) => {
  return useApiQuery<AddressProps[]>({
    url: `/addresses/search?fullAddress=${search}`,
    errorTitle: "Erro ao buscar endereços",
    enabled: !!search,
  });
};

export default useSearchAddresses;
