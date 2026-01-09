import useStorage from "hooks/use-storage";

const useSkipLuncthTimeUntil = () => {
  const [skipLunchTimeUntil, setSkipLunchTimeUntil] = useStorage<Date | null>(
    "skipLunchTimeUntil"
  );

  return { skipLunchTimeUntil, setSkipLunchTimeUntil };
};

export default useSkipLuncthTimeUntil;
