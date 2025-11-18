import useStorage from "hooks/use-storage";

const useNotificationsPermission = () => {
  const [notificationsPermission, setNotificationsPermission] =
    useStorage<boolean>("notificationsPermission", false);
  return { notificationsPermission, setNotificationsPermission };
};

export default useNotificationsPermission;
