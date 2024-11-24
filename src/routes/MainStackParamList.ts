type AgendaParams = {
  weekOffset?: number;
  dayOffset?: number;
};

type SupplierListParams = {
  initialText?: string;
};

type SupplierDetailParams = {
  id: string;
};

export type MainStackParamList = {
  Home: undefined;
  Agenda: AgendaParams;
  ImportantSuppliers: undefined;
  SupplierList: SupplierListParams;
  SupplierDetail: SupplierDetailParams;
  AddSupplier: undefined;
};
