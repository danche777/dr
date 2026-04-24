// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    addAccessibilityFeatures();
    addParticles();
    initializeGameModal();
});

// Функция инициализации галереи с улучшенной анимацией
function initializeGallery() {
    const videoCards = document.querySelectorAll('.video-card');
    
    // Добавляем плавное отображение карточек с масштабированием
    videoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.animation = `scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + index * 0.1}s forwards`;
    });

    // Добавляем обработчики для интерактивности
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.05)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
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

// Функция для подсчета видео
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

// Добавляем частицы (конфетти эффект)
function addParticles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== ИГРА ЗМЕЙКА =====
class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.reset();
        this.setupControls();
    }

    reset() {
        this.snake = [
            { x: Math.floor(this.tileCount / 2), y: Math.floor(this.tileCount / 2) }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.updateScore();
    }

    generateFood() {
        let food;
        let onSnake = true;
        while (onSnake) {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            onSnake = this.snake.some(segment => segment.x === food.x && segment.y === food.y);
        }
        return food;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameOver) {
                switch(e.key.toLowerCase()) {
                    case 'arrowup':
                    case 'w':
                        if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                        break;
                    case 'arrowdown':
                    case 's':
                        if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                        break;
                    case 'arrowleft':
                    case 'a':
                        if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                        break;
                    case 'arrowright':
                    case 'd':
                        if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                        break;
                }
            }
        });

        // Поддержка свайпов
        this.setupSwipeControls();
    }

    setupSwipeControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, false);

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Предотвращаем скроллинг
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        }, false);
    }

    handleSwipe(startX, startY, endX, endY) {
        if (this.gameOver) return;

        const diffX = endX - startX;
        const diffY = endY - startY;
        const minSwipeDistance = 30;

        // Определяем направление свайпа
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Горизонтальный свайп
            if (diffX > minSwipeDistance && this.direction.x === 0) {
                this.nextDirection = { x: 1, y: 0 }; // Вправо
            } else if (diffX < -minSwipeDistance && this.direction.x === 0) {
                this.nextDirection = { x: -1, y: 0 }; // Влево
            }
        } else {
            // Вертикальный свайп
            if (diffY > minSwipeDistance && this.direction.y === 0) {
                this.nextDirection = { x: 0, y: 1 }; // Вниз
            } else if (diffY < -minSwipeDistance && this.direction.y === 0) {
                this.nextDirection = { x: 0, y: -1 }; // Вверх
            }
        }
    }

    update() {
        if (this.gameOver) return;

        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Проверка столкновения со стеной
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.endGame();
            return;
        }

        // Проверка столкновения с собой
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        // Проверка еды
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateScore();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Фон
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Сетка
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.tileCount; i++) {
            const pos = i * this.gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }

        // Змейка
        this.ctx.fillStyle = '#00ff00';
        this.snake.forEach((segment, index) => {
            const padding = 2;
            this.ctx.fillRect(
                segment.x * this.gridSize + padding,
                segment.y * this.gridSize + padding,
                this.gridSize - padding * 2,
                this.gridSize - padding * 2
            );
            // Голова светлее
            if (index === 0) {
                this.ctx.fillStyle = '#00ff00';
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
                this.ctx.globalAlpha = 1;
                this.ctx.fillStyle = '#00ff00';
            }
        });

        // Еда
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x + 0.5) * this.gridSize,
            (this.food.y + 0.5) * this.gridSize,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Game Over сообщение
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Счет: ' + this.score, this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }

    endGame() {
        this.gameOver = true;
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    gameLoop() {
        this.update();
        this.draw();
    }
}

let snakeGame = null;
let gameLoopInterval = null;

// Инициализация модального окна
function initializeGameModal() {
    const modal = document.getElementById('gameModal');
    const openBtn = document.getElementById('openGameBtn');
    const closeBtn = document.getElementById('closeGameBtn');
    const restartBtn = document.getElementById('restartBtn');

    openBtn.addEventListener('click', () => {
        modal.classList.add('show');
        document.body.classList.add('no-scroll');
        startGame();
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.classList.remove('no-scroll');
        stopGame();
    });

    restartBtn.addEventListener('click', () => {
        snakeGame.reset();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.classList.remove('no-scroll');
            stopGame();
        }
    });
}

function startGame() {
    if (!snakeGame) {
        snakeGame = new SnakeGame('gameCanvas');
    }
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(() => {
        if (snakeGame) snakeGame.gameLoop();
    }, 100);
}

function stopGame() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null;
    }
}