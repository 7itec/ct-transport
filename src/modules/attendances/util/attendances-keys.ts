const attendancesKeys = {
  module: ["attendances"] as const,
  list: () => [...attendancesKeys.module, "list"] as const,
  details: (id: string) => [...attendancesKeys.module, "details", id] as const,
  refuseReasons: () => [...attendancesKeys.module, "refuseReasons"],
};

export default attendancesKeys;
