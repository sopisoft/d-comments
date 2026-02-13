import type { Result } from '@/lib/types';
import { createNiconiRenderer } from './niconi';
import { createPixiRenderer } from './pixi';
import type { RendererController } from './types';

export type RendererMode = 'pixi' | 'niconi';
export const renderer = {
  async init(mode: RendererMode = 'pixi'): Promise<Result<RendererController, string>> {
    return mode === 'pixi' ? createPixiRenderer() : createNiconiRenderer();
  },
};
