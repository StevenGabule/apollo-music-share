import React, {createContext, useContext, useReducer} from 'react';
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import {Grid, useMediaQuery, Hidden} from "@material-ui/core";
import songReducer from "./reducer";

export const SongContext = createContext({
    song: {
        id: "a5b4717d-8bd5-4177-ba80-51d07ad60f69",
        title: "The Prince Karma - Later Bitches",
        artist: "awesome bitch",
        thumbnail: "http://img.youtube.com/vi/5Pa5WT9T_-0/0.jpg",
        url: "https://www.youtube.com/watch?v=5Pa5WT9T_-0",
        duration: "257",
    },
    isPlaying: false
});

function App() {
    const initialSongState = useContext(SongContext);
    const [state, dispatch] = useReducer(songReducer, initialSongState);
    const greaterThanMD = useMediaQuery(theme => theme.breakpoints.up('md'));
    const greaterThanSM = useMediaQuery(theme => theme.breakpoints.up('sm'));

    return (
        <SongContext.Provider value={{state, dispatch}}>
            <Hidden only={'xs'}>
                <Header/>
            </Hidden>
            <Grid container spacing={3}>
                <Grid style={{ paddingTop: greaterThanSM ? 80: 10 }} item xs={12} md={7}>
                    <AddSong/>
                    <SongList/>
                </Grid>
                <Grid style={greaterThanMD ? {
                    position: 'fixed',
                    width: '100%',
                    right: 0,
                    top: 70
                } : {
                    position: 'fixed',
                    width: '100%',
                    left: 0,
                    bottom: 0
                }} item xs={12} md={5}>
                    <SongPlayer/>
                </Grid>
            </Grid>
        </SongContext.Provider>
    );
}

export default App;
