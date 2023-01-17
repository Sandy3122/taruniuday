// import lottieWeb from 'https://cdn.skypack.dev/lottie-web';
import lottieWeb from "/js/lottieweb.js";

class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('template');
        const templateContent = template.content;
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        everything(this);
    }
}

const everything = function(element) {  
  const shadow = element.shadowRoot;

    const playIconContainer = shadow.getElementById('play-icon');
    const muteIconContainer = shadow.getElementById('mute-icon');
    const audio = shadow.querySelector('audio');
    let playState = 'play';
    let muteState = 'unmute';
    let raf = null;

    audio.src = element.getAttribute('data-src');

    const playAnimation = lottieWeb.loadAnimation({
        container: playIconContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        // renderer: 'svg',
        // Background: 'black !important',
        loop: false,
        autoplay: true,
        name: "Pause Animation",
    });
          
    const muteAnimation = lottieWeb.loadAnimation({
        container: muteIconContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        // renderer: 'svg',
        loop: false,
        autoplay: true,
        name: "Play Animation",
    });
          
    playAnimation.goToAndStop(14, true);

    const whilePlaying = () => {
        seekSlider.value = Math.floor(audio.currentTime);
        currentTimeContainer.textContent = calculateTime(seekSlider.value);
        audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
        raf = requestAnimationFrame(whilePlaying);
    }

    const showRangeProgress = (rangeInput) => {
        if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
        else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    }

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }

        
        

    playIconContainer.addEventListener('click', () => {
        if(playState === 'play') {
            audio.play();
            playAnimation.playSegments([14, 27], true);
            requestAnimationFrame(whilePlaying);
            playState = 'pause';
        } else {
            audio.pause();
            playAnimation.playSegments([0, 14], true);
            cancelAnimationFrame(raf);
            playState = 'play';
        }
    });
        
    muteIconContainer.addEventListener('click', () => {
        if(muteState === 'unmute') {
            muteAnimation.playSegments([0, 15], true);
            audio.muted = true;
            muteState = 'mute';
        } else {
            muteAnimation.playSegments([15, 25], true);
            audio.muted = false;
            muteState = 'unmute';
        }
    });


    if('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Komorebi',
            artist: 'Anitek',
            album: 'MainStay',
            artwork: [
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '96x96', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '128x128', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '192x192', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '256x256', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '384x384', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '512x512', type: 'image/png' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', () => {
            if(playState === 'play') {
                audio.play();
                playAnimation.playSegments([14, 27], true);
                requestAnimationFrame(whilePlaying);
                playState = 'pause';
            } else {
                audio.pause();
                playAnimation.playSegments([0, 14], true);
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if(playState === 'play') {
                audio.play();
                playAnimation.playSegments([14, 27], true);
                requestAnimationFrame(whilePlaying);
                playState = 'pause';
            } else {
                audio.pause();
                playAnimation.playSegments([0, 14], true);
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            audio.currentTime = audio.currentTime - (details.seekOffset || 10);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            audio.currentTime = audio.currentTime + (details.seekOffset || 10);
        });
        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.fastSeek && 'fastSeek' in audio) {
              audio.fastSeek(details.seekTime);
              return;
            }
            audio.currentTime = details.seekTime;
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            audio.currentTime = 0;
            seekSlider.value = 0;
            audioPlayerContainer.style.setProperty('--seek-before-width', '0%');
            currentTimeContainer.textContent = '0:00';
            if(playState === 'pause') {
                playAnimation.playSegments([0, 14], true);
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });
    }
}

customElements.define('audio-player', AudioPlayer);