import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Box} from '@material-ui/core';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {ClipItemDoc, Events, Messages} from '../types';
import * as PluginTypes from '@type/pluginTypes';
import useEventListener from '@use-it/event-listener';
import {clamp, inRange} from 'lodash';
import {SearchBar} from './SearchBar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {dimensions, isAlphanumeric} from './utils';
import {ClipItemRow, ClipItemVariants} from './ClipItemRow';

export const ClipboardRenderer = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipItems, updateClipItems] = useState<ClipItemDoc[]>([]);
  const [selectedIndex, updateSelectedIndex] = useState(0);
  const [searchText, updateSearchText] = useState('');
  const {process} = props;
  const searchBarRef = useRef<HTMLDivElement>(null);
  const clipsListRef = useRef<HTMLDivElement>(null);

  const reArrangeClipItems = (selectedClipItem: ClipItemDoc) => {
    const index = clipItems.findIndex(
      (clipItem) => clipItem._id === selectedClipItem._id,
    );

    const slicedClipItems = [
      ...clipItems.slice(0, index),
      ...clipItems.slice(index + 1),
    ];

    updateClipItems([selectedClipItem, ...slicedClipItems]);
  };

  const sendClipboardItemSelected = (clipItem: ClipItemDoc) => {
    process.sendMessage(Messages.ClipItemSelected, clipItem, (err, res) => {
      if (err) {
        throw err;
      }

      if (res) {
        //
      }
    });
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
      handleClipItemSelected(clipItems[selectedIndex]);
    }

    /* key is alphanumeric */
    if (isAlphanumeric(keyCode)) {
      updateSelectedIndex(0);
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

    process.on(Events.NewClip, (doc: ClipItemDoc) => {
      updateClipItems((prevClipItems) => [doc, ...prevClipItems]);
    });

    process.on(Events.ClipsInitialized, (clips: ClipItemDoc[]) => {
      updateClipItems(clips);
    });
  }, []);

  const handleClipItemSelected = (item: ClipItemDoc) => {
    reArrangeClipItems(item);
    sendClipboardItemSelected(item);
    updateSelectedIndex(0);
    clipsListRef.current && (clipsListRef.current.scrollTop = 0);
  };

  const onClickClipItem = (item: ClipItemDoc) => {
    handleClipItemSelected(item);
  };

  const handleSearchUpdate = (text: string) => {
    updateSearchText(text);
    if (text === '') {
      searchBarRef.current && searchBarRef.current.blur();
    }

    updateSelectedIndex(0);
    clipsListRef.current && (clipsListRef.current.scrollTop = 0);

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

  const getClipItemVariant = (index: number): ClipItemVariants => {
    if (index === selectedIndex) {
      return 'selected';
    }

    if (index % 2 === 0) {
      return 'dark';
    } else {
      return 'light';
    }
  };

  return (
    <Box className={classes.container}>
      <SimpleBar
        className={classes.clipsContainer}
        scrollableNodeProps={{ref: clipsListRef}}
      >
        {clipItems.map((item, index) => (
          <ClipItemRow
            key={`${index}_clipItem`}
            clipItem={item}
            variant={getClipItemVariant(index)}
            onClick={() => onClickClipItem(item)}
          />
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
  });
});
