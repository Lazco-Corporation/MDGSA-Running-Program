import { CacheEntry } from "./types";

const DEFAULT_EXPIRATION_MS = 5 * 60 * 1000;

export class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private noCache = Boolean(process.env.NO_CACHE);
  private expirationMs: number;

  constructor(expirationMs: number = DEFAULT_EXPIRATION_MS) {
    this.cache = new Map<string, CacheEntry<any>>();
    this.expirationMs = expirationMs;
  }

  /**
   * Checks if a cache entry exists and is still valid
   * @param key The cache key to check
   * @returns True if the cache entry is valid, false otherwise
   */
  public isValid(key: string): boolean {
    if (this.noCache) {
      console.warn(`cache: [${key}] cache is disabled`);
      return false;
    }

    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    const expired = now - entry.timestamp > this.expirationMs;
    if (expired) {
      console.warn(
        `cache: [${key}] cache is expired, past time: ${now - entry.timestamp}ms`,
      );
      return false;
    }
    console.info(
      `cache: [${key}] cache is valid, remaining time: ${this.expirationMs - (now - entry.timestamp)}ms`,
    );
    return true;
  }

  /**
   * Gets data from cache if it exists and is valid
   * @param key The cache key to retrieve
   * @returns The cached data or null if no valid cache exists
   */
  public get<T>(key: string): T | null {
    if (!this.isValid(key)) {
      return null;
    }
    return this.cache.get(key)?.data || null;
  }

  /**
   * Sets data in the cache with the current timestamp
   * @param key The cache key
   * @param data The data to cache
   */
  public set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Deletes a specific cache entry
   * @param key The cache key to delete
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all cache entries
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Changes the expiration time for cache entries
   * @param expirationMs New expiration time in milliseconds
   */
  public setExpirationTime(expirationMs: number): void {
    this.expirationMs = expirationMs;
  }

  /**
   * Returns the number of entries in the cache
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Gets all cache keys
   * @returns Array of cache keys
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const defaultCache = new CacheService();
