const laughSounds = [
    "/sounds/risa1.mp3",
    "/sounds/risa2.mp3",
    "/sounds/risa3.mp3",
    "/sounds/risa4.mp3",
    "/sounds/risa5.mp3",
    "/sounds/risa6.mp3",
    "/sounds/risa7.mp3",
    "/sounds/risa8.mp3",
    "/sounds/risa9.mp3",
  ];

  const playButton = document.getElementById('playLaughSound');

  playButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * laughSounds.length);
    const audio = new Audio(laughSounds[randomIndex]);
    audio.play();
  });
  