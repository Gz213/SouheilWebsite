const audio = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trackTitle = document.getElementById('trackTitle');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const volumeProgress = document.getElementById('volumeProgress');
const glassPlayer = document.getElementById('musicPlayer');
const playlistEl = document.getElementById('playlist');
const progressThumb = document.getElementById('progressThumb');
const volumeThumb = document.getElementById('volumeThumb');

// The music files available in public/music/
const tracks = [
    { title: "Microwave Love", file: "AUDIO-2026-05-12-17-42-12.aac" },
    { title: "Soulful Whispers", file: "AUDIO-2026-05-12-17-42-54.aac" },
    { title: "Brown Sugar", file: "AUDIO-2026-05-12-17-43-41.aac" },
    { title: "Bordeaux Nights", file: "AUDIO-2026-05-12-17-44-06.aac" },
    { title: "Velvet Voice", file: "AUDIO-2026-05-12-17-44-28.aac" },
    { title: "Golden Hour", file: "AUDIO-2026-05-12-17-44-44.aac" },
    { title: "Rhythm of Heart", file: "AUDIO-2026-05-12-17-45-10.aac" },
    { title: "Deep Roots", file: "AUDIO-2026-05-12-17-45-39.aac" },
    { title: "Smooth Groove", file: "AUDIO-2026-05-12-17-46-07.aac" },
    { title: "Ending Journey", file: "AUDIO-2026-05-12-17-46-34.aac" }
];

let trackIndex = 0;
let isPlaying = false;

// Initialize
function initPlayer() {
    loadTrack(trackIndex);
    renderPlaylist();
    // Default volume
    audio.volume = 0.5;
    volumeProgress.style.width = '50%';
    volumeThumb.style.left = '50%';
}

// Load track
function loadTrack(index) {
    const track = tracks[index];
    trackTitle.textContent = track.title;
    audio.src = `./music/${track.file}`;
    updatePlaylistActiveItem();
}

// Play song
function playSong() {
    isPlaying = true;
    glassPlayer.classList.add('playing');
    playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
    playBtn.classList.add('playing');
    audio.play();
}

// Pause song
function pauseSong() {
    isPlaying = false;
    glassPlayer.classList.remove('playing');
    playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
    playBtn.classList.remove('playing');
    audio.pause();
}

// Toggle Play/Pause
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Prev Song
function prevSong() {
    trackIndex--;
    if (trackIndex < 0) {
        trackIndex = tracks.length - 1;
    }
    loadTrack(trackIndex);
    if (isPlaying) playSong();
}

// Next Song
function nextSong() {
    trackIndex++;
    if (trackIndex > tracks.length - 1) {
        trackIndex = 0;
    }
    loadTrack(trackIndex);
    if (isPlaying) playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Update progress bar
audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    
    // Update progress bar width
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        progressThumb.style.left = `${progressPercent}%`;
        
        // Calculate display for time
        const currentMins = Math.floor(currentTime / 60);
        let currentSecs = Math.floor(currentTime % 60);
        if (currentSecs < 10) currentSecs = `0${currentSecs}`;
        currentTimeEl.textContent = `${currentMins}:${currentSecs}`;
    }
});

// Format duration once metadata loads
audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration;
    const durationMins = Math.floor(duration / 60);
    let durationSecs = Math.floor(duration % 60);
    if (durationSecs < 10) durationSecs = `0${durationSecs}`;
    durationEl.textContent = `${durationMins}:${durationSecs}`;
});

// Progress Dragging
let isDraggingProgress = false;

progressContainer.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    updateProgress(e);
});

// Touch support for progress
progressContainer.addEventListener('touchstart', (e) => {
    isDraggingProgress = true;
    updateProgress(e.touches[0]);
}, { passive: true });

// Volume Dragging
let isDraggingVolume = false;

volumeBar.addEventListener('mousedown', (e) => {
    isDraggingVolume = true;
    updateVolume(e);
});

