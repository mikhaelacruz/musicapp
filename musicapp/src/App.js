import "./App.css";
import { useEffect, useState } from "react";

export default App;

const CLIENT_ID = "6f5fed7328bb4b8b990a40ef20f93b30";
const CLIENT_SECRET = "8cf4d41f52684ac0b8071115f19275d0";

function App() {
  const [music, setMusic] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [musicSortBy, setMusicSortBy] = useState("");
  const [playlistSortBy, setPlaylistSortBy] = useState("");
  console.log(music);
  return (
    <div>
      <NavigationBar>
        <Search setMusic={setMusic} music={music} />
        <NumResult music={music} />
      </NavigationBar>

      <Main>
        <Box title="Music List">
          <select
            className="sortBy"
            value={musicSortBy}
            onChange={(e) => {
              setMusicSortBy(() => {
                if (e.target.value === "ascending") {
                  setMusic(music.sort((a, b) => a.name.localeCompare(b.name)));
                } else if (e.target.value === "descending") {
                  setMusic(music.sort((a, b) => b.name.localeCompare(a.name)));
                } else if (e.target.value === "ascendingart") {
                  setMusic(
                    music.sort((a, b) =>
                      a.artists[0].name.localeCompare(b.artists[0].name)
                    )
                  );
                } else {
                  setMusic(
                    music.sort((a, b) =>
                      b.artists[0].name.localeCompare(a.artists[0].name)
                    )
                  );
                }
                return e.target.value;
              });
            }}
          >
            <option value="">Select Sort By</option>
            <option value="ascending">Sort By Name Ascending</option>
            <option value="descending">Sort By Name Descending</option>
            <option value="ascendingart">Sort By Artist Ascending</option>
            <option value="descendingart">Sort By Artist Descending</option>
          </select>
          <Music music={music} setPlaylist={setPlaylist} playlist={playlist} />
        </Box>

        <Box title="Playlist">
          <select
            className="sortBy"
            value={playlistSortBy}
            onChange={(e) => {
              setPlaylistSortBy(() => {
                if (e.target.value === "ascending") {
                  setPlaylist(
                    playlist.sort((a, b) => a.name.localeCompare(b.name))
                  );
                } else if (e.target.value === "descending") {
                  setPlaylist(
                    playlist.sort((a, b) => b.name.localeCompare(a.name))
                  );
                } else if (e.target.value === "ascendingart") {
                  setPlaylist(
                    playlist.sort((a, b) =>
                      a.artists[0].name.localeCompare(b.artists[0].name)
                    )
                  );
                } else {
                  setPlaylist(
                    playlist.sort((a, b) =>
                      b.artists[0].name.localeCompare(a.artists[0].name)
                    )
                  );
                }
                return e.target.value;
              });
            }}
          >
            <option value="">Select Sort By</option>
            <option value="ascending">Sort By Name Ascending</option>
            <option value="descending">Sort By Name Descending</option>
            <option value="ascendingart">Sort By Artist Ascending</option>
            <option value="descendingart">Sort By Artist Descending</option>
          </select>
          <Playlist playlist={playlist} />
        </Box>
      </Main>
    </div>
  );
}

function NavigationBar({ children }) {
  return (
    <nav className="navbar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return <h1 className="logotitle">⊹☾⋆⁺₊🎧 °｡</h1>;
}

function NumResult({ music }) {
  return (
    <p className="results">
      Found <strong>{music.length}</strong> results
    </p>
  );
}

function Music({ music, setPlaylist, playlist }) {
  const addToPlaylist = (music) => {
    setPlaylist([...playlist, music]);
  };
  return (
    <ul>
      {music.map((music) => (
        <li key={music.id}>
          {music.name} by {music.artists[0].name}
          <button
            onClick={() => {
              addToPlaylist(music);
            }}
          >
            ♥️
          </button>
        </li>
      ))}
    </ul>
  );
}

function Box({ children, title }) {
  return (
    <div className="container">
      <h2>{title}</h2>
      <div className="boxContainer">{children}</div>
    </div>
  );
}

function Playlist({ playlist }) {
  return (
    <ul playlist>
      {playlist.map((music) => (
        <li key={music.id}>
          {music.name} by {music?.artists?.[0].name || ""}
          {music.title} {music.artist}
        </li>
      ))}
    </ul>
  );
}

function Search({ setMusic, music }) {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    var authParameter = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    fetch("http://accounts.spotify.com/api/token", authParameter).then(
      (result) =>
        result.json().then((data) => setAccessToken(data.access_token))
    );
  }, []);

  async function search() {
    // console.log("Searching for" + query);
    var trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    var tracks = await fetch(
      "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=50",
      trackParameters
    ).then((result) =>
      result.json().then((data) => setMusic(data.tracks.items))
    );
  }

  console.log(music);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search music..."
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          search();
        }
      }}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return (
    <div>
      <div className="container">{children}</div>
    </div>
  );
}
