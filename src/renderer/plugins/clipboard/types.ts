export interface ClipItem {
  _id?: string;
  data?: string;
  type: 'text' | 'image';
}

export type ClipListener = (clipItem: ClipItem) => void;

export const Events = {
  NewClip: 'NewClip',
};

export const Messages = {
  WriteClipText: 'WriteClipText',
};
