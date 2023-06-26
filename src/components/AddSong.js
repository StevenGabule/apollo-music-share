import React, { useEffect, useState } from "react";
import { InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, TextField } from "@material-ui/core";
import { AddBoxOutlined, Link } from "@material-ui/icons";
import ReactPlayer from "react-player";

import { useMutation } from "@apollo/react-hooks";
import { ADD_SONG } from "../graphql/mutations";

const useStyles = makeStyles((theme) => ({
  container: { display: "flex", alignItems: "center" },
  urlInput: { margin: theme.spacing(1) },
  addSongButton: { margin: theme.spacing(1) },
  dialog: { textAlign: "center" },
  thumbnail: { width: "90%" },
}));

const DEFAULT_SONG = { duration: 0, title: "", artist: "", thumbnail: "" };

function AddSong() {
  const classes = useStyles();
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [url, setUrl] = useState("");
  const [playable, setPlayable] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [song, setSong] = useState(DEFAULT_SONG);

  useEffect(() => {
    const isPlayable = ReactPlayer.canPlay(url) || ReactPlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  const handleCloseDialog = () => setDialog(false)

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;

    if (nestedPlayer.getVideoData) songData = getYoutubeInfo(nestedPlayer);
    else if (nestedPlayer.getCurrentSound) songData = await getSoundCloudInfo(nestedPlayer);

    setSong({ ...songData, url });
  }

  function getSoundCloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return { duration, title, artist: author, thumbnail };
  }

  function handleChangeSong(e) {
    const { name, value } = e.target;
    setSong((prevSong) => ({ ...prevSong, [name]: value }));
  }

  async function handleAddSong() {
    try {
      const { url, thumbnail, duration, title, artist } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
        },
      });

      handleCloseDialog();

      setSong(DEFAULT_SONG);

      setUrl("");
    } catch (e) {
      console.error("Error adding song", e);
    }
  }

  function handleInputError(field) {
    return error && error.graphQLErrors[0].extensions.path.includes(field);
  }

  const { title, thumbnail, artist } = song;

  return (
    <div className={classes.container}>
      <Dialog className={classes.dialog} open={dialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Song</DialogTitle>

        <DialogContent>
          <img className={classes.thumbnail} src={thumbnail} alt="Song thumbnail" />

          <TextField
            margin={"dense"}
            name={"title"}
            label={"Title"}
            value={title}
            onChange={handleChangeSong}
            error={handleInputError("title")}
            helperText={handleInputError("title") && "Fill out field"}
            fullWidth
          />

          <TextField
            margin={"dense"}
            name={"artist"}
            value={artist}
            onChange={handleChangeSong}
            error={handleInputError("artist")}
            helperText={handleInputError("artist") && "Fill out field"}
            label={"Artist"}
            fullWidth
          />

          <TextField
            margin={"dense"}
            name={"thumbnail"}
            onChange={handleChangeSong}
            error={handleInputError("thumbnail")}
            helperText={handleInputError("thumbnail") && "Fill out field"}
            label={"Thumbnail"}
            value={thumbnail}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color={"secondary"}>
            Cancel
          </Button>
          <Button onClick={handleAddSong} color={"primary"} variant={"outlined"}>
            Add Song
          </Button>
        </DialogActions>
      </Dialog>

      <TextField
        className={classes.urlInput}
        onChange={(e) => setUrl(e.target.value)}
        value={url}
        fullWidth
        margin={"normal"}
        type={"url"}
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <Link />
            </InputAdornment>
          ),
        }}
        placeholder={"Add Youtube or Sound Cloud Url"}
      />

      <Button
        disabled={!playable}
        className={classes.addSongButton}
        onClick={() => setDialog(true)}
        variant={"contained"}
        color={"primary"}
        endIcon={<AddBoxOutlined />}>
        Add Song
      </Button>

      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
}

export default AddSong;
