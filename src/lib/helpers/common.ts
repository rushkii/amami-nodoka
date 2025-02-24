export const formatBytes = (bytes: number, decimals: number = 2) => {
  // convert Bytes to specific sizes format.
  // ref: https://stackoverflow.com/a/18650828

  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const calculatePercent = (current: number, total: number) => {
  // assets progress percent calculator.
  const percent = (current / total) * 100;
  if (isNaN(percent)) return 0;
  return percent;
};
