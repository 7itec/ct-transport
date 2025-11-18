import useApiMutation from "hooks/use-api-mutations";
import formatAvatar from "../util/format-avatar";
import useQueryHelpers from "hooks/use-query-helpers";
import { UserProps } from "modules/work-journey/types";
import usersKeys from "../util/users-keys";

const useUpdateAvatar = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );

  const onSuccess = (data: any, uri: string) => {
    if (!profile) return;

    setData({ ...profile, avatar: uri });
  };

  return useApiMutation({
    method: "PATCH",
    url: "/users/me/profile-picture",
    errorTitle: "Erro ao atualizar foto de perfil",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onSuccess,
    formatData: formatAvatar,
  });
};

export default useUpdateAvatar;
