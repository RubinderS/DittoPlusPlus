export type ClipType = 'text' | 'image';

export type ClipItemDoc = {
  _id: string;
  timeStamp: number;
} & ({text: string; type: 'text'} | {type: 'image'});

export type ClipData =
  | {
      type: 'image';
      data: Electron.NativeImage;
    }
  | {
      type: 'text';
      data: string;
    };

export type ClipListener = (clipItem: ClipItemDoc) => void;

export const Events = {
  NewClip: 'NewClip',
  ClipsInitialized: 'ClipItemsInitialized',
};

export const Messages = {
  ClipItemSelected: 'ClipItemSelected',
  GetAllClipItems: 'GetAllClipItems',
  SearchClips: 'SearchClips',
};
