import { commitRoot } from "./utils/commit.js";
import { createElement, createTextElement } from "./utils/element.js";
import { performUnitofWork } from "./utils/fiber.js";
import { fiberState } from "./utils/state.js";
import { useState } from "./hooks/useState.js";
import { ArreactElement } from "./utils/types.js";
import { useEffect } from "./hooks/useEffect.js";

requestIdleCallback(workLoop);

function workLoop(deadline: IdleDeadline) {
    let shouldYield: boolean = false;
    while (fiberState.nextUnitOfWork && !shouldYield) {
        const next = fiberState.nextUnitOfWork;
        fiberState.nextUnitOfWork = performUnitofWork(next);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!fiberState.nextUnitOfWork && fiberState.workInProgressRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

function render(container: HTMLElement | Text, obj: ArreactElement) {
    fiberState.workInProgressRoot = {
        dom: container,
        props: {
            children: [obj]
        },
        alternate: fiberState.currentRoot
    }
    fiberState.deletions = [];
    fiberState.nextUnitOfWork = fiberState.workInProgressRoot;
}

export const Arreact = {
    createElement,
    createTextElement,
    render,
    useState,
    useEffect
}