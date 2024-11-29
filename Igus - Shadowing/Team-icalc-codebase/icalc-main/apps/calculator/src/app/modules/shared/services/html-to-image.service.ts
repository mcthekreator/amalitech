import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';

@Injectable({
  providedIn: 'root',
})
export class HtmlToImageService {
  // this method takes the screenshot of the library and the pin assignment configuration
  public async getImageFromId(id: string): Promise<string> {
    const srcElement = document.getElementById(id);
    const width = srcElement?.clientWidth;
    /**
     * we clone the whole html element and append this temporary element to the body in order to
     * be able to style it differently from the representation in the component,
     * then we take a screen shot and save it as an image via the html-to-image library
     */
    const clone = srcElement?.cloneNode?.(true) as HTMLElement;

    if (!clone) {
      return;
    }
    clone.style.width = `${width - 14}px`;
    clone.id = 'container-wrapper_temp';
    document.body.appendChild(clone);
    const nodeCopy = document.getElementById('container-wrapper_temp');

    if (!nodeCopy) {
      return;
    } else {
      const headlineContainer = Array.from(await nodeCopy.getElementsByClassName('headline-container'));
      const labelsRow = Array.from(await nodeCopy.getElementsByClassName('labels-row'));
      const pngExportHeader = Array.from(await nodeCopy.getElementsByClassName('png-export-header'))[0];
      const sideColumnHeaderRight = Array.from(await nodeCopy.getElementsByClassName('side-column-header-right'))[0];
      const sideColumnHeaderLeft = Array.from(await nodeCopy.getElementsByClassName('side-column-header-left'))[0];
      const firstCableStructureContainer = Array.from(
        await nodeCopy.getElementsByClassName('cable-structure-container')
      )[0];

      firstCableStructureContainer?.setAttribute('style', 'margin-top: 0;');
      pngExportHeader?.setAttribute(
        'style',
        'display: flex; width: 100%; justify-content: space-between; align-content: flex-end; flex-flow: row;'
      );
      sideColumnHeaderLeft?.setAttribute('style', 'margin-left: 10rem;');
      sideColumnHeaderRight?.setAttribute('style', 'margin-right: 10rem;');
      headlineContainer[0]?.remove();
      labelsRow[0]?.remove();
    }

    const filter = (node: HTMLElement): boolean => {
      const exclusionClasses = ['hide-for-snapshot-png'];

      return !exclusionClasses.some((classname) => node.classList?.contains(classname));
    };

    return htmlToImage
      .toPng(nodeCopy, { filter })
      .then((value) => {
        document.body.removeChild(nodeCopy);
        return value;
      })
      .catch((error) => {
        console.error(`HTML snapshot failed for ${id}`, error);
        throw new Error(error);
      });
  }
}
