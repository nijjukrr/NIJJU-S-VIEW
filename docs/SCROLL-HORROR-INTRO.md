# NIJJU'S EYE: The Last Signal

The opening at `/launch.html` is a fictional recovered-transmission story.
It mounts over the existing dashboard at `/satellite.html?intro=1`.
Only Enter or Skip dismisses it. The dashboard and globe remain separate,
unchanged application surfaces.

## Sequence

480 actual frames from the supplied 20-second, 24 fps film are intercut with
all seven requested stills: solar contact, escape, ruined station, astronaut,
reentry, impact, and aftermath. The final passage moves into a cleaned
empty-helmet close-up and then the hand inside the visor. The only visible
copy is "Scroll to enter"; reaching the end reveals the OrbitOS dashboard.

No media autoplay, audio playback, automatic scrolling, or timed dashboard
entry occurs. Native scrolling and the progress slider work in either direction.
Reduced-motion users receive discrete story stills without camera interpolation.

## Assets

- Source film: `Untitled_Scene_10-02_20_54_55_20261003022734.mp4` in Downloads.
- Served film: `public/media/horror/frames/0000.webp` through `0479.webp`.
- FFmpeg extraction: `-vf delogo=x=1128:y=568:w=70:h=68 -an -c:v libwebp -quality 78 -compression_level 4 -start_number 0`.
- Seven supplied ChatGPT stills are optimized to WebP and placed in narrative
  order. A slight motion crop keeps their small corner marks offscreen.
- Additional still sources: `scary_space_storyboard_frames/12_final_helmet_turn.png`
  and `08_visor_tap.png` in Downloads.
- Cleaned outputs: `public/media/horror/helmet.webp` and `visor-tap.webp`.
- Image editing brief: remove all captions, numbers, timestamps, panel borders,
  logos and diamond symbols; preserve the worn helmet, empty black visor or
  hand inside, and cinematic lighting; extend to 16:9 without adding people.
- Original user files are untouched.

The complete frame sequence is about 22 MB. Only a nearby window is fetched
and decoded, with four concurrent requests and at most 18 mobile / 28 desktop
decoded bitmaps. Evicted bitmaps are closed. Failed frame loads do not retry
forever, and the last decoded image remains visible while loading.

## Verification

Run:

```sh
node --test src/launch/introConfig.test.mjs src/launch/frameCache.test.mjs src/satellite/dashboardRouting.test.mjs
npm run build
```

Focused tests cover all seven requested images, distinct video frames, reverse
mapping, bounded decoding, stationary mobile cache behavior, disposal, and
explicit dashboard routing. Browser checks cover desktop and mobile, forward
and reverse scrolling, the final reveal, OrbitOS entry, and Skip.