// Touch support for volume
volumeBar.addEventListener('touchstart', (e) => {
    isDraggingVolume = true;
    updateVolume(e.touches[0]);
}, { passive: true });

// Window events to handle dragging outside the element
window.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) updateProgress(e);
    if (isDraggingVolume) updateVolume(e);
});

window.addEventListener('touchmove', (e) => {
    if (isDraggingProgress) {
        updateProgress(e.touches[0]);
        e.preventDefault(); // Prevent scrolling while dragging
    }
    if (isDraggingVolume) {
        updateVolume(e.touches[0]);
        e.preventDefault(); // Prevent scrolling while dragging
    }
}, { passive: false });

window.addEventListener('mouseup', () => {
    isDraggingProgress = false;
    isDraggingVolume = false;
});

window.addEventListener('touchend', () => {
    isDraggingProgress = false;
    isDraggingVolume = false;
});

function updateProgress(e) {
    const rect = progressContainer.getBoundingClientRect();
    const width = rect.width;
    let x = e.clientX - rect.left;
    
    // Boundary check
    if (x < 0) x = 0;
    if (x > width) x = width;
    
    const duration = audio.duration;
    if (duration) {
        const progressPercent = (x / width) * 100;
        audio.currentTime = (x / width) * duration;
        progress.style.width = `${progressPercent}%`;
        progressThumb.style.left = `${progressPercent}%`;
    }
}

function updateVolume(e) {
    const rect = volumeBar.getBoundingClientRect();
    const width = rect.width;
    let x = e.clientX - rect.left;
    
    // Boundary check
    if (x < 0) x = 0;
    if (x > width) x = width;
    
    const volumeLevel = x / width;
    audio.volume = volumeLevel;
    const volumePercent = volumeLevel * 100;
    volumeProgress.style.width = `${volumePercent}%`;
    volumeThumb.style.left = `${volumePercent}%`;
}

// Auto play next song
audio.addEventListener('ended', nextSong);

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === trackIndex) {
            li.classList.add('active');
        }
        li.innerHTML = `<i class="ph-fill ph-speaker-high"></i> <span>${track.title}</span>`;
        
        li.addEventListener('click', () => {
            trackIndex = index;
            loadTrack(trackIndex);
            playSong();
        });
        
        playlistEl.appendChild(li);
    });
}

function updatePlaylistActiveItem() {
    const items = document.querySelectorAll('.playlist-item');
    if (items.length > 0) {
        items.forEach(item => item.classList.remove('active'));
        items[trackIndex].classList.add('active');
    }
}

// Start
initPlayer();

// Protect against right-click downloads
glassPlayer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 10 Seconds Preview Limit (Discovery Mode)
audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= 10 && !audio.paused) {
        nextSong(); // Change to next track automatically
    }
});

// Purchase App Logic
const purchaseModal = document.getElementById('purchaseModal');
const closeApp = document.getElementById('closeApp');
const buyBtn = document.getElementById('buyBtn');
const paymentForm = document.getElementById('paymentForm');
const successMsg = document.getElementById('successMsg');
const modalTrackTitle = document.getElementById('modalTrackTitle');

function openPurchaseModal() {
    modalTrackTitle.textContent = tracks[trackIndex].title;
    purchaseModal.classList.add('active');
}

buyBtn.addEventListener('click', openPurchaseModal);

closeApp.addEventListener('click', () => {
    purchaseModal.classList.remove('active');
    successMsg.classList.remove('active');
    paymentForm.style.display = 'block';
});

// Stripe Payment Link Integration (No-Code / Free Hosting)
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // REMPLACEZ CE LIEN par votre lien de paiement Stripe créé dans votre tableau de bord Stripe
    const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/votre_lien_ici"; 

    const submitBtn = paymentForm.querySelector('.btn-purchase');
    submitBtn.innerHTML = '<i class="ph ph-spinner-gap fa-spin"></i> REDIRECTION...';
    submitBtn.disabled = true;

    // Redirection directe vers la page de paiement Stripe
    window.location.href = STRIPE_PAYMENT_LINK;
});
