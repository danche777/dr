// 1. ПРОСТО ДОБАВЛЯЙ ВИДЕО СЮДА
const videoData = [
    { src: 'videos/video1.mp4', caption: 'Ион' },
    { src: 'videos/video2.mp4', caption: 'Наташа' },
    { src: 'videos/video3.mp4', caption: 'Ксюша' },
    { src: 'videos/video4.mp4', caption: 'Андрей' },
    { src: 'videos/video5.mp4', caption: 'Соня' },
    { src: 'videos/video6.mp4', caption: 'Челиксы' },
    { src: 'videos/video7.mp4', caption: 'Лев' },
    { src: 'videos/video8.mp4', caption: 'Лера' },
    { src: 'videos/video9.mp4', caption: 'Даня' },
    { src: 'videos/video10.mp4', caption: 'Ярик' },
    { src: 'videos/video11.mp4', caption: 'Ярик дубль 20' },
    { src: 'videos/video12.mp4', caption: 'артур' }
];

const book = document.querySelector("#book");

// 2. ГЕНЕРАЦИЯ СТРАНИЦ
function createBook() {
    // Обложка
    addPage(`
        <h1 class="handwritten" style="font-size: 2.5rem; margin-top: 40px;">Для тебя... ❤️</h1>
        <p class="handwritten" style="font-size: 1.2rem; margin-top: 20px;">Этот дневник хранит наши самые теплые поздравления. Листай!</p>
        <div style="font-size: 3rem; margin-top: 40px;">✨</div>
    `);

    // Нарезаем видео по 2 штуки на страницу
    for (let i = 0; i < videoData.length; i += 2) {
        let videoHtml = '';
        
        // Видео 1 на странице
        videoHtml += createVideoBlock(videoData[i]);

        // Видео 2 на странице (если оно есть)
        if (videoData[i + 1]) {
            videoHtml += createVideoBlock(videoData[i + 1]);
        } else {
            videoHtml += `<div class="handwritten" style="margin-top: 20px; opacity: 0.6;">Тут место для твоих мыслей... ✍️</div>`;
        }

        addPage(`<h2 class="handwritten" style="font-size: 1.5rem;">Поздравления</h2>${videoHtml}`);
    }

    // Финальная страница
    addPage(`
        <h2 class="handwritten" style="font-size: 2rem; margin-top: 40px;">С праздником!</h2>
        <p class="handwritten" style="font-size: 1.5rem;">Мы тебя любим!</p>
        <div class="heart">❤️</div>
    `);

    updateZIndexes();
}

function createVideoBlock(data) {
    return `
        <div class="polaroid-photo">
            <div class="video-container">
                <video class="my-video" playsinline controls>
                    <source src="${data.src}" type="video/mp4">
                </video>
            </div>
            <p class="handwritten">${data.caption}</p>
        </div>
    `;
}

function addPage(htmlContent) {
    const paper = document.createElement('div');
    paper.className = 'paper';
    paper.innerHTML = `
        <div class="front">
            <div class="content">${htmlContent}</div>
        </div>
        <div class="back"></div>
    `;
    book.appendChild(paper);
}

function updateZIndexes() {
    const papers = document.querySelectorAll(".paper");
    papers.forEach((paper, index) => {
        paper.style.zIndex = papers.length - index;
    });
}

// 3. ЛОГИКА ПЕРЕЛИСТЫВАНИЯ
let currentLocation = 1;

function goNextPage() {
    const papers = document.querySelectorAll(".paper");
    if (currentLocation <= papers.length) {
        pauseAllVideos();
        const paper = papers[currentLocation - 1];
        paper.classList.add("flipped");
        paper.style.zIndex = currentLocation;
        
        if (currentLocation === 1) {
            const shift = window.innerWidth < 480 ? "35%" : "50%";
            book.style.transform = `translateX(${shift})`;
        }
        if (currentLocation === papers.length) {
            book.style.transform = "translateX(100%)";
        }
        currentLocation++;
    }
}

function goPrevPage() {
    const papers = document.querySelectorAll(".paper");
    if (currentLocation > 1) {
        pauseAllVideos();
        const paper = papers[currentLocation - 2];
        paper.classList.remove("flipped");
        paper.style.zIndex = papers.length - (currentLocation - 2);

        if (currentLocation === 2) {
            book.style.transform = "translateX(0%)";
        } else if (currentLocation === papers.length + 1) {
            const shift = window.innerWidth < 480 ? "35%" : "50%";
            book.style.transform = `translateX(${shift})`;
        }
        currentLocation--;
    }
}

function pauseAllVideos() {
    document.querySelectorAll('.my-video').forEach(v => v.pause());
}

// Инициализация
createBook();

// Проверка на мобильное устройство и скрытие nav-controls
function hideMobileControls() {
    const navControls = document.querySelector(".nav-controls");
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        navControls.style.display = "none";
    } else {
        navControls.style.display = "flex";
    }
}

// Вызываем при загрузке
hideMobileControls();

// Вызываем при изменении размера окна (поворот экрана)
window.addEventListener("resize", hideMobileControls);

document.querySelector("#nextBtn").addEventListener("click", goNextPage);
document.querySelector("#prevBtn").addEventListener("click", goPrevPage);

// Свайпы
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) goNextPage();
    if (touchEndX - touchStartX > 50) goPrevPage();
});