import useApiQuery from "hooks/use-api-query";

export interface ChecklistItemProps {
  _id: string;
  name: string;
  description: string;
  group: "SEGURANÇA" | "ELÉTRICO" | "CARGA";
  models: string[];
  period: "DIÁRIO" | "SEMANAL" | "MENSAL";
  severity: "ALTA" | "MÉDIA" | "BAIXA";
  isForAllModels: boolean;
  alwaysRequireImage: boolean;
  active: boolean;
}

interface Props {
  checklistItems: ChecklistItemProps[];
  disapprovedChecklistItems: ChecklistItemProps[];
  postMaintenanceChecklistItems: ChecklistItemProps[];
}

const useVehicleChecklistItems = (vehicleId: string) => {
  const { data = {} as Props, ...query } = useApiQuery<Props>({
    url: `/checklist-items/vehicle/${vehicleId}?type=WORK_JOURNEY`,
    queryKey: ["checklist-items", "vehicles", vehicleId],
    errorTitle: "Erro ao buscar itens de checklist do veículo",
  });

  return { ...query, data };
};

export default useVehicleChecklistItems;
