import assert from "node:assert/strict";
import test from "node:test";
import {
  canAutoplayVideo,
  createVideoPlaybackState,
  transitionVideoPlayback,
} from "../../src/js/features/media/video-playback.js";

const player = (overrides = {}) => {
  let state = createVideoPlaybackState();
  let environment = {
    effectsEnabled: true,
    ready: true,
    inViewport: true,
    elementVisible: true,
    pageVisible: true,
    paused: true,
    ended: false,
    ...overrides,
  };
  return {
    send(event, changes = {}) {
      environment = { ...environment, ...changes };
      const result = transitionVideoPlayback(state, event, environment);
      state = result.state;
      // Native play()/pause() change paused synchronously; events may arrive later.
      if (result.action) environment.paused = result.action === "pause";
      return result.action;
    },
    get autoplay() {
      return canAutoplayVideo(state, environment);
    },
  };
};

const start = (video) => {
  assert.equal(video.send("environment"), "play");
  assert.equal(video.send("play", { paused: false }), null);
};

test("automatic playback starts when ready and stops outside the viewport", () => {
  const video = player({ ready: false });
  assert.equal(video.send("environment"), null);
  assert.equal(video.send("environment", { ready: true }), "play");
  video.send("play", { paused: false });
  assert.equal(video.send("environment", { inViewport: false, elementVisible: false }), "pause");
  video.send("pause", { paused: true });
  assert.equal(video.send("environment", { inViewport: true, elementVisible: true }), "play");
});

test("CI replay: browser pause before the visibility callback preserves automatic intent", () => {
  const video = player();
  start(video);
  // WebKit paused outside the screen before IntersectionObserver updated.
  video.send("pause", { paused: true, elementVisible: false });
  video.send("environment", { inViewport: false });
  // Its native resume can precede the next visibility callback as well.
  assert.equal(video.send("play", { paused: false }), "pause");
  assert.equal(video.send("environment", { inViewport: true, elementVisible: true }), "play");
  video.send("pause", { paused: false });
  video.send("play", { paused: false });
  assert.equal(video.autoplay, true);
  assert.equal(video.send("environment", { inViewport: false, elementVisible: false }), "pause");
});

test("manual pause survives leaving and returning; manual resume stays available", () => {
  const video = player();
  start(video);
  video.send("pause", { paused: true });
  assert.equal(video.autoplay, false);
  assert.equal(video.send("environment", { inViewport: false, elementVisible: false }), null);
  assert.equal(video.send("environment", { inViewport: true, elementVisible: true }), null);
  assert.equal(video.send("play", { paused: false }), null);
  assert.equal(video.send("environment", { pageVisible: false }), null);
});

test("stale play and pause events cannot reverse the current media state", () => {
  const stopped = player({ inViewport: false, elementVisible: false });
  stopped.send("play", { paused: true });
  assert.equal(stopped.send("environment", { inViewport: true, elementVisible: true }), "play");

  const playing = player();
  start(playing);
  assert.equal(playing.send("pause", { paused: false }), null);
  assert.equal(playing.autoplay, true);
});

test("a browser pause while the document is hidden does not become a manual pause", () => {
  const video = player();
  start(video);
  video.send("pause", { pageVisible: false, paused: true });
  assert.equal(video.send("environment", { pageVisible: true }), "play");
});

test("effects off disables automatic playback and preserves native manual controls", () => {
  const video = player({ effectsEnabled: false });
  assert.equal(video.send("environment"), null);
  assert.equal(video.autoplay, false);
  assert.equal(video.send("play", { paused: false }), null);
  assert.equal(video.send("environment", { inViewport: false, elementVisible: false }), null);
  video.send("pause", { paused: true, inViewport: true, elementVisible: true });
  assert.equal(video.send("environment", { effectsEnabled: true }), null);
});

test("queued automatic pauses do not restart playback or consume a later manual pause", () => {
  const video = player();
  start(video);
  for (let cycle = 0; cycle < 2; cycle++) {
    assert.equal(video.send("environment", { inViewport: false, elementVisible: false }), "pause");
    assert.equal(video.send("environment", { inViewport: true, elementVisible: true }), "play");
  }
  assert.equal(video.send("pause", { paused: true }), null);
  assert.equal(video.send("pause", { paused: true }), null);
  assert.equal(video.autoplay, true);
  video.send("pause", { paused: true });
  assert.equal(video.autoplay, false);
});

test("manual pause is respected even before the visibility observer catches up", () => {
  const video = player();
  start(video);
  video.send("pause", { paused: true, inViewport: false, elementVisible: true });
  assert.equal(video.send("environment", { inViewport: true }), null);
});

test("an ended event does not turn a finished video into a manual pause", () => {
  const video = player();
  start(video);
  video.send("pause", { paused: true, ended: true });
  assert.equal(video.send("environment", { ended: false }), "play");
});
