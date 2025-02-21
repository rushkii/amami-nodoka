import type { Asset, Progress } from '$types';

const manager = $state<{
  assets: Asset[];
  progress: Progress[];
  totalSize: number;
  state?: string;
}>({
  assets: [],
  progress: [],
  totalSize: 0,
  state: 'FILE_INFO_CHECK'
});

export const useManager = () => {
  return {
    get assets() {
      return manager.assets;
    },
    get progress() {
      return manager.progress;
    },
    get totalSize() {
      return manager.totalSize;
    },
    get state() {
      return manager.state ?? '';
    },
    set assets(value: Asset[]) {
      manager.assets = value;
    },
    set progress(value: Progress[]) {
      manager.progress = value;
    },
    set totalSize(value: number) {
      manager.totalSize = value;
    },
    set state(value: string) {
      manager.state = value;
    }
  };
};
