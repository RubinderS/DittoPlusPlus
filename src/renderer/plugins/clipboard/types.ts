export interface ClipItem {
  _id?: string;
  data?: string;
  timeStamp: number;
  type: 'text' | 'image';
}

export type ClipListener = (clipItem: ClipItem) => void;

export const Events = {
  NewClip: 'NewClip',
  ClipsInitialized: 'ClipItemsInitialized',
  ExistingClipSelected: 'ExistingClipSelected',
};

export const Messages = {
  ClipItemSelected: 'ClipItemSelected',
  GetAllClipItems: 'GetAllClipItems',
  SearchClips: 'SearchClips',
};
