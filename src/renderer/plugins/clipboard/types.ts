export type ClipType = 'text' | 'image';

export interface ClipItemDoc {
  _id: string;
  data?: string;
  timeStamp: number;
  type: ClipType;
}

export interface ReadClipboardData {
  text?: string;
  imageBuffer?: Buffer;
  imageString?: string;
  type: ClipType;
}

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
