# NIJJU'S EYE // FUTURISTIC TRACKING INTRO

The opening at `/launch.html` is an interactive cinematic reconnaissance intro driven by `Creating_futuristic_tracking_video_6ac63e22.mp4`.
It mounts over the operations dashboard at `/satellite.html?intro=1`.

## Features

1. **Hardware-Accelerated Video Scrubbing**:
   - Source: `Creating_futuristic_tracking_video_6ac63e22.mp4` served at `/media/futuristic-tracking.mp4` with HTTP 206 byte-range streaming.
   - Smooth exponential interpolation (`lerp`) synchronizes video playback directly to scroll position forwards and backwards.
   - Auto-play toggle available in the footer for hands-free previewing.

2. **Cybernetic HUD Telemetry**:
   - **Tactical Header**: Displays live orbital lock status, coordinate ticker (Latitude, Longitude, Altitude), live satellite tracking percentage, audio mute/unmute control, and a quick skip action.
   - **Center Reticle**: Animated target tracking ring with rotating crosshairs, rangefinder brackets, target vector ID, and real-time mission timestamp `T+X.XXs`.
   - **Dynamic Narrative Milestones**:
     - **Phase 01**: Global Tracking Array (Orbital Deployment)
     - **Phase 02**: Multi-Spectrum Lock (Target Acquisition)
     - **Phase 03**: Deep Telemetry Fusion (Intelligence Synthesis)
     - **Phase 04**: Planetary Console Ready (Command Clearance)
   - **Vertical Telemetry Rail**: Visual progress bar on right edge tracking `00%` to `100%` with milestone pips.

3. **Enter OrbitOS Climax CTA**:
   - High-tech glowing command button revealed as the user reaches the culmination of the tracking journey.
   - Animated orbital conic-gradient light border, radial aura glow, and directional arrow.
   - Clicking triggers a hyperspace/warp transition that unmounts the intro and seamlessly focuses the dashboard console without page reloads.

## Verification

Run:
```sh
node --test src/launch/introConfig.test.mjs src/launch/frameCache.test.mjs src/satellite/dashboardRouting.test.mjs
npm run build
```
