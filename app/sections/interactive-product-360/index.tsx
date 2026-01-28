import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";
import { InteractiveProduct360Item } from "./item";
import { imageCache, loadImageAsBlobUrl } from "./image-cache";

const TOTAL_IMAGES = 36; // 固定36张图片
const ANGLE_STEP = 10; // 每张图片间隔10度

const CACHE_WARMUP_BATCH_SIZE = 6;
// 降低并发数，避免 ERR_INSUFFICIENT_RESOURCES
const CACHE_WARMUP_CONCURRENCY = 2; // 从 3 降到 2
const CACHE_WARMUP_DELAY_MS = 60; // 增加延迟，从 40 到 60
const DECODE_CONCURRENCY = 2; // 从 3 降到 2

interface InteractiveProduct360Data {
  maxWidth?: number;
  padding?: number;
  bgColor?: string;
  autoRotate?: boolean;
  rotationSpeed?: number; // 秒/圈
  sensitivity?: number; // 鼠标/触摸灵敏度
  transitionDuration?: number; // 切换动画时长（秒）
  showControls?: boolean;
  showResetButton?: boolean; // 显示复位按钮
  resetButtonText?: string; // 复位按钮文本
  resetButtonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; // 复位按钮位置
  aspectRatio?: string;
}

type InteractiveProduct360Props =
  HydrogenComponentProps<InteractiveProduct360Data>;

export const InteractiveProduct360 = forwardRef<
  HTMLDivElement,
  InteractiveProduct360Props
