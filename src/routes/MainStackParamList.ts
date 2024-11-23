type AgendaParams = {
  weekOffset?: number;
  dayOffset?: number;
};

type SupplierListParams = {
  initialText?: string;
};

export type MainStackParamList = {
  Home: undefined;
  Agenda: AgendaParams;
  SupplierList: SupplierListParams;
};
