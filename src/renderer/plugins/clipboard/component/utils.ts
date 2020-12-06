export const dimensions = {
  clipItem: {
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
  /* A-Z */
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

  /* ~ */
  if (keyCode === 192) {
    return true;
  }

  return false;
};
