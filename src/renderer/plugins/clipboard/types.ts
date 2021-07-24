export type ClipType = 'text' | 'image' | 'file';

interface ClipItemCommon {
  _id: string;
  timeStamp: number;
}

export interface ClipItemDocFile extends ClipItemCommon {
  type: 'file';
  path: string;
}

export interface ClipItemDocText extends ClipItemCommon {
  type: 'text';
  text: string;
}

export interface ClipItemDocImage extends ClipItemCommon {
  type: 'image';
}

export type ClipItemDoc = ClipItemDocFile | ClipItemDocText | ClipItemDocImage;

export type ClipData =
  | {
      type: 'image';
      data: Electron.NativeImage;
    }
  | {
      type: 'text';
      data: string;
    }
  | {
      type: 'file';
      data: string;
    };

export const Events = {
  NewClip: 'NewClip',
  ClipsInitialized: 'ClipItemsInitialized',
};

export const Messages = {
  ClipItemSelected: 'ClipItemSelected',
  GetAllClipItems: 'GetAllClipItems',
  SearchClips: 'SearchClips',
  GetImagesDir: 'GetImagesDir',
};
