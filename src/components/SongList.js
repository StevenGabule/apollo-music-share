import {CircularProgress} from "@material-ui/core";
import {useSubscription} from "@apollo/react-hooks";
import {GET_SONGS} from "../graphql/subscriptions";
import Song from "./Song";

function SongList() {
    const {data, loading, error} = useSubscription(GET_SONGS);
    if (loading) {
        return (
            <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',marginTop: 50}}>
                <CircularProgress/>
            </div>
        )
    }

    if (error) return <div>Error Fetching songs</div>
    return <div>{data.songs.map((song) => <Song key={song.id} song={song}/>)}</div>
}

export default SongList;