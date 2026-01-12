import { useState } from "react";
import { LatLng } from "react-native-maps";
import dateFnsHelpers from "util/date-fns-helpers";
import Toast from "react-native-toast-message";
import useCreateDisplacement from "../hooks/use-create-displacement";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import { BottomSheetOptionProps } from "components/bottom-sheet";
import axios from "axios";
import locationIqToAdress from "util/location-iq-to-adress";
import useLogs from "hooks/use-logs";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";

interface CreateDisplacementAddressProps {
  address: string;
  neighborhood: string;
  state: string;
  city: string;
  country: string;
  addressLat: string;
  addressLng: string;
}

const useDisplacementState = () => {
  const [type, setType] = useState<"VAZIO" | "RETORNO">();
  const [startDate, setDate] = useState(
    dateFnsHelpers.addMinutes(new Date(), 10)
  );
  const isServerConnection = useServerConnection();
  const [searchEnable, setEnableSearch] = useState(true);
  const [typeBottomSheet, showTypeBottomSheet] = useState(false);
  const [addressBottomSheet, showAddressBottomSheet] = useState(false);
  const [neighborhoodBottomSheet, showNeighborhoodBottomSheet] =
    useState(false);

  const [address, setAddress] = useState<CreateDisplacementAddressProps>();
  const [datePicker, showDatePicker] = useState(false);
  const [timePicker, showTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const trackEvent = useLogs();
  const { data } = useCurrentWorkJourney();

  const createDisplacementMutation = useCreateDisplacement();

  const handleChangeDisplacementType = (value: "VAZIO" | "RETORNO") => {
    setType(value);
  };

  const onChange = (date: Date) => {
    showDatePicker(false);
    showTimePicker(false);
    setDate(date);
  };

  const openMapToSearchAddress = () => {
    setEnableSearch(true);
    setShowMap(true);
  };

  const openMapToGetCoordinates = () => {
    setEnableSearch(false);
    setShowMap(true);
  };

  const createAddressManually = () => {
    // @ts-ignore
    setAddress({});
  };

  const handleMapChange = async (data: LatLng) => {
    if (isServerConnection && searchEnable) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/reverse.php?key=acdcc1501fe6c8&lat=${data.latitude}&lon=${data.longitude}&format=json`
        );

        setAddress(locationIqToAdress(response.data));
      } catch (error) {}
    } else
      setAddress({
        ...address!,
        addressLng: data.longitude.toString(),
        addressLat: data.latitude.toString(),
      });
    setShowMap(false);
  };

  const showError = (title: string, message: string) =>
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
    });

  const editAddress = (key: string) => (value: string) => {
    // @ts-ignore
    setAddress({
      ...address,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    if (!dateFnsHelpers.isAfter(startDate, new Date()))
      return showError(
        "Data inválida",
        "A data de inicio precisa ser maior que a data atual"
      );

    if (!type)
      return showError(
        "Tipo do deslocamento",
        "Por favor selecione o tipo do deslocamento"
      );

    if (!address?.address)
      return showError("Erro no endereço", "Logradouro não informado");

    if (!address?.city)
      return showError("Erro no endereço", "Cidade não informada");

    if (!address?.state)
      return showError("Erro no endereço", "Estado não informado");

    trackEvent("Create Displacement", {
      type,
      startDate,
      address,
    });

    createDisplacementMutation.mutate({
      type,
      startDate,
      driverId: data?.driverId,
      recipientAddress: address,
      vehiclePlate: data?.currentWorkJourney?.conductorVehicle?.plate,
    });
  };

  const options: BottomSheetOptionProps[] = [
    {
      label: "Informar endereço manualmente",
      onPress: createAddressManually,
      visible: !address,
    },
    {
      label: "Pesquisar endereço",
      onPress: () => {
        setShowSearch(true);
      },
    },
    { label: "Selecionar no mapa", onPress: openMapToSearchAddress },
  ];

  return {
    type,
    datePicker,
    timePicker,
    showMap,
    showSearch,
    startDate,
    isServerConnection,
    loading: false,
    isLoadingCreate: createDisplacementMutation.isLoading,
    address,
    options,
    editAddress,
    handleSubmit,
    handleChangeDisplacementType,
    onChange,
    openMapToGetCoordinates,
    handleMapChange,
    showDatePicker,
    showTimePicker,
    setShowSearch,
    setShowMap,
    setAddress,
    typeBottomSheet,
    addressBottomSheet,
    showTypeBottomSheet,
    showAddressBottomSheet,
    neighborhoodBottomSheet,
    showNeighborhoodBottomSheet,
  };
};

export default useDisplacementState;
