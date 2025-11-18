import useApiQuery from "./use-api-query";

interface Props {
  androidAppMinVersion: string;
  iosAppMinVersion: string;
  androidUpdateUrl: string;
  iosUpdateUrl: string;
}

const useMinVersion = () => {
  return useApiQuery<Props>({
    url: "/config/app-version/transports",
    errorTitle: "Erro ao buscar versão mínima",
  });
};

export default useMinVersion;
