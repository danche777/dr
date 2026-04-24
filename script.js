// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    addAccessibilityFeatures();
});

// Функция инициализации галереи
function initializeGallery() {
    const videoCards = document.querySelectorAll('.video-card');
    
    // Добавляем плавное отображение карточек
    videoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.6s ease-out ${0.5 + index * 0.1}s forwards`;
    });

    // Добавляем обработчики для интерактивности
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Можно добавить модальное окно для полноэкранного просмотра
            console.log('Видео карточка нажата');
        });
    });
}

// Функция для улучшения доступности
function addAccessibilityFeatures() {
    // Добавляем focus styles для клавиатурной навигации
    document.querySelectorAll('.video-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    });
}

// Функция для подсчета видео (если нужна динамическая подсчет)
function updateVideoCount() {
    const videoCount = document.querySelectorAll('.video-card').length;
    const countElement = document.getElementById('videoCount');
    if (countElement) {
        const plural = videoCount % 10 === 1 && videoCount % 100 !== 11 ? 'видео' : 'видео';
        countElement.textContent = `${videoCount} ${plural}`;
    }
}

// Вызываем обновление счетчика при загрузке
updateVideoCount();

// Поддержка dark mode (опционально)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Загружаем сохраненное состояние dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    addAccessibilityFeatures();
});

// Функция инициализации галереи
function initializeGallery() {
    const videoCards = document.querySelectorAll('.video-card');
    
    // Добавляем плавное отображение карточек
    videoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.6s ease-out ${0.5 + index * 0.1}s forwards`;
    });

    // Добавляем обработчики для интерактивности
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // Можно добавить модальное окно для полноэкранного просмотра
            console.log('Видео карточка нажата');
        });
    });
}

// Функция для улучшения доступности
function addAccessibilityFeatures() {
    // Добавляем focus styles для клавиатурной навигации
    document.querySelectorAll('.video-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    });
}

// Функция для подсчета видео (если нужна динамическая подсчет)
function updateVideoCount() {
    const videoCount = document.querySelectorAll('.video-card').length;
    const countElement = document.getElementById('videoCount');
    if (countElement) {
        const plural = videoCount % 10 === 1 && videoCount % 100 !== 11 ? 'видео' : 'видео';
        countElement.textContent = `${videoCount} ${plural}`;
    }
}

// Вызываем обновление счетчика при загрузке
updateVideoCount();

// Поддержка dark mode (опционально)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Загружаем сохраненное состояние dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}