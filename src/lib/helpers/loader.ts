import { page } from '$app/state';
import type { Asset, Progress } from '$types';
import { useManager } from '$hooks/manager.svelte';

type XHRRequest = ((this: XMLHttpRequest, e: ProgressEvent | Event) => unknown) | null;

export const preloadAssets = async ({ assets }: { assets: Asset[] }) => {
  // preloading assets.

  const manager = useManager();
  const headRequests = [];

  for (const asset of assets) {
    // get assets info for file size.

    if (assets.indexOf(asset) === -1) {
      manager.state = 'FILE_INFO_COMPLETE';
    }

    headRequests.push(
      request({
        method: 'HEAD',
        url: asset.src,
        type: 'arraybuffer',
        onReady() {
          if (this.readyState !== this.DONE) return;
          manager.totalSize += parseInt(this.getResponseHeader('Content-Length')!);
        }
      })
    );
  }

  await Promise.all(headRequests);

  manager.state = 'ASSETS_DOWNLOADING';

  for (const asset of assets) {
    // preload assets.
    request({
      method: 'GET',
      url: asset.src,
      type: 'arraybuffer',

      // save event.
      onLoad(e) {
        const target = e.target! as XMLHttpRequest;
        const blob = new Blob([target.response]);

        const obj: Asset = {
          ...asset,
          filename: asset.src.split('/').at(-1),
          src: URL.createObjectURL(blob)
        };

        // save the preloaded assets to the store/assets.
        manager.assets.push(obj);
      },

      // progress event.
      onProgress(e) {
        const ev = e as ProgressEvent;
        if (ev.lengthComputable) {
          // get filename through the response url.
          const filename = decodeURIComponent((ev.currentTarget as XMLHttpRequest).responseURL)
            .replace(page.url.origin, '')
            .split('/')
            .at(-1);

          // save the progress value to the store/state.
          manager.progress = upsertItem(manager.progress, { filename: filename, size: ev.loaded });
        }
      }
    });
  }
};

const request = ({
  method,
  url,
  type,
  onLoad,
  onProgress,
  onReady
}: {
  method: 'GET' | 'POST' | 'HEAD';
  url: string;
  type: XMLHttpRequestResponseType;
  onLoad?: XHRRequest;
  onProgress?: XHRRequest;
  onReady?: XHRRequest;
}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = type;

    xhr.onload = function (e) {
      if (onLoad) onLoad.call(this, e);
      resolve(xhr); // Resolve the promise when the request completes successfully
    };

    xhr.onerror = function () {
      reject(new Error('Error on XHR')); // Reject the promise on error
    };

    if (onProgress) xhr.onprogress = onProgress;
    if (onReady) xhr.onreadystatechange = onReady;

    xhr.send();
  });
};

const upsertItem = (array: Progress[], newItem: Progress) => {
  // updating the progress object like a MongoDB upsert.

  const newArray: Progress[] = [...array];
  const index = newArray.findIndex((item) => item.filename === newItem.filename);

  if (index === -1) {
    newArray.push(newItem);
  } else {
    newArray[index] = { ...newArray[index], ...newItem };
  }

  return newArray;
};
