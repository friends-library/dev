import TrackPlayer from 'react-native-track-player';

export default async function (): Promise<void> {
  await TrackPlayer.setupPlayer();
  var track1 = {
    url: `https://flp-assets.nyc3.digitaloceanspaces.com/test.mp3`, // Load media from the network
    title: `Avaritia`,
    artist: `deadmau5`,
    album: `while(1<2)`,
    genre: `Progressive House, Electro House`,
    date: `2014-05-20T07:00:00+00:00`, // RFC 3339
    artwork: `https://flp-assets.nyc3.digitaloceanspaces.com/en/ann-branson/journal/modernized/images/cover--900x900.png`, // Load artwork from the network
    duration: 2, // Duration in seconds
  };
  await TrackPlayer.add([track1, track1]);
  await TrackPlayer.play();
}
