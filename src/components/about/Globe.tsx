import { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import landTopology from "world-atlas/land-110m.json";

// Where the marker goes.
const HOME = { lat: -7.7956, lon: 110.3695 };
const RADIUS = 1.35;

/** Geographic coordinates → a point on the sphere. */
function toVector(lat: number, lon: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
    );
}

function buildSegments(runs: THREE.Vector3[][]) {
    const vertices: number[] = [];
    for (const run of runs) {
        for (let i = 0; i < run.length - 1; i++) {
            vertices.push(
                run[i].x, run[i].y, run[i].z,
                run[i + 1].x, run[i + 1].y, run[i + 1].z,
            );
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(vertices), 3),
    );
    return geometry;
}

/**
 * Real coastlines, from Natural Earth's 110m land layer via world-atlas. The
 * TopoJSON is imported (≈55 KB, inside the lazily loaded three chunk) rather
 * than fetched at runtime — the page's CSP only allows 'self', so a texture or
 * dataset from a CDN would be blocked.
 *
 * Every ring becomes a run of line segments in one buffer, so the whole world
 * draws in a single call instead of ~130.
 */
function useCoastlines() {
    return useMemo(() => {
        const topology = landTopology as unknown as Topology;
        // objects.land is a GeometryCollection, so feature() hands back a
        // FeatureCollection — not the single Feature the name suggests.
        const land = feature(topology, topology.objects.land) as FeatureCollection<
            Polygon | MultiPolygon
        >;

        const rings: Position[][] = land.features.flatMap((f) =>
            f.geometry.type === "MultiPolygon"
                ? f.geometry.coordinates.flat()
                : f.geometry.coordinates,
        );

        // Lift the outline just off the surface so it never z-fights with the
        // sphere underneath it.
        return buildSegments(
            rings.map((ring) => ring.map((p) => toVector(p[1], p[0], RADIUS * 1.003))),
        );
    }, []);
}

/** The faint lat/long cage, for depth cues under the coastlines. */
function useGraticule() {
    return useMemo(() => {
        const runs: THREE.Vector3[][] = [];

        for (let lat = -60; lat <= 60; lat += 30) {
            const run: THREE.Vector3[] = [];
            for (let lon = -180; lon <= 180; lon += 5) run.push(toVector(lat, lon, RADIUS * 1.001));
            runs.push(run);
        }
        for (let lon = -180; lon < 180; lon += 30) {
            const run: THREE.Vector3[] = [];
            for (let lat = -90; lat <= 90; lat += 5) run.push(toVector(lat, lon, RADIUS * 1.001));
            runs.push(run);
        }

        return buildSegments(runs);
    }, []);
}

function Marker() {
    const position = useMemo(() => toVector(HOME.lat, HOME.lon, RADIUS * 1.012), []);
    const pulse = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!pulse.current) return;
        // A 3s breathing loop. This is the only thing still moving — it marks
        // the spot instead of animating the globe.
        const t = (clock.getElapsedTime() % 3) / 3;
        pulse.current.scale.setScalar(1 + t * 3);
        (pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - t);
    });

    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshBasicMaterial color="#047857" />
            </mesh>
            <mesh ref={pulse}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.45} />
            </mesh>
        </group>
    );
}

/** Camera distances the globe is allowed to sit at. */
const MIN_DISTANCE = 2.3;
const MAX_DISTANCE = 7;
const DEFAULT_DISTANCE = 4.1;

export interface GlobeHandle {
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
}

/**
 * The globe never moves on its own. Everything here is user-driven: drag to
 * spin it, pinch or ⌘/Ctrl-scroll to zoom, double-click to come home.
 *
 * Input only ever writes to `target`; the frame loop eases the live values
 * toward it. That keeps a fast flick from snapping and lets zoom and rotation
 * settle with the same weight.
 */
