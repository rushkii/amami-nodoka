import type { Asset, Progress } from '$types';

const assetsManager = $state<{
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

export const useAssetsManager = () => {
  return {
    get assets() {
      return assetsManager.assets;
    },
    get progress() {
      return assetsManager.progress;
    },
    get totalSize() {
      return assetsManager.totalSize;
    },
    get state() {
      return assetsManager.state ?? '';
    },
    set assets(value) {
      assetsManager.assets = value;
    },
    set progress(value) {
      assetsManager.progress = value;
    },
    set totalSize(value) {
      assetsManager.totalSize = value;
    },
    set state(value) {
      assetsManager.state = value;
    }
  };
};
