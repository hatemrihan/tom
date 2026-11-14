/**
 * Export, done in the visitor's own browser. Nothing is uploaded.
 *
 * There are two ways to turn the stage into pixels, and each browser gets the
 * best one it has:
 *
 *  - "native": the stage is laid out inside a <canvas content="drawable"> and
 *    the browser draws the live HTML into it, as sharp as the page itself
 *    (HTML-in-Canvas, Chrome and Edge 157 and later).
 *  - "svg": the stage is copied into an SVG image and that image is drawn on a
 *    canvas. Slower, and it works in Safari and Firefox.
 *
 * Either way each frame ends up on one canvas, which is handed to the
 * browser's own video encoder.
 */

export type Engine = "native" | "svg";

type DrawableContext = CanvasRenderingContext2D & {
  drawElementImage: (element: Element, dx: number, dy: number, dw: number, dh: number) => void;
};
type DrawableCanvas = HTMLCanvasElement & { onpaint: (() => void) | null; requestPaint: () => void };

/** Can this browser draw live HTML into a canvas? */
function hasNative() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("content", "drawable");
  return (canvas as unknown as { content?: string }).content === "drawable" && "drawElementImage" in CanvasRenderingContext2D.prototype && "requestPaint" in canvas;
}

/** The way this browser will render. `?engine=svg` forces the slower one, to test it. */
export function pickEngine(): Engine {
  if (typeof document === "undefined") return "svg";
  const forced = new URLSearchParams(window.location.search).get("engine");
  if (forced === "svg") return "svg";
  return hasNative() ? "native" : "svg";
}

/** Video needs the browser's encoder. Without it, pictures can still be saved. */
export const canEncode = () => typeof window !== "undefined" && "VideoEncoder" in window && "VideoFrame" in window;

const tabVisible = () =>
  document.hidden
    ? new Promise<void>((resolve) => {
        const check = () => {
          if (document.hidden) return;
          document.removeEventListener("visibilitychange", check);
          resolve();
        };
        document.addEventListener("visibilitychange", check);
      })
    : Promise.resolve();

