import useStorage from "hooks/use-storage";

const useSkipUninformedStopUntil = () => {
  const [skipUninformedStopUntil, setSkipUninformedStopUntil] =
    useStorage<Date>("skipUninformedStopUntil");

  return { skipUninformedStopUntil, setSkipUninformedStopUntil };
};

export default useSkipUninformedStopUntil;
