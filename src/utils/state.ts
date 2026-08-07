import { WorkUnit } from "./types.js";

export const fiberState: {
  wipFiber: WorkUnit | null;
  hookIndex: number | null;
  effectIndex: number,
  nextUnitOfWork: WorkUnit | null;
  workInProgressRoot: WorkUnit | null;
  currentRoot: WorkUnit | null;
  deletions: WorkUnit[] | null;
  pendingRender: boolean;
} = {
  wipFiber: null,
  hookIndex: null,
  nextUnitOfWork: null,
  workInProgressRoot: null,
  currentRoot: null,
  deletions: null,
  effectIndex: 0,
  pendingRender: false
};