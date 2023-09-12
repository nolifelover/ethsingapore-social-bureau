import { PageInfo, Time } from "./common.type";

export type HistoryResult = {
  uid: string;
  crimeId: string;
  createdAt: Time;
  action: string;
  power: number;
  refId: string;
  id: string;
  type: string;
  message: string;
  updatedAt: Time;
};

export type HistoryPayloadWithPageInfo = PageInfo & {
  results: HistoryResult[];
};
