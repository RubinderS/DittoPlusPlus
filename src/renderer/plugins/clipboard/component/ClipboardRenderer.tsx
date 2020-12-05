import {Box} from '@material-ui/core';
import * as React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {ClipItem, Events, Messages} from '../types';
import * as PluginTypes from '@type/pluginTypes';
import {useEffect, useState} from 'react';
import useEventListener from '@use-it/event-listener';
import {clamp} from 'lodash';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import {SearchBar} from './SearchBar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export const ClipboardRenderer = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItem[]>([]);
  const [selectedIndex, updateSelectedIndex] = useState(0);
  const {process} = props;
  const searchBarRef = React.createRef<HTMLDivElement>();

  const reArrangeClipItems = (selectedClipItem: ClipItem) => {
    const index = clipItems.findIndex(
      (clipItem) => clipItem._id === selectedClipItem._id,
    );

    const slicedClipItems = [
      ...clipItems.slice(0, index),
      ...clipItems.slice(index + 1),
    ];

    updateClipItems([selectedClipItem, ...slicedClipItems]);
  };

  const sendClipboardItemSelected = (clipItem: ClipItem) => {
    if (clipItem.type === 'text') {
      process.sendMessage(Messages.ClipItemSelected, clipItem, (err, res) => {
        if (err) {
          throw err;
        }

        if (res) {
          // console.log(res);
        }
      });
    }
  };

  const isAlphanumeric = (keyCode: number): boolean => {
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

  const onKeyPress = (event: KeyboardEvent) => {
    const {keyCode} = event;

    /* up key */
    if (keyCode === 38) {
      updateSelectedIndex((prevSelectedIndex) =>
        clamp(prevSelectedIndex - 1, 0, clipItems.length - 1),
      );
    }

    /* down key */
    if (keyCode === 40) {
      updateSelectedIndex((prevSelectedIndex) =>
        clamp(prevSelectedIndex + 1, 0, clipItems.length - 1),
      );
    }

    /* enter key */
    if (keyCode === 13) {
      reArrangeClipItems(clipItems[selectedIndex]);
      sendClipboardItemSelected(clipItems[selectedIndex]);
      updateSelectedIndex(0);
    }

    /* key is alphanumeric */
    if (isAlphanumeric(keyCode)) {
      searchBarRef.current && searchBarRef.current.focus();
    }
  };

  useEventListener('keydown', onKeyPress);

  useEffect(() => {
    process.sendMessage(Messages.GetAllClipItems, '', (err, res) => {
      if (!err) {
        updateClipItems([...res]);
      }
    });

    process.on(Events.NewClip, (doc: ClipItem) => {
      updateClipItems((prevClipItems) => [doc, ...prevClipItems]);
    });

    process.on(Events.ClipsInitialized, (clips: ClipItem[]) => {
      updateClipItems(clips);
    });
  }, []);

  const onClickClipItem = (e: ClipItem) => {
    reArrangeClipItems(e);
    sendClipboardItemSelected(e);
  };

  const getBackgroundColor = (index: number, selectedIndex: number) => {
    if (index === selectedIndex) {
      return classes.clipItemSelected;
    } else if (index % 2) {
      return classes.clipItemEvenRow;
    } else {
      return classes.clipItemOddRow;
    }
  };

  const onSearchBarTextChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const query = event.target.value;

    process.sendMessage(Messages.SearchClips, query, (err, res) => {
      if (err) {
        throw err;
      }

      if (query === '') {
        updateSelectedIndex(0);
        searchBarRef.current && searchBarRef.current.blur();
      }

      updateClipItems(res);
    });
  };

  return (
    <Box className={classes.container}>
      <SimpleBar className={classes.clipsContainer}>
        {clipItems.map((item, index) => (
          <Box
            key={`${index}_clipItem`}
            className={getBackgroundColor(index, selectedIndex)}
            onClick={() => onClickClipItem(item)}
          >
            {item.data}
          </Box>
        ))}
      </SimpleBar>
      <SearchBar
        id="clipboard-searchbar"
        placeholder="search"
        onChange={onSearchBarTextChanged}
        ref={searchBarRef}
      />
    </Box>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  const clipItemStyles: CSSProperties = {
    color: 'black',
    overflow: 'auto',
    minHeight: '40px',
    lineHeight: '20px',
    padding: '5px',
    maxWidth: '100%',
  };

  return createStyles({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
    },
    clipsContainer: {
      display: 'flex',
      height: '100%',
      width: '100%',
      overflowY: 'visible',
      flexDirection: 'column',
    },
    clipItemEvenRow: {
      ...clipItemStyles,
      backgroundColor: blueGrey[50],
    },
    clipItemOddRow: {
      ...clipItemStyles,
      backgroundColor: blueGrey[100],
    },
    clipItemSelected: {
      ...clipItemStyles,
      backgroundColor: blueGrey[300],
    },
    searchBar: {
      height: '60px',
    },
  });
});
