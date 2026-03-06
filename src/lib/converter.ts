import ImageTracer from 'imagetracerjs';

export interface ConversionOptions {
  ltres: number;
  qtres: number;
  pathomit: number;
  colorsampling: number;
  numberofcolors: number;
  strokewidth: number;
  linefilter: boolean;
}

export const defaultOptions: ConversionOptions = {
  ltres: 1,
  qtres: 1,
  pathomit: 8,
  colorsampling: 1,
  numberofcolors: 16,
  strokewidth: 1,
  linefilter: true
};

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'bmp' | 'gif' | 'svg';

const formatToMime = (format: ImageFormat): string => {
  switch (format) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    default:
      return `image/${format}`;
  }
};

export const convertImage = async (
  dataUrl: string,
  toFormat: ImageFormat,
  options: Partial<ConversionOptions> = {}
): Promise<string> => {
  if (toFormat === 'svg') {
    return new Promise((resolve, reject) => {
      try {
        ImageTracer.imageToSVG(
          dataUrl,
          (svgString: string) => {
            if (svgString) {
              resolve(svgString);
            } else {
              reject(new Error("Conversion failed to produce SVG string"));
            }
          },
          { ...defaultOptions, ...options }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Raster conversion using Canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const mimeType = formatToMime(toFormat);
      const resultDataUrl = canvas.toDataURL(mimeType);
      resolve(resultDataUrl);
    };
    img.onerror = () => reject(new Error("Failed to load image for raster conversion"));
    img.src = dataUrl;
  });
};
