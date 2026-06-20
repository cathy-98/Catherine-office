export type OfficeObjectId =
  | "projects"
  | "about"
  | "beyond"
  | "visual"
  | "timeline"
  | "process";

export type OfficeObjectKind =
  | "laptop"
  | "coffee"
  | "aurora"
  | "camera"
  | "window"
  | "notebook";

export type VectorTuple = [number, number, number];

export type OfficeObject = {
  id: OfficeObjectId;
  kind: OfficeObjectKind;
  label: string;
  title: string;
  body: string;
  modelPath: string;
  futureAction?: string;
  position: VectorTuple;
  rotation?: VectorTuple;
  scale?: number;
  focusPosition: VectorTuple;
};
