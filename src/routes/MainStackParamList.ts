type AgendaParams = {
  weekOffset?: number;
  dayOffset?: number;
};

type SupplierListParams = {
  initialText?: string;
};

type SupplierDetailParams = {
  id: number;
};

export type MainStackParamList = {
  Home: undefined;
  Agenda: AgendaParams;
  ImportantSuppliers: undefined;
  SupplierList: SupplierListParams;
  SupplierDetail: SupplierDetailParams;
  AddSupplier: undefined;
};