>((props, ref) => {
  const {
    maxWidth = 600,
    padding = 20,
    bgColor = "#ffffff",
    autoRotate = false,
    rotationSpeed = 3, // 默认3秒一圈
    sensitivity = 1,
    transitionDuration = 0.3,
    showControls = false,
    showResetButton = true,
    resetButtonText = "Reset",
    resetButtonPosition = "top-right",
    aspectRatio = "1/1",
    ...rest
  } = props as InteractiveProduct360Data & typeof props;

  const animation = useAnimation();
  const childInstances = useChildInstances();

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const runWithConcurrency = async <T,>(
    items: T[],
    concurrency: number,
    worker: (item: T) => Promise<void>,
  ) => {
    const queue = [...items];
    const runners = Array.from({
      length: Math.max(1, Math.min(concurrency, items.length)),
    }).map(async () => {
      while (queue.length) {
        const item = queue.shift();
        if (!item) return;
        try {
          await worker(item);
        } catch {
          // ignore; worker should log
        }
      }
    });
    await Promise.all(runners);
  };

  const warmupCacheFromIndexedDB = useCallback(
    async (
      urls: string[],
      opts: {
        batchSize?: number;
        concurrency?: number;
        delayMs?: number;
      } = {},
    ) => {
      if (typeof window === "undefined") return;
      if (urls.length === 0) return;

      const batchSize = opts.batchSize ?? CACHE_WARMUP_BATCH_SIZE;
      const concurrency = opts.concurrency ?? CACHE_WARMUP_CONCURRENCY;
      const delayMs = opts.delayMs ?? CACHE_WARMUP_DELAY_MS;

      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await runWithConcurrency(batch, concurrency, async (url) => {
          if (blobUrlMapRef.current.has(url)) return;
          const blob = await imageCache.get(url);
          if (!blob) return;
          try {
            const blobUrl = URL.createObjectURL(blob);
            blobUrlMapRef.current.set(url, blobUrl);
          } catch (e) {
            console.warn("Failed to create blob URL from cache:", e);
          }
        });
        if (i + batchSize < urls.length && delayMs > 0) {
          await sleep(delayMs);
        }
      }
    },
    [],
  );

  const decodeBlobUrls = useCallback(
    async (urls: string[], opts: { concurrency?: number } = {}) => {
      if (typeof window === "undefined") return;
      if (urls.length === 0) return;

      const concurrency = opts.concurrency ?? DECODE_CONCURRENCY;

      await runWithConcurrency(urls, concurrency, async (url) => {
        const blobUrl = blobUrlMapRef.current.get(url);
        if (!blobUrl) return;

        // decode() is the most reliable way to ensure the next frame is ready before swap
        const img = new window.Image();
        img.decoding = "async";
        img.src = blobUrl;
        try {
          if (img.decode) {
            await img.decode();
          } else {
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error("Image decode failed"));
            });
          }
        } catch (e) {
          // If decode fails, still allow; browser may decode on draw
          console.warn("Image decode failed:", e);
        }
      });
    },
    [],
  );

  // State
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [justReleased, setJustReleased] = useState(false); // 刚释放拖拽的标志
  
  // 初始化目标角度
  useEffect(() => {
    targetAngleRef.current = currentAngle;
  }, []);

  // 同步目标角度和当前角度（当 currentAngle 从外部改变时，如自动旋转）
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      // 自动旋转时，同步目标角度
      targetAngleRef.current = currentAngle;
    }
  }, [currentAngle, isAutoRotating, isDragging]);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number>(0);
  const startAngleRef = useRef<number>(0);
  const blobUrlMapRef = useRef<Map<string, string>>(new Map()); // 存储 blob URL，避免重复创建
  const loadedImagesRef = useRef<Set<number>>(new Set()); // 跟踪已加载的图片索引
  const targetAngleRef = useRef<number>(0); // 目标角度（拖拽时的目标值）
  const dampingAnimationRef = useRef<number | null>(null); // 阻尼动画帧ID

  // Get images from child instances - use useMemo to ensure proper updates
  const images = useMemo(() => {
    return childInstances.map((child) => {
      const data = child.data as any;
      const image = data?.image;
      if (!image) return null;
      
      // Handle WeaverseImage object structure
      if (typeof image === "object" && image !== null) {
        // WeaverseImage might have url property directly or nested
        const url = image.url || (image as any).src || (image as any).imageUrl;
        if (url) {
          const imageUrl = typeof url === "string" ? url : url.url || url.src || "";
          if (imageUrl) {
            return {
              url: imageUrl,
              altText: image.altText || image.alt || "Product image",
            };
          }
        }
      }
      
      // Handle string URL
      if (typeof image === "string") {
        return { url: image, altText: "Product image" };
      }
      
      return null;
    }).filter(Boolean) as Array<{ url: string; altText?: string }>;
  }, [childInstances]);

  // Warm up blobUrlMap from IndexedDB as early as possible (batch + throttled)
  useEffect(() => {
    if (images.length === 0) return;
    const urls = images.map((i) => i.url).filter(Boolean);
    warmupCacheFromIndexedDB(urls).catch((e) => {
      console.warn("Cache warmup failed:", e);
    });
  }, [images, warmupCacheFromIndexedDB]);

  // Ensure we have images
  const imageCount = images.length || TOTAL_IMAGES;
  const actualImageCount = Math.max(imageCount, 1);

  // Calculate image index from angle
  const getImageIndex = useCallback((angle: number): number => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    // For 36 images: 0-9.99° = index 0, 10-19.99° = index 1, ..., 350-359.99° = index 35
    const index = Math.floor(normalizedAngle / ANGLE_STEP);
    const clampedIndex = Math.min(Math.max(index, 0), actualImageCount - 1);
    
    if (process.env.NODE_ENV === "development" && Math.abs(angle - currentAngle) > 1) {
      console.log("getImageIndex:", {
        angle,
        normalizedAngle,
        index,
        clampedIndex,
        actualImageCount,
      });
    }
    
    return clampedIndex;
  }, [actualImageCount, currentAngle]);

  // Get current image index
  const currentImageIndex = getImageIndex(currentAngle);

  // State for current image blob URL (双缓冲，避免闪烁)
  const [currentImageBlobUrl, setCurrentImageBlobUrl] = useState<string | null>(null);
  const [nextImageBlobUrl, setNextImageBlobUrl] = useState<string | null>(null);
  const [currentImageAlt, setCurrentImageAlt] = useState<string>("Product image");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousImageIndexRef = useRef<number>(-1);

  // Get current image
  const currentImage = images[currentImageIndex] || images[0];

  // Load current image as blob URL with smooth transition
  useEffect(() => {
    if (!currentImage?.url) return;

    // 如果图片索引没有变化，不需要重新加载
    if (previousImageIndexRef.current === currentImageIndex && currentImageBlobUrl) {
      return;
    }

    let cancelled = false;

    const loadImage = async () => {
      try {
        // 检查是否已有 blob URL（已预加载）
        let blobUrl = blobUrlMapRef.current.get(currentImage.url);
        
        if (!blobUrl) {
          // 自动旋转：禁止回退到原图 URL（会造成 blobURL <-> 原图来回切换闪烁）
          // 保持上一帧显示，后台准备好（含解码）后再 swap
          if (isAutoRotating) {
            blobUrl = await loadImageAsBlobUrl(currentImage.url);
            blobUrlMapRef.current.set(currentImage.url, blobUrl);
            await decodeBlobUrls([currentImage.url], { concurrency: 1 });
          } else if (isDragging) {
            // 拖拽时，如果图片还没加载，先显示原图
            setCurrentImageBlobUrl(currentImage.url);
            // 异步加载
            loadImageAsBlobUrl(currentImage.url).then((loadedBlobUrl) => {
              blobUrlMapRef.current.set(currentImage.url, loadedBlobUrl);
              // 如果还是当前图片，更新为 blob URL
              if (previousImageIndexRef.current === currentImageIndex) {
                setCurrentImageBlobUrl(loadedBlobUrl);
              }
            });
            // 使用原图作为临时显示
            blobUrl = currentImage.url;
          } else {
            // 其他情况，正常加载
            blobUrl = await loadImageAsBlobUrl(currentImage.url);
            blobUrlMapRef.current.set(currentImage.url, blobUrl);
          }
        }

        if (cancelled) return;

        // 如果已经有当前图片显示，根据状态决定切换方式
        if (currentImageBlobUrl && previousImageIndexRef.current !== currentImageIndex) {
          // 拖拽或自动旋转时，直接切换，不使用淡入淡出，避免闪烁
          if (isDragging || isAutoRotating) {
            setCurrentImageBlobUrl(blobUrl);
            setNextImageBlobUrl(null);
            setIsTransitioning(false);
          } else {
            // 其他情况（如手动点击等），使用平滑过渡
            setNextImageBlobUrl(blobUrl);
            setIsTransitioning(true);
            
            // 等待下一帧后切换
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setCurrentImageBlobUrl(blobUrl);
                setNextImageBlobUrl(null);
                setIsTransitioning(false);
              });
            });
          }
        } else {
          // 首次加载，直接设置
          setCurrentImageBlobUrl(blobUrl);
          setNextImageBlobUrl(null);
          setIsTransitioning(false);
        }

        setCurrentImageAlt(currentImage.altText || `Product view at ${currentImageIndex * ANGLE_STEP}°`);
        loadedImagesRef.current.add(currentImageIndex);
        previousImageIndexRef.current = currentImageIndex;
      } catch (error) {
        console.error("Failed to load current image:", error);
        if (cancelled) return;
        // 自动旋转时不要回退到原图（避免抖动），保留上一帧
        if (!isAutoRotating) {
          setCurrentImageBlobUrl(currentImage.url);
        }
        setNextImageBlobUrl(null);
        setIsTransitioning(false);
        setCurrentImageAlt(currentImage.altText || "Product image");
      }
    };

    loadImage();
    return () => {
      cancelled = true;
    };
  }, [
    currentImage?.url,
    currentImageIndex,
    currentImage?.altText,
    isDragging,
    isAutoRotating,
    decodeBlobUrls,
  ]);

  // Preload strategy: 头5张 + 尾5张优先加载
  useEffect(() => {
    if (images.length === 0) return;

    const preloadPriorityImages = async () => {
      const priorityIndices: number[] = [];
      
      // 头5张
      for (let i = 0; i < Math.min(5, images.length); i++) {
        priorityIndices.push(i);
      }
      
      // 尾5张
      for (let i = Math.max(0, images.length - 5); i < images.length; i++) {
        if (!priorityIndices.includes(i)) {
          priorityIndices.push(i);
        }
      }

      const priorityUrls = priorityIndices
        .map((idx) => images[idx]?.url)
        .filter(Boolean) as string[];

      // 优先从 IndexedDB 命中（批量+节流）
      await warmupCacheFromIndexedDB(priorityUrls, {
        batchSize: 5,
        concurrency: CACHE_WARMUP_CONCURRENCY,
        delayMs: 20,
      });

      // 加载并存储 blob URL（并发限制）
      await runWithConcurrency(priorityIndices, CACHE_WARMUP_CONCURRENCY, async (idx) => {
        const image = images[idx];
        if (!image?.url || blobUrlMapRef.current.has(image.url)) return;

        try {
          const blobUrl = await loadImageAsBlobUrl(image.url);
          blobUrlMapRef.current.set(image.url, blobUrl);
          loadedImagesRef.current.add(idx);
        } catch (error) {
          console.warn(`Failed to preload priority image ${idx}:`, error);
        }
      });

      // 批量预解码（多张）
      await decodeBlobUrls(priorityUrls, { concurrency: DECODE_CONCURRENCY });
    };

    preloadPriorityImages();
  }, [images, warmupCacheFromIndexedDB, decodeBlobUrls]);

  // Preload other images in idle time
  useEffect(() => {
    if (images.length === 0) return;

    const otherIndices: number[] = [];
    
    // 排除头5张和尾5张
    for (let i = 5; i < images.length - 5; i++) {
      otherIndices.push(i);
    }

    if (otherIndices.length === 0) return;

    const otherUrls = otherIndices
      .map((idx) => images[idx]?.url)
      .filter(Boolean) as string[];

    // 先尝试从 IndexedDB 命中（不阻塞：分批+节流）
    warmupCacheFromIndexedDB(otherUrls, {
      batchSize: CACHE_WARMUP_BATCH_SIZE,
      concurrency: CACHE_WARMUP_CONCURRENCY,
      delayMs: CACHE_WARMUP_DELAY_MS,
    }).catch(() => {});

    // 使用 requestIdleCallback 在浏览器空闲时加载
    const loadInIdle = () => {
      if ("requestIdleCallback" in window) {
        const loadNext = (deadline: IdleDeadline) => {
          let index = 0;
          while (deadline.timeRemaining() > 0 && index < otherIndices.length) {
            const idx = otherIndices[index];
            const image = images[idx];
            
            if (image?.url && !blobUrlMapRef.current.has(image.url)) {
              loadImageAsBlobUrl(image.url)
                .then((blobUrl) => {
                  blobUrlMapRef.current.set(image.url, blobUrl);
                  loadedImagesRef.current.add(idx);
                  // 预解码（单张）
                  decodeBlobUrls([image.url], { concurrency: 1 }).catch(() => {});
                })
                .catch((error) => {
                  console.warn(`Failed to preload image ${idx}:`, error);
                });
            }
            
            index++;
          }

          if (index < otherIndices.length) {
            requestIdleCallback(loadNext);
          }
        };
        requestIdleCallback(loadNext);
      } else {
        // 降级：延迟加载
        otherIndices.forEach((idx, delayIndex) => {
          setTimeout(() => {
            const image = images[idx];
            if (image?.url && !blobUrlMapRef.current.has(image.url)) {
              loadImageAsBlobUrl(image.url)
                .then((blobUrl) => {
                  blobUrlMapRef.current.set(image.url, blobUrl);
                  loadedImagesRef.current.add(idx);
                  decodeBlobUrls([image.url], { concurrency: 1 }).catch(() => {});
                })
                .catch((error) => {
                  console.warn(`Failed to preload image ${idx}:`, error);
                });
            }
          }, delayIndex * 200);
        });
      }
    };

    loadInIdle();
  }, [images, warmupCacheFromIndexedDB, decodeBlobUrls]);

  // Preload adjacent images when current image changes (更积极的预加载)
  useEffect(() => {
    if (images.length === 0 || currentImageIndex < 0) return;

    const preloadAdjacent = async () => {
      // 预加载更多相邻图片，确保拖拽和自动旋转时流畅
      // 自动旋转时，需要预加载更多图片
      const preloadCount = isAutoRotating ? 8 : 3; // 自动旋转时预加载更多
      const adjacentIndices: number[] = [];
      
      for (let i = 1; i <= preloadCount; i++) {
        adjacentIndices.push((currentImageIndex - i + images.length) % images.length);
        adjacentIndices.push((currentImageIndex + i) % images.length);
      }

      const uniqueIndices = Array.from(new Set(adjacentIndices))
        .filter((idx) => !loadedImagesRef.current.has(idx));

      // 高优先级加载前后各4张（自动旋转时更多）
      const highPriorityCount = isAutoRotating ? 8 : 2;
      const highPriority = uniqueIndices.slice(0, highPriorityCount);
      const lowPriority = uniqueIndices.slice(highPriorityCount);

      // 立即加载高优先级图片（并发限制）
      await runWithConcurrency(highPriority, CACHE_WARMUP_CONCURRENCY, async (idx) => {
        const image = images[idx];
        if (!image?.url || blobUrlMapRef.current.has(image.url)) return;

        try {
          const blobUrl = await loadImageAsBlobUrl(image.url);
          blobUrlMapRef.current.set(image.url, blobUrl);
          loadedImagesRef.current.add(idx);
        } catch (error) {
          console.warn(`Failed to preload adjacent image ${idx}:`, error);
        }
      });

      // 批量预解码高优先级（多张，不只一张）
      const highPriorityUrls = highPriority
        .map((idx) => images[idx]?.url)
        .filter(Boolean) as string[];
      await decodeBlobUrls(highPriorityUrls, { concurrency: DECODE_CONCURRENCY });

      // 延迟加载低优先级图片
      if (lowPriority.length > 0) {
        setTimeout(() => {
          lowPriority.forEach(async (idx) => {
            const image = images[idx];
            if (!image?.url || blobUrlMapRef.current.has(image.url)) return;
            
            try {
              const blobUrl = await loadImageAsBlobUrl(image.url);
              blobUrlMapRef.current.set(image.url, blobUrl);
              loadedImagesRef.current.add(idx);
              // 低优先级也做预解码（单张）
              await decodeBlobUrls([image.url], { concurrency: 1 });
            } catch (error) {
              console.warn(`Failed to preload adjacent image ${idx}:`, error);
            }
          });
        }, 50); // 减少延迟时间
      }
    };

    preloadAdjacent();
  }, [currentImageIndex, images, isAutoRotating, decodeBlobUrls]);

  // 自动旋转开始时，预加载所有图片
  useEffect(() => {
    if (!isAutoRotating || images.length === 0) return;

    const preloadAllImages = async () => {
      const urls = images.map((i) => i.url).filter(Boolean);

      // 先尝试从 IndexedDB 命中（分批+节流）
      await warmupCacheFromIndexedDB(urls, {
        batchSize: CACHE_WARMUP_BATCH_SIZE,
        concurrency: CACHE_WARMUP_CONCURRENCY,
        delayMs: CACHE_WARMUP_DELAY_MS,
      });

      const unloadedIndices = images
        .map((_, idx) => idx)
        .filter((idx) => !loadedImagesRef.current.has(idx));

      if (unloadedIndices.length === 0) return;

      // 分批加载，避免一次性加载太多
      const batchSize = 6;
      for (let i = 0; i < unloadedIndices.length; i += batchSize) {
        const batch = unloadedIndices.slice(i, i + batchSize);

        // 这一批先加载/写 map（并发控制）
        await runWithConcurrency(batch, CACHE_WARMUP_CONCURRENCY, async (idx) => {
          const image = images[idx];
          if (!image?.url || blobUrlMapRef.current.has(image.url)) return;

          try {
            const blobUrl = await loadImageAsBlobUrl(image.url);
            blobUrlMapRef.current.set(image.url, blobUrl);
            loadedImagesRef.current.add(idx);
          } catch (error) {
            console.warn(`Failed to preload image ${idx}:`, error);
          }
        });

        // 这一批再做预解码（批量）
        const batchUrls = batch
          .map((idx) => images[idx]?.url)
          .filter(Boolean) as string[];
        await decodeBlobUrls(batchUrls, { concurrency: DECODE_CONCURRENCY });

        // 每批之间稍作延迟，避免阻塞主线程
        if (i + batchSize < unloadedIndices.length) {
          await sleep(50);
        }
      }
    };

    preloadAllImages();
  }, [isAutoRotating, images, warmupCacheFromIndexedDB, decodeBlobUrls]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      // Revoke all blob URLs to prevent memory leaks
      blobUrlMapRef.current.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
      blobUrlMapRef.current.clear();
    };
  }, []);


  // Auto rotate effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
      return;
    }

    // Calculate angle increment per frame for smooth rotation
    const fps = 60;
    const anglePerSecond = 360 / rotationSpeed;
    const anglePerFrame = anglePerSecond / fps;
    const frameInterval = 1000 / fps;

    const rotate = () => {
      setCurrentAngle((prev) => {
        const newAngle = prev + anglePerFrame;
        return newAngle >= 360 ? newAngle - 360 : newAngle;
      });
    };

    autoRotateTimerRef.current = setInterval(rotate, frameInterval);

    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
    };
  }, [isAutoRotating, isDragging, rotationSpeed]);

  // Mouse drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setIsAutoRotating(false);
      setJustReleased(false); // 重置刚释放标志
      // 不要停止阻尼动画：拖拽时我们只更新 targetAngleRef，让阻尼循环持续把 currentAngle 追到目标
      startXRef.current = e.clientX;
      startAngleRef.current = targetAngleRef.current; // 使用目标角度作为起始角度
      e.preventDefault();
    },
    []
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      setIsAutoRotating(false);
      setJustReleased(false); // 重置刚释放标志
      // 不要停止阻尼动画：拖拽时我们只更新 targetAngleRef，让阻尼循环持续把 currentAngle 追到目标
      const touch = e.touches[0];
      startXRef.current = touch.clientX;
      startAngleRef.current = targetAngleRef.current; // 使用目标角度作为起始角度
      e.preventDefault();
    },
    []
  );

  // Reset button handler
  const handleReset = useCallback(() => {
    // 停止阻尼动画
    if (dampingAnimationRef.current !== null) {
      cancelAnimationFrame(dampingAnimationRef.current);
      dampingAnimationRef.current = null;
    }
    targetAngleRef.current = 0;
    setCurrentAngle(0);
    setIsAutoRotating(false);
    previousImageIndexRef.current = -1; // 重置索引，强制重新加载
    if (autoRotate) {
      setTimeout(() => {
        setIsAutoRotating(true);
      }, 500);
    }
  }, [autoRotate]);

  // Damping animation (类似 Three.js OrbitControls 的缓动效果)
  // 持续运行，让 currentAngle 平滑过渡到 targetAngleRef.current
  useEffect(() => {
    // 如果正在自动旋转且不在拖拽，不使用阻尼（自动旋转有自己的平滑逻辑）
    if (isAutoRotating && !isDragging) {
      if (dampingAnimationRef.current !== null) {
        cancelAnimationFrame(dampingAnimationRef.current);
        dampingAnimationRef.current = null;
      }
      return;
    }

    // 智能选择阻尼系数：
    // - 拖拽时：0.25（快速响应）
    // - 刚释放时：0.2（快速完成过渡）
    // - 稳定后：0.1（平滑缓动）
    const dampingFactor = isDragging 
      ? 0.25 
      : justReleased 
        ? 0.2 
        : 0.1;
    
    const minDifference = 0.01; // 最小角度差，低于此值停止动画

    const animate = () => {
      // 使用函数式更新，避免依赖 currentAngle
      setCurrentAngle((current) => {
        const target = targetAngleRef.current;
        const difference = target - current;

        // 如果角度差太小，停止动画
        if (Math.abs(difference) < minDifference) {
          if (dampingAnimationRef.current !== null) {
            cancelAnimationFrame(dampingAnimationRef.current);
            dampingAnimationRef.current = null;
          }
          // 如果刚释放完成，重置标志
          if (justReleased) {
            setJustReleased(false);
          }
          if (!isDragging && autoRotate) {
            setTimeout(() => {
              setIsAutoRotating(true);
            }, 500);
          }
          return target; // 直接设置为目标值
        }

        // 应用阻尼插值（类似 Three.js 的 lerp）
        const newAngle = current + difference * dampingFactor;
        return newAngle;
      });

      // 继续动画
      dampingAnimationRef.current = requestAnimationFrame(animate);
    };

    // 启动动画循环
    if (dampingAnimationRef.current === null) {
      dampingAnimationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (dampingAnimationRef.current !== null) {
        cancelAnimationFrame(dampingAnimationRef.current);
        dampingAnimationRef.current = null;
      }
    };
  }, [isDragging, isAutoRotating, autoRotate, justReleased]);

  // Global mouse/touch event handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container || container.offsetWidth === 0) return;

      const containerWidth = container.offsetWidth;
      const deltaX = e.clientX - startXRef.current;
      // 反转方向：向右拖拽（deltaX > 0）应该减少角度，向左拖拽（deltaX < 0）应该增加角度
      const angleDelta = -(deltaX / containerWidth) * 360 * sensitivity;

      // 更新目标角度（阻尼动画会自动平滑过渡）
      const newTargetAngle = startAngleRef.current + angleDelta;
      targetAngleRef.current = newTargetAngle;
      // 关键：拖拽时也要“立刻有反馈”，否则会出现拖拽中不动、松手才动的情况。
      // 这里做一次轻微 lerp，手感接近 OrbitControls 的 enableDamping（拖拽时也有阻尼）
      setCurrentAngle((current) => current + (newTargetAngle - current) * 0.35);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      
      // 检查当前角度和目标角度的差值（使用函数式更新获取最新值）
      setCurrentAngle((current) => {
        const target = targetAngleRef.current;
        const difference = Math.abs(target - current);
        
        // 如果角度差很小（< 1°），立即同步，跳过阻尼动画
        if (difference < 1) {
          if (dampingAnimationRef.current !== null) {
            cancelAnimationFrame(dampingAnimationRef.current);
            dampingAnimationRef.current = null;
          }
          if (autoRotate) {
            setTimeout(() => {
              setIsAutoRotating(true);
            }, 500);
          }
          return target; // 立即同步
        } else {
          // 角度差较大，使用快速阻尼系数完成过渡
          setJustReleased(true);
          // 3秒后重置标志，恢复正常阻尼
          setTimeout(() => {
            setJustReleased(false);
          }, 3000);
          return current; // 保持当前值，让阻尼动画处理
        }
      });
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const touch = e.touches[0];
      const containerWidth = container.offsetWidth;
      const deltaX = touch.clientX - startXRef.current;
      // 反转方向：向右滑动（deltaX > 0）应该减少角度，向左滑动（deltaX < 0）应该增加角度
      const angleDelta = -(deltaX / containerWidth) * 360 * sensitivity;

      // 更新目标角度（阻尼动画会自动平滑过渡到目标角度）
      const newTargetAngle = startAngleRef.current + angleDelta;
      targetAngleRef.current = newTargetAngle;
      // 同 mousemove：拖拽时实时 lerp，避免“要松手才开始转”
      setCurrentAngle((current) => current + (newTargetAngle - current) * 0.35);
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
      
      // 检查当前角度和目标角度的差值（使用函数式更新获取最新值）
      setCurrentAngle((current) => {
        const target = targetAngleRef.current;
        const difference = Math.abs(target - current);
        
        // 如果角度差很小（< 1°），立即同步，跳过阻尼动画
        if (difference < 1) {
          if (dampingAnimationRef.current !== null) {
            cancelAnimationFrame(dampingAnimationRef.current);
            dampingAnimationRef.current = null;
          }
          if (autoRotate) {
            setTimeout(() => {
              setIsAutoRotating(true);
            }, 500);
          }
          return target; // 立即同步
        } else {
          // 角度差较大，使用快速阻尼系数完成过渡
          setJustReleased(true);
          // 3秒后重置标志，恢复正常阻尼
          setTimeout(() => {
            setJustReleased(false);
          }, 3000);
          return current; // 保持当前值，让阻尼动画处理
        }
      });
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, sensitivity, autoRotate]);

  // Initialize auto rotate
  useEffect(() => {
    setIsAutoRotating(autoRotate);
  }, [autoRotate]);

  // Responsive maxWidth style
  const responsiveMaxWidthStyle =
    maxWidth && maxWidth > 0
      ? `
    .interactive-product-360-container-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .interactive-product-360-container-responsive {
        max-width: ${maxWidth}px;
      }
    }
  `
      : `
    .interactive-product-360-container-responsive {
      width: 100%;
    }
  `;

  // Debug: Log images data
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("InteractiveProduct360 Debug:", {
        childInstancesCount: childInstances.length,
        imagesCount: images.length,
        images: images.map((img, idx) => ({ index: idx, url: img.url })),
        currentAngle,
        currentImageIndex,
        actualImageCount,
        currentImage: currentImage?.url,
      });
    }
  }, [childInstances.length, images.length, currentAngle, currentImageIndex, actualImageCount, currentImage]);

  if (images.length === 0) {
    return (
      <div ref={ref} {...rest} className="w-full text-center p-8">
        <p>Please add product images using the 360° View Item components.</p>
        <p className="text-sm text-gray-500 mt-2">
          You need 36 images (one for each 10° angle from 0° to 350°).
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Found {childInstances.length} child instances.
        </p>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div ref={ref} {...rest} className="w-full text-center p-8">
        <p>Error: No image found at index {currentImageIndex}.</p>
        <p className="text-sm text-gray-500 mt-2">
          Total images: {images.length}, Current angle: {Math.round(currentAngle)}°
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...rest}
      className="w-full mx-auto leading-tight interactive-product-360-container interactive-product-360-container-responsive"
      style={{
        backgroundColor: bgColor,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <style>{responsiveMaxWidthStyle}</style>
      <div
        className="main-content max-w-7xl mx-auto"
        style={{ padding: `${padding}px` }}
      >
        <div className="relative" style={{ maxWidth: `${maxWidth}px`, margin: "0 auto" }}>
          {/* 拖拽容器 */}
          <div
            ref={containerRef}
            className="relative cursor-grab active:cursor-grabbing select-none"
            style={{
              aspectRatio: aspectRatio,
              width: "100%",
              userSelect: "none",
              WebkitUserSelect: "none",
              touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="w-full h-full relative overflow-hidden">
              {/* 当前图片 */}
              {currentImageBlobUrl && (
                <img
                  key={`current-image-${currentImageIndex}`}
                  src={currentImageBlobUrl}
                  alt={currentImageAlt}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain absolute inset-0"
                  loading={currentImageIndex === 0 ? "eager" : "lazy"}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  height: "auto",
                  opacity: isTransitioning && nextImageBlobUrl ? 0 : 1,
                  transition: isDragging || isAutoRotating
                    ? "none"
                    : isTransitioning
                    ? `opacity 0.15s ease-out`
                    : "none",
                  zIndex: isTransitioning ? 1 : 2,
                  willChange: isDragging || isAutoRotating ? "opacity" : "auto",
                }}
                  onError={(e) => {
                    console.error("Failed to load blob URL image:", currentImageBlobUrl);
                    // Fallback to original URL
                    if (currentImage?.url && currentImage.url !== currentImageBlobUrl) {
                      const img = e.target as HTMLImageElement;
                      img.src = currentImage.url;
                    }
                  }}
                />
              )}
              
              {/* 下一张图片（淡入） */}
              {nextImageBlobUrl && (
                <img
                  key={`next-image-${currentImageIndex}`}
                  src={nextImageBlobUrl}
                  alt={currentImageAlt}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain absolute inset-0"
                  loading="lazy"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "auto",
                    opacity: 1,
                    transition: `opacity 0.15s ease-in`,
                    zIndex: 2,
                    willChange: "opacity",
                  }}
                  onError={(e) => {
                    console.error("Failed to load next blob URL image:", nextImageBlobUrl);
                  }}
                />
              )}
            </div>

            {/* Angle indicator (for debugging) */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
              {Math.round(currentAngle)}° | Image {currentImageIndex + 1}/{actualImageCount} | Dragging: {isDragging ? "Yes" : "No"}
            </div>
          </div>

          {/* 播放/暂停按钮 - 在拖拽层外面 */}
          {showControls && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoRotating(!isAutoRotating);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition"
                aria-label={isAutoRotating ? "Pause rotation" : "Start rotation"}
                style={{
                  fontFamily: "inherit",
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                }}
              >
                {isAutoRotating ? "⏸" : "▶"}
              </button>
            </div>
          )}

          {/* Reset Button - 在拖拽层外面 */}
          {showResetButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`absolute z-30 px-3 py-1.5 bg-black bg-opacity-70 hover:bg-opacity-90 text-white text-sm rounded transition-all ${
                resetButtonPosition === "top-left"
                  ? "top-2 left-2"
                  : resetButtonPosition === "top-right"
                  ? "top-2 right-2"
                  : resetButtonPosition === "bottom-left"
                  ? "bottom-2 left-2"
                  : "bottom-2 right-2"
              }`}
              aria-label="Reset rotation"
              style={{
                fontFamily: "inherit",
                cursor: "pointer",
                border: "none",
                outline: "none",
              }}
            >
              {resetButtonText}
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Drag or swipe to rotate • {actualImageCount} images</p>
        </div>
      </div>
    </div>
  );
});

