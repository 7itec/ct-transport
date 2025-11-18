const usersKeys = {
  module: ["users"] as const,
  profile: () => [...usersKeys.module, "profile"] as const,
  refuseReasons: () => [...usersKeys.module, "refuseReasons"],
  workStops: () => [...usersKeys.module, "workStops"],
};

export default usersKeys;
