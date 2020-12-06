import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Box} from '@material-ui/core';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {blueGrey} from '@material-ui/core/colors';
import {ClipItem, Events, Messages} from '../types';
import * as PluginTypes from '@type/pluginTypes';
import useEventListener from '@use-it/event-listener';
import {clamp, inRange} from 'lodash';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import {SearchBar} from './SearchBar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {dimensions, isAlphanumeric} from './utils';

export const ClipboardRenderer = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItem[]>([]);
  const [selectedIndex, updateSelectedIndex] = useState(0);
  const [searchText, updateSearchText] = useState('');
  const {process} = props;
  const searchBarRef = useRef<HTMLDivElement>(null);
  const clipsListRef = useRef<HTMLDivElement>(null);

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
          //
        }
      });
    }
  };

  const onKeyPress = (event: KeyboardEvent) => {
    const {keyCode} = event;

    /* disable scrolling by arrow keys */
    if ([38, 40].includes(keyCode)) {
      event.preventDefault();
    }

    if (clipsListRef.current) {
      const {clipItem, searchBar} = dimensions;

      const clipItemHeight =
        clipItem.height + clipItem.paddingTop + clipItem.paddingBottom;

      const searchBarHeight =
        searchBar.height + searchBar.paddingTop + searchBar.paddingBottom;

      const viewHeight = clipsListRef.current.offsetHeight - searchBarHeight;
      const itemsVisibleN = Math.floor(viewHeight / clipItemHeight);

      const itemsScrolled = Math.floor(
        clipsListRef.current.scrollTop / clipItemHeight,
      );

      const isItemInViewPort = inRange(
        selectedIndex,
        itemsScrolled,
        itemsVisibleN + itemsScrolled + 1,
      );

      /* up key */
      if (keyCode === 38) {
        if (isItemInViewPort) {
          clipsListRef.current.scrollBy({
            top: -clipItemHeight,
          });
        } else {
          clipsListRef.current.scrollTop = (selectedIndex - 2) * clipItemHeight;
        }

        updateSelectedIndex((prevSelectedIndex) =>
          clamp(prevSelectedIndex - 1, 0, clipItems.length - 1),
        );
      }

      /* down key */
      if (keyCode === 40) {
        if (selectedIndex >= itemsVisibleN - 1 && isItemInViewPort) {
          clipsListRef.current.scrollBy({top: clipItemHeight});
        } else if (clipsListRef.current.scrollTop) {
          clipsListRef.current.scrollTop = selectedIndex * clipItemHeight;
        }

        updateSelectedIndex((prevSelectedIndex) =>
          clamp(prevSelectedIndex + 1, 0, clipItems.length - 1),
        );
      }
    }

    /* escape */
    if (keyCode === 27) {
      handleSearchUpdate('');
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
    updateSelectedIndex(0);
    clipsListRef.current && (clipsListRef.current.scrollTop = 0);
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

  const handleSearchUpdate = (text: string) => {
    updateSearchText(text);
    if (text === '') {
      updateSelectedIndex(0);
      searchBarRef.current && searchBarRef.current.blur();
    }

    process.sendMessage(Messages.SearchClips, text, (err, res) => {
      if (err) {
        throw err;
      }

      updateClipItems(res);
    });
  };

  const onSearchTextChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const query = event.target.value;
    handleSearchUpdate(query);
  };

  return (
    <Box className={classes.container}>
      <SimpleBar
        className={classes.clipsContainer}
        scrollableNodeProps={{ref: clipsListRef}}
      >
        {clipItems.map((item, index) => (
          <div
            key={`${index}_clipItem`}
            className={getBackgroundColor(index, selectedIndex)}
            onClick={() => onClickClipItem(item)}
          >
            {item.data}
          </div>
        ))}
      </SimpleBar>
      <SearchBar
        id="clipboard-searchbar"
        placeholder="search"
        onChange={onSearchTextChanged}
        value={searchText}
        ref={searchBarRef}
      />
    </Box>
  );
};

const useStyles = makeStyles((_theme: Theme) => {
  const {
    clipItem: {height, paddingTop, paddingBottom, paddingLeft, paddingRight},
  } = dimensions;

  const clipItemStyles: CSSProperties = {
    color: 'black',
    overflow: 'auto',
    minHeight: `${height}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    lineHeight: '20px',
    maxWidth: '100%',
    '&:focus': {
      outline: '0px solid transparent',
    },
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
      overflowY: 'auto',
      scrollBehavior: 'unset',
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
  });
});
