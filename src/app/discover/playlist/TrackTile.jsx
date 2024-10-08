import { useDispatch, useSelector } from 'react-redux';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import classNames from 'classnames';

import { selectTrack } from '../../../store/selectedSlice';

const TrackTile = ({ artists, name, preview_url, uri, album, setAudioSrc, audioSrc }) => {
  const dispatch = useDispatch();
  const checked = useSelector((state) => state.selected.indexOf(uri) !== -1);

  const playPreview = () => {
    setAudioSrc(preview_url);
  };

  const stopPreview = () => {
    setAudioSrc(null);
  };

  const keyCheck = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      triggerTrack(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      stopPreview();
    }
  };

  const triggerTrack = () => {
    if (checked) {
      stopPreview();
    } else {
      playPreview();
    }
    dispatch(
      selectTrack({
        uri,
        checked: !checked,
      })
    );
  };

  const playing = audioSrc === preview_url;

  return (
    <div className="flex border">
      <div
        className={classNames('flex flex-1 cursor-pointer', {
          'bg-neutral-200': !checked && playing,
          'bg-green-300': checked,
          'bg-neutral-100': !checked,
        })}
        onMouseOver={playPreview}
        onMouseOut={stopPreview}
        onClick={triggerTrack}
        tabIndex={0}
        onFocus={playPreview}
        onBlur={stopPreview}
        onKeyDown={keyCheck}
      >
        <div className="pointer-events-none flex shrink-0 basis-10 items-center justify-center">
          {checked ? (
            <CheckBoxIcon sx={{ fontSize: 30 }} />
          ) : (
            <CheckBoxOutlineBlankIcon sx={{ fontSize: 30 }} />
          )}
        </div>
        <div className="flex">
          <div className="mr-2 flex-[0_0_64px] self-center">
            <img src={album.images[2].url} alt="cover" width={64} height={64} />
          </div>
          <div className="overflow-anywhere ms:text-md text-sm">
            <span>
              {artists
                .map(
                  ({ name: artistName, id, external_urls: { spotify: artist_link } }) => artistName
                )
                .join(', ') + ' - '}
            </span>
            <span className="italic">{name}</span>
          </div>
        </div>
      </div>
      {preview_url ? (
        <div
          className={classNames(
            'flex basis-20 cursor-pointer items-center justify-center bg-green-200 hover:bg-green-300',
            { 'bg-green-300': playing }
          )}
          onClick={() => (!playing ? playPreview() : stopPreview())}
        >
          {!playing ? <PlayCircle sx={{ fontSize: 70 }} /> : <PauseCircle sx={{ fontSize: 70 }} />}
        </div>
      ) : (
        <div className="flex basis-20 items-center justify-center bg-gray-200 text-center hover:bg-green-300">
          preview missing
        </div>
      )}
    </div>
  );
};

export default TrackTile;
