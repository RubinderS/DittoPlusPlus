import {ClipItemDoc} from '../types';

export const dimensions = {
  clipItemDimensions: {
    heightPx: 40,
    paddingTopPx: 2,
    paddingBottomPx: 5,
    paddingLeftPx: 5,
    paddingRightPx: 5,
  },
  searchBarDimensions: {
    heightPx: 35,
    paddingTopPx: 3,
    paddingBottomPx: 3,
    paddingLeftPx: 3,
    paddingRightPx: 3,
  },
};

// todo rename as is printable character
export const isAlphanumeric = (keyCode: number): boolean => {
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
      32, 106, 107, 109, 111, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221,
      222,
    ].includes(keyCode)
  ) {
    return true;
  }

  return false;
};

export const shiftItemToFront = (
  clipItems: ClipItemDoc[],
  selectedItem: ClipItemDoc,
) => {
  const shiftedItems = clipItems.filter(
    (item) => item._id !== selectedItem._id,
  );

  shiftedItems.unshift(selectedItem);

  return shiftedItems;
};

export const escapeRegExp = (s: string) => {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