/** Draws the stage, as it stands right now, onto the canvas that holds it. */
async function drawNative(canvas: HTMLCanvasElement, stage: Element) {
  const c = canvas as DrawableCanvas;
  const ctx = c.getContext("2d") as DrawableContext;
  // A browser does not paint a tab nobody is looking at, so wait until it is back.
  for (let attempt = 0; ; attempt++) {
    await tabVisible();
    const painted = await new Promise<boolean>((resolve, reject) => {
      const timer = setTimeout(() => {
        c.onpaint = null;
        resolve(false);
      }, 3000);
      c.onpaint = () => {
        clearTimeout(timer);
        c.onpaint = null;
        try {
          ctx.reset();
          ctx.drawElementImage(stage, 0, 0, c.width, c.height);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      c.requestPaint();
    });
    if (painted) return;
    if (!document.hidden && attempt >= 2) throw new Error("The browser stopped painting. Keep this tab in front and try again.");
  }
}

export interface Painter {
  /** Puts the stage, as it stands right now, on the canvas. */
  draw: () => Promise<void>;
  dispose: () => void;
}

/** Sets up one of the two ways of drawing the stage. */
export async function createPainter(engine: Engine, canvas: HTMLCanvasElement, stage: HTMLElement, width: number, height: number): Promise<Painter> {
  if (engine === "native") return { draw: () => drawNative(canvas, stage), dispose: () => {} };

  const { createContext, destroyContext, domToCanvas } = await import("modern-screenshot");
  const context = await createContext(stage, {
    width,
    height,
    scale: canvas.width / width,
    autoDestruct: false,
    // Films are drawn onto a canvas beside them (see below), which copies far faster than a film does.
    filter: (node) => !(node instanceof HTMLVideoElement),
  });
  const ctx = canvas.getContext("2d")!;

  return {
    draw: async () => {
      for (const film of stage.querySelectorAll("video")) {
        let still = film.nextElementSibling as HTMLCanvasElement | null;
        if (!still || still.dataset.motionStill === undefined) {
          still = document.createElement("canvas");
          still.dataset.motionStill = "";
          still.className = film.className;
          film.after(still);
        }
        if (film.videoWidth && (still.width !== film.videoWidth || still.height !== film.videoHeight)) {
          still.width = film.videoWidth;
          still.height = film.videoHeight;
        }
        if (film.videoWidth) still.getContext("2d")!.drawImage(film, 0, 0, still.width, still.height);
      }
      const shot = await domToCanvas(context);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(shot, 0, 0, canvas.width, canvas.height);
    },
    dispose: () => destroyContext(context),
  };
}

/** Moves every film on the stage to the moment `time` (ms) and waits until its picture is ready. */
export function seekMedia(root: Element, time: number) {
  const films = Array.from(root.querySelectorAll("video"));
  return Promise.all(
    films.map(
      (film) =>
        new Promise<void>((resolve) => {
          // A film that cannot be played must never hold the export up.
          const giveUp = setTimeout(resolve, 5000);
          const finish = () => {
            clearTimeout(giveUp);
            resolve();
          };
          const seek = () => {
            const length = Number.isFinite(film.duration) ? film.duration : 0;
            const start = Number(film.dataset.motionStart ?? 0);
            const at = Math.max(0, (time - start) / 1000);
            const target = length ? Math.min(at % length, Math.max(0, length - 0.05)) : 0;
            film.pause();
            if (Math.abs(film.currentTime - target) < 0.001 && film.readyState >= 2) return finish();
            film.addEventListener("seeked", finish, { once: true });
            film.currentTime = target;
          };
          if (film.error) return finish();
          film.addEventListener("error", finish, { once: true });
          if (film.readyState >= 1) seek();
          else film.addEventListener("loadedmetadata", seek, { once: true });
        }),
    ),
  );
}

/** Waits for pictures on the stage to finish loading. One that fails is left out. */
export function imagesReady(root: Element) {
  return Promise.all(
    Array.from(root.querySelectorAll("img")).map((img) =>
      img.complete
        ? img.decode().catch(() => {})
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  );
}

export function toPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not save the image."))), "image/png"));
}

/** Starts a download. The link is also kept on screen, in case the browser held this one back. */
export function download(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Encodes an MP4, one frame at a time. `frame(time)` must put the stage at that
 * moment and draw it on the canvas before it resolves.
 */
export async function encodeMp4({
  canvas,
  fps,
  duration,
  frame,
  onProgress,
  cancelled,
}: {
  canvas: HTMLCanvasElement;
  fps: number;
  /** ms */
  duration: number;
  frame: (time: number) => Promise<void>;
  onProgress: (done: number, total: number) => void;
  cancelled: () => boolean;
}) {
  const { Output, Mp4OutputFormat, BufferTarget, CanvasSource, QUALITY_VERY_HIGH, getFirstEncodableVideoCodec } = await import("mediabunny");

  // "in-memory" puts the index at the front of the file, so it plays at once wherever it is posted.
  const output = new Output({ format: new Mp4OutputFormat({ fastStart: "in-memory" }), target: new BufferTarget() });
  const codec = await getFirstEncodableVideoCodec(output.format.getSupportedVideoCodecs(), { width: canvas.width, height: canvas.height });
  if (!codec) throw new Error("This browser cannot make a video this large. Try HD.");

  const source = new CanvasSource(canvas, { codec, bitrate: QUALITY_VERY_HIGH });
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();

  const total = Math.max(1, Math.round((duration / 1000) * fps));
  try {
    for (let i = 0; i < total; i++) {
      if (cancelled()) {
        await output.cancel();
        return null;
      }
      await frame((i * 1000) / fps);
      await source.add(i / fps, 1 / fps);
      onProgress(i + 1, total);
    }
    await output.finalize();
  } catch (error) {
    await output.cancel().catch(() => {});
    throw error;
  }

  const buffer = output.target.buffer;
  if (!buffer) throw new Error("The video came out empty.");
  return new Blob([buffer], { type: "video/mp4" });
}
