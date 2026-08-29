"use client";

import { ChangeEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";

const VIEWPORT = 280;
const OUTPUT = 512;

type Props = {
  onCropped: (dataUrl: string) => void;
  onCancel: () => void;
};

/**
 * Square avatar cropper: pick a file, drag to reposition, zoom, then export a
 * 512x512 JPEG data URL. Deliberately dependency-free so it adds no bundle weight.
 */
export default function AdminAvatarCropper({ onCropped, onCancel }: Props) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const dragState = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const baseScale = image ? VIEWPORT / Math.min(image.naturalWidth, image.naturalHeight) : 1;
  const scale = baseScale * zoom;
  const drawnWidth = image ? image.naturalWidth * scale : 0;
  const drawnHeight = image ? image.naturalHeight * scale : 0;

  const clamp = useCallback((next: { x: number; y: number }) => ({
    x: Math.min(0, Math.max(VIEWPORT - drawnWidth, next.x)),
    y: Math.min(0, Math.max(VIEWPORT - drawnHeight, next.y)),
  }), [drawnWidth, drawnHeight]);

  useEffect(() => { setOffset(current => clamp(current)); }, [clamp]);

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choose an image file.");
    if (file.size > 12_000_000) return setError("That image is larger than 12 MB. Pick a smaller one.");
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const element = new window.Image();
      element.onload = () => {
        setImage(element);
        setZoom(1);
        const width = element.naturalWidth * (VIEWPORT / Math.min(element.naturalWidth, element.naturalHeight));
        const height = element.naturalHeight * (VIEWPORT / Math.min(element.naturalWidth, element.naturalHeight));
        setOffset({ x: (VIEWPORT - width) / 2, y: (VIEWPORT - height) / 2 });
      };
      element.onerror = () => setError("That image could not be read.");
      element.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!image) return;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragState.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    if (!state) return;
    setOffset(clamp({ x: state.ox + (event.clientX - state.x), y: state.oy + (event.clientY - state.y) }));
  }

  function endDrag() { dragState.current = null; }

  function apply() {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const context = canvas.getContext("2d");
    if (!context) return setError("Cropping is not supported in this browser.");
    const ratio = OUTPUT / VIEWPORT;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, OUTPUT, OUTPUT);
    context.drawImage(image, offset.x * ratio, offset.y * ratio, drawnWidth * ratio, drawnHeight * ratio);
    onCropped(canvas.toDataURL("image/jpeg", 0.86));
  }

  return (
    <div className="cropper">
      {!image ? (
        <label className="cropper-drop">
          <span>Choose a photo</span>
          <small>JPG or PNG. You&apos;ll position and zoom it before saving.</small>
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
      ) : (
        <>
          <div
            className="cropper-frame"
            style={{ width: VIEWPORT, height: VIEWPORT }}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt="Crop preview"
              draggable={false}
              style={{ width: drawnWidth, height: drawnHeight, transform: `translate(${offset.x}px, ${offset.y}px)` }}
            />
            <div className="cropper-mask" />
          </div>
          <label className="cropper-zoom">
            Zoom
            <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={event => setZoom(Number(event.target.value))} />
          </label>
          <p className="cropper-hint">Drag the photo to reposition it inside the circle.</p>
        </>
      )}
      {error && <p className="error">{error}</p>}
      <div className="cropper-actions">
        <button type="button" className="button small" onClick={apply} disabled={!image}>Use this photo</button>
        <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