InteractiveProduct360.displayName = "InteractiveProduct360";

export default InteractiveProduct360;

export const schema = createSchema({
  type: "interactive-product-360",
  title: "Interactive 360° Product View",
  childTypes: ["interactive-product-360--item"],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 600,
          configs: {
            min: 300,
            max: 1200,
            step: 50,
            unit: "px",
          },
          helpText:
            "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 20,
          configs: {
            min: 0,
            max: 80,
            step: 4,
            unit: "px",
          },
        },
        {
          type: "text",
          name: "aspectRatio",
          label: "Aspect Ratio",
          defaultValue: "1/1",
          helpText: "Image aspect ratio (e.g., 1/1, 16/9, 4/3)",
        },
      ],
    },
    {
      group: "Interaction",
      inputs: [
        {
          type: "switch",
          name: "autoRotate",
          label: "Auto Rotate",
          defaultValue: false,
          helpText: "Automatically rotate through product images",
        },
        {
          type: "range",
          name: "rotationSpeed",
          label: "Rotation Speed",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 10,
            step: 0.5,
            unit: "s",
          },
          condition: (data: InteractiveProduct360Data) =>
            data.autoRotate === true,
          helpText: "Time for one complete rotation (seconds)",
        },
        {
          type: "range",
          name: "sensitivity",
          label: "Sensitivity",
          defaultValue: 1,
          configs: {
            min: 0.5,
            max: 3,
            step: 0.1,
          },
          helpText: "Mouse/touch drag sensitivity (higher = more responsive)",
        },
        {
          type: "range",
          name: "transitionDuration",
          label: "Transition Duration",
          defaultValue: 0.3,
          configs: {
            min: 0.1,
            max: 1,
            step: 0.1,
            unit: "s",
          },
          helpText: "Animation duration when switching images",
        },
        {
          type: "switch",
          name: "showControls",
          label: "Show Controls",
          defaultValue: false,
          helpText: "Display play/pause button",
        },
        {
          type: "switch",
          name: "showResetButton",
          label: "Show Reset Button",
          defaultValue: true,
          helpText: "Display reset button to return to initial position",
        },
        {
          type: "text",
          name: "resetButtonText",
          label: "Reset Button Text",
          defaultValue: "Reset",
          condition: (data: InteractiveProduct360Data) =>
            data.showResetButton === true,
          helpText: "Text displayed on the reset button",
        },
        {
          type: "select",
          name: "resetButtonPosition",
          label: "Reset Button Position",
          defaultValue: "top-right",
          condition: (data: InteractiveProduct360Data) =>
            data.showResetButton === true,
          configs: {
            options: [
              { value: "top-left", label: "Top Left" },
              { value: "top-right", label: "Top Right" },
              { value: "bottom-left", label: "Bottom Left" },
              { value: "bottom-right", label: "Bottom Right" },
            ],
          },
          helpText: "Position of the reset button",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
      ],
    },
  ],
  presets: {
    maxWidth: 600,
    padding: 20,
    bgColor: "#ffffff",
    autoRotate: false,
    rotationSpeed: 3,
    sensitivity: 1,
    transitionDuration: 0.3,
    showControls: false,
    showResetButton: true,
    resetButtonText: "Reset",
    resetButtonPosition: "top-right",
    aspectRatio: "1/1",
    children: Array.from({ length: TOTAL_IMAGES }, () => ({
      type: "interactive-product-360--item",
    })),
  },
});