function World({ handle, dark }: { handle: React.Ref<GlobeHandle>; dark: boolean }) {
    const group = useRef<THREE.Group>(null);
    const { gl } = useThree();

    // Park the marker dead centre, facing the camera.
    //
    // A point's azimuth on this projection works out to lon + 90°, so undoing
    // that puts its meridian on the +Z axis where the camera sits. The group's
    // Euler order is XYZ, meaning Y is applied first and X tilts afterwards —
    // by which point the marker only needs lifting by its own latitude.
    const initial = useMemo(
        () => ({
            y: -(HOME.lon + 90) * (Math.PI / 180),
            x: HOME.lat * (Math.PI / 180),
        }),
        [],
    );

    const target = useRef({ x: initial.x, y: initial.y, distance: DEFAULT_DISTANCE });
    const live = useRef({ x: initial.x, y: initial.y, distance: DEFAULT_DISTANCE });

    // Pointers currently down on the canvas, so one finger rotates and two pinch.
    const pointers = useRef(new Map<number, { x: number; y: number }>());
    const pinchDistance = useRef(0);

    const zoomBy = (factor: number) => {
        target.current.distance = THREE.MathUtils.clamp(
            target.current.distance * factor,
            MIN_DISTANCE,
            MAX_DISTANCE,
        );
    };

    useImperativeHandle(
        handle,
        () => ({
            zoomIn: () => zoomBy(0.78),
            zoomOut: () => zoomBy(1.28),
            reset: () => {
                target.current = { x: initial.x, y: initial.y, distance: DEFAULT_DISTANCE };
            },
        }),
        [initial],
    );

    useEffect(() => {
        const canvas = gl.domElement;

        const spread = () => {
            const [a, b] = [...pointers.current.values()];
            return Math.hypot(a.x - b.x, a.y - b.y);
        };

        const down = (event: PointerEvent) => {
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if (pointers.current.size === 2) pinchDistance.current = spread();
            canvas.setPointerCapture(event.pointerId);
        };

        const move = (event: PointerEvent) => {
            const previous = pointers.current.get(event.pointerId);
            if (!previous) return;
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

            if (pointers.current.size >= 2) {
                const next = spread();
                if (pinchDistance.current > 0) {
                    zoomBy(pinchDistance.current / next);
                }
                pinchDistance.current = next;
                return;
            }

            const dx = event.clientX - previous.x;
            const dy = event.clientY - previous.y;
            // Rotation slows as you zoom in, so close-up dragging stays precise.
            const speed = 0.005 * (live.current.distance / DEFAULT_DISTANCE);
            target.current.y += dx * speed;
            // Clamp the tilt so the globe can never roll past its poles.
            target.current.x = THREE.MathUtils.clamp(target.current.x + dy * speed, -1.2, 1.2);
        };

        const up = (event: PointerEvent) => {
            pointers.current.delete(event.pointerId);
            if (pointers.current.size < 2) pinchDistance.current = 0;
            if (canvas.hasPointerCapture(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        };

        // Plain wheel scrolls the page — hijacking that on a widget this small
        // is hostile. A held modifier (or a trackpad pinch, which the browser
        // reports as ctrl+wheel) means zoom was actually asked for.
        const wheel = (event: WheelEvent) => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            zoomBy(1 + event.deltaY * 0.0015);
        };

        const doubleClick = () => {
            target.current = { x: initial.x, y: initial.y, distance: DEFAULT_DISTANCE };
        };

        canvas.addEventListener("pointerdown", down);
        canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up);
        canvas.addEventListener("pointercancel", up);
        canvas.addEventListener("wheel", wheel, { passive: false });
        canvas.addEventListener("dblclick", doubleClick);

        return () => {
            canvas.removeEventListener("pointerdown", down);
            canvas.removeEventListener("pointermove", move);
            canvas.removeEventListener("pointerup", up);
            canvas.removeEventListener("pointercancel", up);
            canvas.removeEventListener("wheel", wheel);
            canvas.removeEventListener("dblclick", doubleClick);
        };
    }, [gl, initial]);

    useFrame((state, delta) => {
        if (!group.current) return;
        // Frame-rate independent easing: the same glide on 60Hz and 120Hz.
        const ease = 1 - Math.pow(0.001, delta);

        live.current.x += (target.current.x - live.current.x) * ease;
        live.current.y += (target.current.y - live.current.y) * ease;
        live.current.distance += (target.current.distance - live.current.distance) * ease;

        group.current.rotation.x = live.current.x;
        group.current.rotation.y = live.current.y;
        state.camera.position.z = live.current.distance;
    });

    const coastlines = useCoastlines();
    const graticule = useGraticule();

    return (
        <group ref={group} rotation={[initial.x, initial.y, 0]}>
            {/* The ocean. Opaque, so the far-side coastlines stay hidden and the
                globe reads as a solid body rather than a wire cage. */}
            <mesh>
                <sphereGeometry args={[RADIUS, 64, 64]} />
                <meshBasicMaterial color={dark ? "#0f2b22" : "#ecfdf5"} />
            </mesh>
            <lineSegments geometry={graticule}>
                <lineBasicMaterial
                    color={dark ? "#34d399" : "#6ee7b7"}
                    transparent
                    opacity={dark ? 0.35 : 0.75}
                />
            </lineSegments>
            <lineSegments geometry={coastlines}>
                <lineBasicMaterial color={dark ? "#6ee7b7" : "#047857"} />
            </lineSegments>
            <Marker />
        </group>
    );
}

export default function Globe({
    handle,
    dark = false,
}: {
    handle: React.Ref<GlobeHandle>;
    dark?: boolean;
}) {
    return (
        <Canvas
            camera={{ position: [0, 0, DEFAULT_DISTANCE], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <World handle={handle} dark={dark} />
        </Canvas>
    );
}
