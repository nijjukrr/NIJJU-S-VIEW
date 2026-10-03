# NIJJU'S EYE: The Last Signal

The opening at `/launch.html` is a fictional recovered-transmission story.
It mounts over the existing dashboard at `/satellite.html?intro=1`.
Reaching the final frame reveals Enter OrbitOS, which opens the dashboard when clicked. The dashboard and globe remain separate,
unchanged application surfaces.

## Sequence

All 960 frames from the supplied 40-second, 24 fps film form one uninterrupted
story: escape from orbit, descent into the storm, a drowned city, isolation,
and a final fall beneath the surface. The only visible copy is "Scroll to
enter"; reaching the final frame reveals the Enter OrbitOS button.

No media autoplay, audio playback, automatic scrolling, or timed dashboard
entry occurs. Native scrolling and the progress slider work in either direction.
Reduced-motion users receive discrete source frames without interpolation.

## Assets

- Source film: `Untitled_Scene_10-03_13_03_37_20261003184038.mp4` in Downloads.
- Served film: `public/media/horror/frames/0000.webp` through `0959.webp`.
- FFmpeg extraction removes the lower-right generator mark, strips audio, and
  writes WebP frames at the source 24 fps.
- Original user files are untouched.

The complete optimized sequence is about 35 MB. Only a nearby window is fetched
and decoded, with four concurrent requests and at most 18 mobile / 28 desktop
decoded bitmaps. Evicted bitmaps are closed. Failed frame loads do not retry
forever, and the last decoded image remains visible while loading.

## Verification

Run:

```sh
node --test src/launch/introConfig.test.mjs src/launch/frameCache.test.mjs src/satellite/dashboardRouting.test.mjs
npm run build
```

Focused tests cover distinct video frames, reverse
mapping, bounded decoding, stationary mobile cache behavior, disposal, and
explicit dashboard routing. Browser checks cover desktop and mobile, forward
and reverse scrolling, the final reveal, and OrbitOS entry.
