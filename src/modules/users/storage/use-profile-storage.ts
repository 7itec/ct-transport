import useStorage from "hooks/use-storage";
import { UserProps } from "modules/work-journey/types";
import usersKeys from "../util/users-keys";

const useProfileStorage = () => {
  const [profile, setProfile] = useStorage<UserProps | undefined>(
    usersKeys.profile()
  );

  return { profile, setProfile };
};

export default useProfileStorage;
