export const createVideoPlaybackState = () => ({
  intent: "auto",
  pendingPauses: 0,
});

export const canAutoplayVideo = (state, environment) =>
  environment.effectsEnabled &&
  environment.ready &&
  environment.inViewport &&
  environment.pageVisible &&
  state.intent === "auto";

export const transitionVideoPlayback = (state, event, environment) => {
  const next = { ...state };
  if (event === "pause") {
    if (next.pendingPauses > 0) next.pendingPauses -= 1;
    else if (
      environment.paused &&
      !environment.ended &&
      environment.ready &&
      environment.pageVisible &&
      environment.elementVisible &&
      (next.intent !== "auto" || environment.effectsEnabled)
    ) {
      next.intent = "paused";
    }
    // A queued pause must not restart media that the user has since paused.
    return { state: next, action: null };
  }

  if (event === "play") {
    if (environment.paused) return { state: next, action: null };
    if (next.intent === "paused" || !environment.effectsEnabled) next.intent = "playing";
  }

  let action = null;
  if (environment.ready && next.intent !== "playing") {
    if (canAutoplayVideo(next, environment) && environment.paused) {
      action = "play";
    } else if (!canAutoplayVideo(next, environment) && !environment.paused) {
      next.pendingPauses += 1;
      action = "pause";
    }
  }
  return { state: next, action };
};
