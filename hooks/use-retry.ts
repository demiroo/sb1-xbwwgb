"use client";

import { useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  timeout?: number;
}

export function useRetry(options: RetryOptions = {}) {
  const { maxAttempts = 3, delayMs = 1000, timeout = 30000 } = options;

  const retry = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const result = await Promise.race([
            fn(),
            new Promise<never>((_, reject) => {
              controller.signal.addEventListener('abort', () => {
                reject(new Error('Request timeout'));
              });
            })
          ]);

          return result;
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        lastError = error as Error;
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
      }
    }
    
    throw lastError;
  }, [maxAttempts, delayMs, timeout]);

  return { retry };
}