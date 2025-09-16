type Sounds = Record<string, Promise<typeof import('*.mp3')>>;
type SoundLibrary<T extends Sounds> = {
  [K in keyof T]: {
    play(gain?: number): void;
    loop(gain?: number): () => void;
  }
};

const ctx = new AudioContext();

async function makeSound<const T extends Sounds>(sounds: T) {
  const promises = Object
    .entries(sounds)
    .map(async ([key, value]) => {
      const req = await fetch((await value).default);
      const buff = await req.arrayBuffer();
      const data = await ctx.decodeAudioData(buff);

      function make(gain?: number) {
        const node = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        node.buffer = data;
        node.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNode.gain.value = gain ?? 1;
        node.onended = () => {
          node.disconnect(gainNode);
          gainNode.disconnect(ctx.destination);
        };
        return node;
      }

      return [key, {
        play(gain?: number) {
          const node = make(gain);
          node.start();
        },
        loop(gain?: number) {
          const node = make(gain);
          node.loop = true;
          node.start();
          return () => {
            node.loop = false;
            node.stop();
          };
        }
      }] as const;
    });

  const data = await Promise.all(promises);

  return data.reduce((acc, [key, value]) => {
    return Object.assign(acc, { [key]: value });
  }, {} as SoundLibrary<T>);
}

export default await makeSound({
  win: import('../sound/win.mp3'),
  nowin: import('../sound/nowin.mp3'),
  tick: import('../sound/tick.mp3'),
  music: import('../sound/music.wav'),
  new: import('../sound/new.mp3'),
  showWIn: import('../sound/show-win.mp3'),
});