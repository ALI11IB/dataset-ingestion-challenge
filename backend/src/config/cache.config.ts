import { CacheModuleOptions } from '@nestjs/cache-manager';

export const getCacheConfig = (): CacheModuleOptions => {
  return {
    ttl: 300,
    max: 1000,
    isGlobal: true,
  };
};
