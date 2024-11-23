type AgendaParams = {
  weekOffset?: number;
  dayOffset?: number;
};

export type MainStackParamList = {
  Home: undefined;
  Agenda: AgendaParams;
};
