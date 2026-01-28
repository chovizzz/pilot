# Interactive Product 360 (Image Sequence) – Architecture & Dev Guide

This section implements a **pseudo‑3D 360° product viewer** using an **image sequence** (e.g. 36 frames, 10° step) with:
- Mouse drag + touch swipe rotation
- Optional auto-rotate
- Client-side caching (IndexedDB) + preload + decode to prevent flicker

Relevant code:
- `weaverse/templates/pilot/app/sections/interactive-product-360/index.tsx`
- `weaverse/templates/pilot/app/sections/interactive-product-360/image-cache.ts`
- `weaverse/templates/pilot/app/sections/interactive-product-360/item.tsx`

## High-level Architecture

### State & Refs (core runtime model)
- **`currentAngle` (state)**: The angle we render *now*.
- **`targetAngleRef` (ref)**: The angle the user/auto-rotate *wants* to reach.
- **Damping loop**: Smoothly moves `currentAngle` toward `targetAngleRef.current`.

Image pipeline:
- **`images[]`**: URLs extracted from Weaverse child instances.
- **`currentImageIndex`**: Derived from `currentAngle`.
- **`currentImageBlobUrl` (state)**: The currently displayed `blob:` URL.
- **`blobUrlMapRef: Map<originalUrl, blobUrl>`**: In-memory cache of created `blob:` URLs.
- **`imageCache` (IndexedDB)**: Persistent cache of **Blob** keyed by original URL.

### Angle → Frame Mapping
- For `TOTAL_IMAGES = 36`, `ANGLE_STEP = 10`:
  - Normalize angle to `[0, 360)` and compute:
    - `index = floor(normalizedAngle / ANGLE_STEP)`
  - Index is clamped to `[0, images.length - 1]`.

This mapping is intentionally simple and stable; it avoids fractional frames.

## Interaction Model

### Drag/Swipe
- On drag start:
  - `startXRef` captures initial pointer x.
  - `startAngleRef` captures the angle baseline (typically `targetAngleRef.current`).
  - Auto-rotate is paused.
- On move:
  - Convert deltaX to degrees and update `targetAngleRef.current`.
  - Apply a small lerp to `currentAngle` to guarantee immediate on-drag feedback even if RAF timing jitters.
- On release:
  - Damping continues until `currentAngle` converges to `targetAngleRef.current`.

### Damping (OrbitControls-like feel)
The viewer uses a continuous RAF loop to perform a lerp-like update:

- `currentAngle = currentAngle + (targetAngle - currentAngle) * dampingFactor`

This gives “enableDamping” behavior (smooth follow), not a physics “inertia fling”.

## Auto-Rotate

Auto-rotate is a timer that increments angle at a consistent rate.

Important design choice:
- During auto-rotate, **we avoid showing original URLs as placeholders** (that can cause `blob:` ↔ original URL toggling).
- Instead, we keep the last good frame on screen and swap only when the next frame is ready (see “Flicker Prevention”).

## Caching & Performance Strategy

### 1) IndexedDB stores **Blob** (not blob URL)
`image-cache.ts` stores:
- key: original image URL
- value: `{ url, blob, timestamp }`

At runtime:
- We create `blob:` URLs via `URL.createObjectURL(blob)` **only when needed**, and revoke them on unmount.

### 2) Warmup on init: IndexedDB → in-memory blobUrlMap
On component mount (once `images[]` is available), we run a **throttled warmup**:
- For each URL:
  - `blob = await imageCache.get(url)`
  - If found: `blobUrl = URL.createObjectURL(blob)` and store in `blobUrlMapRef`.

This allows mid/late frames (the “second half”) to be instantly available without network fetch.

### 3) Preload strategy
We combine three layers:
- **Priority preload**: head 5 + tail 5 frames.
- **Adjacent preload**: window around current index (larger window during auto-rotate).
- **Idle preload**: remaining frames via `requestIdleCallback` fallbacking to `setTimeout`.

### 4) Pre-decode strategy (batch)
To prevent flicker/white flash due to decode timing:
- We pre-decode multiple upcoming frames (not just one) using:
  - `img = new Image(); img.src = blobUrl; await img.decode()`

We apply decoding:
- After preloading high priority adjacent windows
- After each batch in full auto-rotate preload
- For idle-loaded frames (single decode per frame)

### 5) Throttling / concurrency limits
We use:
- `batchSize`
- `concurrency`
- `delayMs` between batches

This prevents:
- Main thread stalls
- Too many simultaneous fetch/decode operations
- Cache thrash on low-end devices

## Flicker Prevention (Key Mechanisms)

The main causes of flicker in image-sequence 360 viewers:
1. Switching to an unloaded frame (blank)
2. Switching between `blob:` and original URL (layout/paint thrash)
3. Decode not completed when the frame becomes visible

Mitigations implemented:
- **Warmup** IndexedDB blobs early and store blob URLs in `blobUrlMapRef`.
- **Preload** adjacent frames aggressively during auto-rotate.
- **Pre-decode** upcoming frames in batches.
- **Swap only when ready** during auto-rotate:
  - Do not set `currentImageBlobUrl` to original URL as a placeholder.
  - Keep last frame until new frame is cached + decoded.

## Memory Management

We create many `blob:` URLs during warmup and preload.
- On unmount, we revoke:
  - `URL.revokeObjectURL(blobUrl)` for all entries in `blobUrlMapRef`

Important:
- IndexedDB keeps Blob data; blob URLs are ephemeral and must be recreated per session.

## Weaverse Integration

The section consumes `useChildInstances()` to obtain child items.

Each child uses schema type:
- `interactive-product-360--item`

The parent schema:
- `interactive-product-360`

## Debugging Checklist

If rotation doesn’t update:
- Verify `mousemove/touchmove` listeners are active (drag state toggles).
- Confirm `targetAngleRef.current` changes when dragging.
- Confirm `currentAngle` changes (damping loop running).

If “still image” / no frame changes:
- Check `images.length` equals expected frame count (e.g., 36).
- Check URLs are parsed correctly from Weaverse image data.

If flicker happens in auto-rotate:
- Confirm warmup is running and filling `blobUrlMapRef`.
- Confirm pre-decode is being called for upcoming frames.
- Ensure auto-rotate path does not fallback to original URL placeholder.

If memory grows too high:
- Reduce:
  - warmup concurrency
  - warmup batch size
  - auto-rotate preload window size

## Tuning Knobs

In `index.tsx`:
- Warmup:
  - `CACHE_WARMUP_BATCH_SIZE`
  - `CACHE_WARMUP_CONCURRENCY`
  - `CACHE_WARMUP_DELAY_MS`
- Decode:
  - `DECODE_CONCURRENCY`
- Adjacent window size:
  - `preloadCount` (auto-rotate vs drag)


