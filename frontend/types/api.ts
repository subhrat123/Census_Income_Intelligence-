export type IncomeBucket = {
  income: string;
  count: number;
};

export type WorkclassBucket = {
  workclass: string;
  count: number;
};

export type Metrics = {
  total_records: number;
  average_age: number;
  average_hours_per_week: number;
  income_distribution: IncomeBucket[];
  workclass_distribution: WorkclassBucket[];
};

export type MetricsResponse = {
  success: boolean;
  metrics: Metrics;
};

export type RecordRow = {
  age?: number;
  workclass?: string;
  education_level?: string;
  occupation?: string;
  income?: string;
  "hours-per-week"?: number;
  [key: string]: string | number | boolean | null | undefined;
};

export type RecordsResponse = {
  success: boolean;
  page: number;
  limit: number;
  search: string;
  workclass: string;
  sort: string;
  order: "asc" | "desc";
  count: number;
  data: RecordRow[];
};

export type RecordsQuery = {
  page: number;
  limit: number;
  search?: string;
  workclass?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export type PredictRequest = {
  age: number;
  education_num: number;
  capital_gain: number;
  capital_loss: number;
  hours_per_week: number;
};

export type PredictResponse = {
  success: boolean;
  result: {
    prediction: string;
    raw_prediction: number;
  };
};
