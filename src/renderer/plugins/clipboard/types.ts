export type ClipType = 'text' | 'image' | 'file';

export type ClipDoc = {
  _id: string;
  timeStamp: number;
} & (
  | {text: string; type: 'text'}
  | {path: string; type: 'file'}
  | {type: 'image'}
);

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
  ClipsInitialized: 'ClipsInitialized',
};

export const Messages = {
  ClipDocSelected: 'ClipDocSelected',
  GetAllClipDocs: 'GetAllClipDocs',
  SearchClips: 'SearchClips',
};
