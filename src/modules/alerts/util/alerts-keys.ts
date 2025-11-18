const alertsKeys = {
  module: ["alerts"] as const,
  list: () => [...alertsKeys.module, "list"] as const,
  details: (id: string) => [...alertsKeys.module, "details", id] as const,
};

export default alertsKeys;
