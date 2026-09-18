import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Catches anything the globe throws on its way up.
 *
 * It has to be a class: `componentDidCatch` has no hook equivalent, and there
 * is nothing else in this app that needs one, so the boundary is kept local to
 * the one subtree that can fail rather than made into a general-purpose
 * component nobody else uses.
 *
 * The failure it exists for is a WebGL context that cannot be created. That
 * throws from inside the renderer during three.js's own setup, which is a React
 * render — so without a boundary here it unwinds past the About page and takes
 * the whole document with it.
 */
export default class GlobeBoundary extends Component<
    { children: ReactNode; fallback: ReactNode; onError?: () => void },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.props.onError?.();
        // Left on the console on purpose: a globe that silently refuses to draw
        // is a bug worth finding, and this is the only trace of it.
        console.warn("Globe could not render, falling back.", error, info.componentStack);
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}
