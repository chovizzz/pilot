/**
 * IndexedDB 图片缓存工具
 * 用于缓存360度产品图片，提高加载速度
 */

const DB_NAME = "product360_cache";
const DB_VERSION = 1;
const STORE_NAME = "images";

interface CacheEntry {
  url: string;
  blob: Blob;
  timestamp: number;
}

class ImageCache {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * 初始化 IndexedDB
   */
  private async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Failed to open IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "url" });
          objectStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * 从缓存获取图片 blob
   */
  async get(url: string): Promise<Blob | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result as CacheEntry | undefined;
        if (result && result.blob) {
          // 检查缓存是否过期（7天）
          const maxAge = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - result.timestamp < maxAge) {
            // 确保返回的是有效的 Blob 对象
            if (result.blob instanceof Blob) {
              resolve(result.blob);
            } else {
              // 如果存储的不是 Blob，尝试转换
              console.warn("Cached data is not a Blob, removing from cache");
              this.delete(url);
              resolve(null);
            }
          } else {
            // 缓存过期，删除
            this.delete(url);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error("Failed to get from cache:", request.error);
        resolve(null);
      };
    });
  }

  /**
   * 保存图片到缓存
   * 确保存储的是真正的 Blob 数据
   */
  async set(url: string, blob: Blob): Promise<void> {
    await this.init();
    if (!this.db) return;

    // 确保传入的是有效的 Blob 对象
    if (!(blob instanceof Blob)) {
      console.error("Invalid blob object, cannot cache");
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      // 创建缓存条目，确保 blob 是真正的 Blob 对象
      const entry: CacheEntry = {
        url,
        blob: blob, // IndexedDB 可以直接存储 Blob 对象
        timestamp: Date.now(),
      };
      
      const request = store.put(entry);

      request.onsuccess = () => {
        if (process.env.NODE_ENV === "development") {
          console.log(`Cached image: ${url} (${(blob.size / 1024).toFixed(2)} KB)`);
        }
        resolve();
      };

      request.onerror = () => {
        console.error("Failed to save to cache:", request.error);
        resolve(); // 不阻塞，即使缓存失败也继续
      };
    });
  }

  /**
   * 删除缓存
   */
  async delete(url: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  }
}

// 单例
export const imageCache = new ImageCache();

/**
 * 加载图片并转换为 blob URL
 * 优先使用缓存，如果没有则从网络加载并缓存
 */
export async function loadImageAsBlobUrl(
  url: string,
  useCache: boolean = true
): Promise<string> {
  // 先检查缓存
  if (useCache) {
    try {
      const cachedBlob = await imageCache.get(url);
      if (cachedBlob && cachedBlob instanceof Blob) {
        // 验证 blob 是否有效
        if (cachedBlob.size > 0) {
          const blobUrl = URL.createObjectURL(cachedBlob);
          if (process.env.NODE_ENV === "development") {
            console.log(`Using cached image: ${url} (${(cachedBlob.size / 1024).toFixed(2)} KB)`);
          }
          return blobUrl;
        } else {
          console.warn("Cached blob is empty, removing from cache");
          await imageCache.delete(url);
        }
      }
    } catch (error) {
      console.warn("Failed to get from cache, loading from network:", error);
    }
  }

  // 从网络加载
  try {
    const response = await fetch(url, {
      cache: "no-cache", // 确保获取最新图片
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // 验证 blob 是否有效
    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error("Invalid blob data received");
    }

    // 保存到缓存（异步，不阻塞）
    if (useCache && blob.size > 0) {
      imageCache.set(url, blob).catch((err) => {
        console.warn("Failed to cache image:", err);
      });
    }

    const blobUrl = URL.createObjectURL(blob);
    if (process.env.NODE_ENV === "development") {
      console.log(`Loaded image from network: ${url} (${(blob.size / 1024).toFixed(2)} KB)`);
    }
    return blobUrl;
  } catch (error) {
    console.error("Failed to load image:", error);
    throw error;
  }
}

/**
 * 预加载图片列表
 */
export async function preloadImages(
  urls: string[],
  priority: "high" | "low" = "high"
): Promise<void> {
  if (priority === "high") {
    // 高优先级：立即加载
    await Promise.allSettled(
      urls.map((url) =>
        loadImageAsBlobUrl(url).catch((err) => {
          console.warn(`Failed to preload image ${url}:`, err);
        })
      )
    );
  } else {
    // 低优先级：在浏览器空闲时加载
    if ("requestIdleCallback" in window) {
      const loadNext = (deadline: IdleDeadline) => {
        let index = 0;
        while (deadline.timeRemaining() > 0 && index < urls.length) {
          const url = urls[index];
          loadImageAsBlobUrl(url).catch((err) => {
            console.warn(`Failed to preload image ${url}:`, err);
          });
          index++;
        }

        if (index < urls.length) {
          requestIdleCallback(loadNext);
        }
      };
      requestIdleCallback(loadNext);
    } else {
      // 降级：延迟加载
      urls.forEach((url, index) => {
        setTimeout(() => {
          loadImageAsBlobUrl(url).catch((err) => {
            console.warn(`Failed to preload image ${url}:`, err);
          });
        }, index * 100);
      });
    }
  }
}

