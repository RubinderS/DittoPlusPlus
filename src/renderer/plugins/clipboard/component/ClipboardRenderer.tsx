import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ClipItemDoc, Events, Messages} from '../types';
import * as PluginTypes from '@type/pluginTypes';
import useEventListener from '@use-it/event-listener';
import {clamp, inRange} from 'lodash';
import {SearchBar} from './SearchBar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {dimensions, isAlphanumeric} from './utils';
import {ClipItem, ClipItemVariants} from './ClipItemRow';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const SimpleBarStyles: React.CSSProperties = {
  display: 'flex',
  height: '100%',
  width: '100%',
  overflowY: 'auto',
  scrollBehavior: 'unset',
  flexDirection: 'column',
};

export const ClipboardRenderer = (props: PluginTypes.RenderProps) => {
  const [clipItems, updateClipItems] = useState<ClipItemDoc[]>([]);
  const [selectedIndex, updateSelectedIndex] = useState(0);
  const [searchText, updateSearchText] = useState('');
  const {pluginProcess} = props;
  const searchBarRef = useRef<HTMLInputElement>(null);
  const clipsListRef = useRef<HTMLDivElement>(null);

  const resetClips = () => {
    pluginProcess.sendMessage(Messages.GetAllClipItems, '', (err, clips) => {
      if (!err) {
        updateClipItems([...clips]);
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
      const {clipItemDimensions, searchBarDimensions} = dimensions;

      const clipRowHeight =
        clipItemDimensions.heightPx +
        clipItemDimensions.paddingTopPx +
        clipItemDimensions.paddingBottomPx;

      const searchBarHeight =
        searchBarDimensions.heightPx +
        searchBarDimensions.paddingTopPx +
        searchBarDimensions.paddingBottomPx;

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
          clamp(prevSelectedIndex - 1, 0, clipItems.length - 1),
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
          clamp(prevSelectedIndex + 1, 0, clipItems.length - 1),
        );
      }
    }

    /* escape */
    if (keyCode === 27) {
      if (searchText) {
        resetClips();
      }

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
    resetClips();

    pluginProcess.on(Events.NewClip, (clip: ClipItemDoc) => {
      updateClipItems((prevClipItems) => [clip, ...prevClipItems]);
    });

    pluginProcess.on(Events.ClipsInitialized, (clips: ClipItemDoc[]) => {
      updateClipItems([...clips]);
    });
  }, []);

  const handleClipItemSelected = (item: ClipItemDoc) => {
    pluginProcess.sendMessage(Messages.ClipItemSelected, item, (err, res) => {
      if (err) {
        throw err;
      }

      if (res) {
        updateClipItems([...res]);
      }
    });

    handleSearchUpdate('');
  };

  const onClickClipItem = (item: ClipItemDoc) => {
    handleClipItemSelected(item);
  };

  const handleSearchUpdate = (text: string) => {
    updateSearchText(text);
    updateSelectedIndex(0);
    clipsListRef.current && (clipsListRef.current.scrollTop = 0);

    if (text === '') {
      searchBarRef.current && searchBarRef.current.blur();
      resetClips();
    } else {
      pluginProcess.sendMessage(Messages.SearchClips, text, (err, clips) => {
        if (err) {
          throw err;
        }

        updateClipItems([...clips]);
      });
    }
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
    <StyledContainer>
      <SimpleBar
        style={SimpleBarStyles}
        scrollableNodeProps={{ref: clipsListRef}}
      >
        {clipItems.map((item, index) => (
          <ClipItem
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
    </StyledContainer>
  );
};
