import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Box} from '@material-ui/core';
import {Theme, createStyles, makeStyles} from '@material-ui/core';
import {ClipDoc, Events, Messages} from '../types';
import * as PluginTypes from '@type/pluginTypes';
import useEventListener from '@use-it/event-listener';
import {clamp, inRange} from 'lodash';
import {SearchBar} from './SearchBar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {dimensions, isAlphanumeric, shiftItemToFront} from './utils';
import {ClipRow, ClipRowVariants} from './ClipRow';

export const ClipboardRenderer = (props: PluginTypes.RenderProps) => {
  const classes = useStyles();
  const [clipDoc, updateClipDocs] = useState<ClipDoc[]>([]);
  const [selectedIndex, updateSelectedIndex] = useState(0);
  const [searchText, updateSearchText] = useState('');
  const {process} = props;
  const searchBarRef = useRef<HTMLDivElement>(null);
  const clipsListRef = useRef<HTMLDivElement>(null);

  const sendClipDocSelected = (clipDoc: ClipDoc) => {
    process.sendMessage(Messages.ClipDocSelected, clipDoc, (err, res) => {
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
      const {clipRow, searchBar} = dimensions;

      const clipRowHeight =
        clipRow.height + clipRow.paddingTop + clipRow.paddingBottom;

      const searchBarHeight =
        searchBar.height + searchBar.paddingTop + searchBar.paddingBottom;

      const viewHeight = clipsListRef.current.offsetHeight - searchBarHeight;
      const itemsVisibleN = Math.floor(viewHeight / clipRowHeight);

      const itemsScrolled = Math.floor(
        clipsListRef.current.scrollTop / clipRowHeight,
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
            top: -clipRowHeight,
          });
        } else {
          clipsListRef.current.scrollTop = (selectedIndex - 2) * clipRowHeight;
        }

        updateSelectedIndex((prevSelectedIndex) =>
          clamp(prevSelectedIndex - 1, 0, clipDoc.length - 1),
        );
      }

      /* down key */
      if (keyCode === 40) {
        if (selectedIndex >= itemsVisibleN - 1 && isItemInViewPort) {
          clipsListRef.current.scrollBy({top: clipRowHeight});
        } else if (clipsListRef.current.scrollTop) {
          clipsListRef.current.scrollTop = selectedIndex * clipRowHeight;
        }

        updateSelectedIndex((prevSelectedIndex) =>
          clamp(prevSelectedIndex + 1, 0, clipDoc.length - 1),
        );
      }
    }

    /* escape */
    if (keyCode === 27) {
      handleSearchUpdate('');
    }

    /* enter key */
    if (keyCode === 13) {
      handleClipDocSelected(clipDoc[selectedIndex]);
    }

    /* key is alphanumeric */
    if (isAlphanumeric(keyCode)) {
      updateSelectedIndex(0);
      searchBarRef.current && searchBarRef.current.focus();
    }
  };

  useEventListener('keydown', onKeyPress);

  useEffect(() => {
    process.sendMessage(Messages.GetAllClipDocs, '', (err, clips) => {
      if (!err) {
        updateClipDocs([...clips]);
      }
    });

    process.on(Events.NewClip, (clip: ClipDoc) => {
      updateClipDocs((prevClipDocs) => [clip, ...prevClipDocs]);
    });

    process.on(Events.ClipsInitialized, (clips: ClipDoc[]) => {
      updateClipDocs([...clips]);
    });
  }, []);

  const handleClipDocSelected = (item: ClipDoc) => {
    updateClipDocs(shiftItemToFront(clipDoc, item));
    sendClipDocSelected(item);
    handleSearchUpdate('');
    updateSelectedIndex(0);
    clipsListRef.current && (clipsListRef.current.scrollTop = 0);
  };

  const onClickClipRow = (item: ClipDoc) => {
    handleClipDocSelected(item);
  };

  const handleSearchUpdate = (text: string) => {
    updateSearchText(text);
    if (text === '') {
      searchBarRef.current && searchBarRef.current.blur();
    }

    updateSelectedIndex(0);
    clipsListRef.current && (clipsListRef.current.scrollTop = 0);

    process.sendMessage(Messages.SearchClips, text, (err, clips) => {
      if (err) {
        throw err;
      }

      updateClipDocs([...clips]);
    });
  };

  const onSearchTextChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const query = event.target.value;
    handleSearchUpdate(query);
  };

  const getClipRowVariant = (index: number): ClipRowVariants => {
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
        {clipDoc.map((item, index) => (
          <ClipRow
            key={`${index}_clipRow`}
            clipDoc={item}
            variant={getClipRowVariant(index)}
            onClick={() => onClickClipRow(item)}
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
