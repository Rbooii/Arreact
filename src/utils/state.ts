import { WorkUnit } from "./types.js";

export const fiberState: {
  wipFiber: WorkUnit | null;
  hookIndex: number | null;
  nextUnitOfWork: WorkUnit | null;
  workInProgressRoot: WorkUnit | null;
  currentRoot: WorkUnit | null;
  deletions: WorkUnit[] | null;
} = {
  wipFiber: null,
  hookIndex: null,
  nextUnitOfWork: null,
  workInProgressRoot: null,
  currentRoot: null,
  deletions: null,
};