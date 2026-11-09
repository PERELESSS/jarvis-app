// Hands the microphone's samples to the page, for hold to talk (see src/audio.ts).
class JarvisMic extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch && ch.length) this.port.postMessage(ch.slice(0));
    return true;
  }
}
registerProcessor("jarvis-mic", JarvisMic);
