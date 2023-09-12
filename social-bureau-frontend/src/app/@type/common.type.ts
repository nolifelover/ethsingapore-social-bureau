export type InputElementEvent = Event & { target: HTMLInputElement };

export type NestHttpException = {
  status: number;
  message: string;
};

export type PageInfo = {
  limit: number;
  page: number;
  totalPages: number;
  totalResults: number;
};

export type Time = {
  _seconds: number;
  _nanoseconds: number;
};
