
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

export const convertImageToSvg = (dataUrl: string, options: Partial<ConversionOptions> = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // ImageTracer.imageToSVG can take a URL or dataURL
      // The third parameter is the options object
      // The second parameter is a callback if needed, or we can use the return value
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
};
