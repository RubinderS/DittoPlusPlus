import * as path from 'path';
import {ClipDoc} from '../types';

export const dimensions = {
  clipRow: {
    height: 40,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  searchBar: {
    height: 30,
    paddingTop: 5,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
};

export const isAlphanumeric = (keyCode: number): boolean => {
  console.log(keyCode);
  /* A-Z | a-z */
  if (keyCode >= 65 && keyCode <= 90) {
    return true;
  }

  /* numeric pad */
  if (keyCode >= 96 && keyCode <= 105) {
    return true;
  }

  /* numbers */
  if (keyCode >= 48 && keyCode <= 57) {
    return true;
  }

  /**
   * 32: space
   * 106: *
   * 107: +
   * 109: -
   * 111: /
   * 186: ;
   * 187: +
   * 188: ,
   * 189 : -
   * 190: .
   * 191: /
   * 192: ~
   * 219: [
   * 220: \
   * 221: ]
   * 222: '
   */
  if (
    [
      32,
      106,
      107,
      109,
      111,
      186,
      187,
      188,
      189,
      190,
      191,
      192,
      219,
      220,
      221,
      222,
    ].includes(keyCode)
  ) {
    return true;
  }

  return false;
};

export const imagesDir = path.join('db', 'clipboardImages');

export const shiftItemToFront = (
  clipDocs: ClipDoc[],
  selectedItem: ClipDoc,
) => {
  const shiftedItems = clipDocs.filter((item) => item._id !== selectedItem._id);
  shiftedItems.unshift(selectedItem);
  return shiftedItems;
};
