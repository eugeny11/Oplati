document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
       
        const selected = event.target.closest(".calculator__selected");

        if (!selected) {
            return; 
        }

        const dropdown = selected.querySelector(".calculator__dropdown");
        const selectedText = selected.querySelector(".calculator__selected-text");
        const selectedFlag = selected.querySelector(".calculator__selected-flag");

        if (!dropdown) {
            return;
        }

        if (event.target.closest(".calculator__selected") && !event.target.closest(".calculator__dropdown")) {
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
            return;
        }

        if (dropdown.contains(event.target)) {
           
            const item = event.target.closest(".calculator__dropdown__item"); 
            if (item) {
               
                const currency = item.getAttribute("data-currency");
                const flagImg = item.querySelector("img");

                if (currency && flagImg) {
                    selectedText.textContent = currency;
                    selectedFlag.src = flagImg.src;
                    console.log(`Выбрана валюта: ${currency}`);
                }

                dropdown.style.display = "none"; 
                return;
            } 
        }
        dropdown.style.display = "none";
        
    });

    document.addEventListener("click", function (event) {
        document.querySelectorAll(".calculator__dropdown").forEach(dropdown => {
            if (!dropdown.closest(".calculator__selected").contains(event.target)) {
                dropdown.style.display = "none";
            }
        });
    });

    document.querySelectorAll(".questions__wrapper").forEach(wrapper => {
        const item = wrapper.querySelector(".questions__item");
        const content = wrapper.querySelector(".questions__content");
    
        item.addEventListener("click", () => {
            const isActive = wrapper.classList.contains("active");
    
            
            document.querySelectorAll(".questions__wrapper").forEach(w => {
                w.classList.remove("active");
                w.querySelector(".questions__item").classList.remove("active");
                w.querySelector(".questions__content").classList.remove("open");
                w.querySelector(".questions__content").style.maxHeight = null;
            });
            
            if (isActive) {
                wrapper.classList.remove("active");
                item.classList.remove("active");
                content.classList.remove("open");
                content.style.maxHeight = null;
            } else {
                wrapper.classList.add("active");
                item.classList.add("active");
                content.classList.add("open");
            }
        });
    });

 /* Reviews Slider */
const track = document.querySelector('.reviews__slider__track');
const pointsContainer = document.querySelector('.reviews__slider__points');
let items = Array.from(document.querySelectorAll('.reviews__slider__item'));

let itemsPerPage = getItemsPerPage();
let totalPages = getTotalPages();
let currentIndex = 0;
let isAnimating = false;
let autoSlideTimer;

// ✅ Ограничение количества отзывов на мобилке (≤530px)
function limitItemsForMobile() {
    if (window.innerWidth <= 530) {
        items = items.slice(0, 4); // Оставляем только первые 4 элемента
    } else {
        items = Array.from(document.querySelectorAll('.reviews__slider__item')); // Восстанавливаем полный список
    }
}

// Функция для получения количества элементов на экране
function getItemsPerPage() {
    if (window.innerWidth <= 530) return 1;
    if (window.innerWidth <= 740) return 2;
    return 4;
}

// Количество страниц (учитывает ограничение на мобилке)
function getTotalPages() {
    return Math.ceil(items.length / itemsPerPage);
}

let points = document.querySelectorAll('.review__slider__point');

// ✅ Пересоздаём точки, соответствующие 4 отзывам на мобилке
function generatePoints() {
    pointsContainer.innerHTML = ''; 
    totalPages = getTotalPages(); 

    for (let i = 0; i < totalPages; i++) {
        const point = document.createElement('div');
        point.classList.add('review__slider__point');
        if (i === 0) point.classList.add('active');
        point.dataset.index = i;
        pointsContainer.appendChild(point);
    }

    points = document.querySelectorAll('.review__slider__point'); 
    addPointListeners(); 
}

// Обновляем активную точку
function updatePoints() {
    points.forEach(p => p.classList.remove('active'));
    points[currentIndex % totalPages].classList.add('active');
}

// Функция обработчиков событий для точек
function addPointListeners() {
    points.forEach((point, index) => {
        point.addEventListener('click', () => {
            if (index !== currentIndex && !isAnimating) {
                moveSlider(index);
                resetAutoSlide();
            }
        });
    });
}

// ✅ Обновляем количество элементов и точек при изменении экрана
function updateItemsPerPage() {
    limitItemsForMobile(); // Ограничиваем количество отзывов на мобилке
    itemsPerPage = getItemsPerPage();
    totalPages = getTotalPages();
    generatePoints();
    updatePoints();
}

generatePoints();


// ✅ Функция для бесконечной прокрутки с учётом ограничений
function moveSlider(targetIndex) {
    if (isAnimating) return;
    isAnimating = true;

    const steps = targetIndex - currentIndex;
    const shift = steps * -100;

    track.style.transition = 'transform 0.6s ease-in-out';
    track.style.transform = `translateX(${shift}%)`;

    setTimeout(() => {
        track.style.transition = 'none';

        if (targetIndex >= totalPages) {
            for (let i = 0; i < itemsPerPage; i++) {
                track.appendChild(track.firstElementChild);
            }
            track.style.transform = 'translateX(0%)';
            currentIndex = 0;
        } else if (targetIndex < 0) {
            for (let i = 0; i < itemsPerPage; i++) {
                track.prepend(track.lastElementChild);
            }
            track.style.transform = 'translateX(0%)';
            currentIndex = totalPages - 1;
        } else {
            if (steps > 0) {
                for (let i = 0; i < steps * itemsPerPage; i++) {
                    track.appendChild(track.firstElementChild);
                }
            } else if (steps < 0) {
                for (let i = 0; i < Math.abs(steps) * itemsPerPage; i++) {
                    track.prepend(track.lastElementChild);
                }
            }
            track.style.transform = 'translateX(0%)';
            currentIndex = targetIndex;
        }

        updatePoints();
        isAnimating = false;
    }, 600);
}

// Автопрокрутка
function autoSlide() {
    autoSlideTimer = setInterval(() => {
        moveSlider(currentIndex + 1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlide();
}

// ✅ Свайпы остаются, но теперь управляют только 4 отзывами на мобилке
let startX = 0;
let endX = 0;

track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

track.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
});

track.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) swipeNext();
        else swipePrev();
    }
});

function swipeNext() {
    moveSlider(currentIndex + 1);
    resetAutoSlide();
}

function swipePrev() {
    moveSlider(currentIndex - 1);
    resetAutoSlide();
}

// ✅ Следим за изменением экрана
window.addEventListener('resize', updateItemsPerPage);

// ✅ Запуск
updateItemsPerPage();
updatePoints();
autoSlide();


/* Benefits Slider */

const benefitsItems = document.querySelectorAll(".benefits__item");
const dots = document.querySelectorAll(".benefits__dot__item");
const benefitsContainer = document.querySelector(".hero__benefits"); // Контейнер для свайпа
let currentBeneIndex = 0;
let autoBeneTimer;
let isBeneAnimating = false;

function isMobile() {
    return window.innerWidth <= 1050;
}

function showBeneSlide(index) {
    if (!isMobile() || isBeneAnimating) return;
    isBeneAnimating = true;

    let currentItem = benefitsItems[currentBeneIndex];
    let nextItem = benefitsItems[index];

    let direction = index > currentBeneIndex ? "next" : "prev";

    currentItem.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
    currentItem.style.transform = direction === "next" ? "translateX(-100%) translateY(30px)" : "translateX(100%) translateY(30px)";
    currentItem.style.opacity = "0";

    setTimeout(() => {
        currentItem.style.display = "none";

        nextItem.style.display = "flex";
        nextItem.style.opacity = "0";
        nextItem.style.transform = direction === "next" ? "translateX(100%) translateY(30px)" : "translateX(-100%) translateY(30px)";

        setTimeout(() => {
            nextItem.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
            nextItem.style.transform = "translateX(0) translateY(30px)";
            nextItem.style.opacity = "1";
            currentBeneIndex = index;
            updateBeneDots();
            isBeneAnimating = false;
        }, 50);
    }, 300);
}

function updateBeneDots() {
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentBeneIndex].classList.add("active");
}

function nextBeneSlide() {
    let nextIndex = (currentBeneIndex + 1) % benefitsItems.length;
    showBeneSlide(nextIndex);
}

function prevBeneSlide() {
    let prevIndex = currentBeneIndex - 1;
    if (prevIndex < 0) prevIndex = benefitsItems.length - 1;
    showBeneSlide(prevIndex);
}

function autoBeneSlide() {
    if (!isMobile()) return;
    autoBeneTimer = setInterval(nextBeneSlide, 3000);
}

function resetAutoBeneSlide() {
    clearInterval(autoBeneTimer);
    autoBeneSlide();
}

// Добавляем обработчик кликов по точкам
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showBeneSlide(index);
        resetAutoBeneSlide();
    });
});

// **Добавляем поддержку свайпов (не дублируем переменные)**
benefitsContainer.addEventListener("touchstart", (e) => {
    if (!isMobile()) return;
    startX = e.touches[0].clientX;
});

benefitsContainer.addEventListener("touchmove", (e) => {
    if (!isMobile()) return;
    endX = e.touches[0].clientX;
});

benefitsContainer.addEventListener("touchend", () => {
    if (!isMobile()) return;
    let diff = startX - endX;

    if (Math.abs(diff) > 50) { 
        if (diff > 0) {
            nextBeneSlide(); // Свайп влево (следующий)
        } else {
            prevBeneSlide(); // Свайп вправо (предыдущий)
        }
        resetAutoBeneSlide();
    }
});

// Скрываем все, кроме первого
benefitsItems.forEach((item, index) => {
    if (index !== 0) {
        item.style.display = "none";
        item.style.opacity = "0";
    } else {
        item.style.display = "flex";
        item.style.opacity = "1";
    }
    item.style.transform = "translateY(30px)";
});

// Запускаем автопрокрутку
autoBeneSlide();

// Перезапуск слайдера при изменении размера экрана
window.addEventListener("resize", () => {
    if (!isMobile()) {
        clearInterval(autoBeneTimer);
    } else {
        resetAutoBeneSlide();
    }
});

/* Stages Slider */

const stagesItems = document.querySelectorAll(".stages__content__item");
const stagesDots = document.querySelectorAll(".content__dot");

let currentStageIndex = 0;
let autoStageTimer;
let isStageAnimating = false;

function showStageSlide(index) {
    if (isStageAnimating) return;
    isStageAnimating = true;

    let currentItem = stagesItems[currentStageIndex];
    let nextItem = stagesItems[index];

    // Анимация исчезновения
    currentItem.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
    currentItem.style.transform = "translateX(-100%)";
    currentItem.style.opacity = "0";

    setTimeout(() => {
        currentItem.style.display = "none";

        // Показываем новый этап
        nextItem.style.display = "flex";
        nextItem.style.opacity = "0";
        nextItem.style.transform = "translateX(100%)";

        setTimeout(() => {
            nextItem.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
            nextItem.style.transform = "translateX(0)";
            nextItem.style.opacity = "1";

            currentStageIndex = index;
            updateStageDots();
            isStageAnimating = false;
        }, 50);
    }, 300);
}

// Обновляем активные точки
function updateStageDots() {
    stagesDots.forEach(dot => dot.classList.remove("active"));
    stagesDots[currentStageIndex].classList.add("active");
}

// Переключение на следующий этап
function nextStageSlide() {
    let nextIndex = (currentStageIndex + 1) % stagesItems.length;
    showStageSlide(nextIndex);
}

// Автоматическая прокрутка
function autoStageSlide() {
    autoStageTimer = setInterval(nextStageSlide, 4000);
}

// Сброс таймера автопрокрутки
function resetAutoStageSlide() {
    clearInterval(autoStageTimer);
    autoStageSlide();
}

// Обработчики кликов по точкам
stagesDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showStageSlide(index);
        resetAutoStageSlide();
    });
});

document.querySelector(".stages__content").addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

document.querySelector(".stages__content").addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
});

document.querySelector(".stages__content").addEventListener("touchend", () => {
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextStageSlide();
        } else {
            let prevIndex = currentStageIndex - 1;
            if (prevIndex < 0) prevIndex = stagesItems.length - 1;
            showStageSlide(prevIndex);
        }
        resetAutoStageSlide();
    }
});

// Скрываем все, кроме первого
stagesItems.forEach((item, index) => {
    if (index !== 0) {
        item.style.display = "none";
        item.style.opacity = "0";
    } else {
        item.style.display = "flex";
        item.style.opacity = "1";
    }
});

// Запускаем автопрокрутку
autoStageSlide();

    
    /*Popups */

    document.getElementById("createRequest").addEventListener("click", function() {
        document.getElementById("requestPopup").style.display = "flex";
    });

    document.getElementById("createRequestMob").addEventListener("click", function() {
        document.getElementById("requestPopup").style.display = "flex";
    });
    
    document.getElementById("requestClose").addEventListener("click", function() {
        document.getElementById("requestPopup").style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target === document.getElementById("requestPopup")) {
            document.getElementById("requestPopup").style.display = "none";
        }
    });

    document.getElementById("calculateComission").addEventListener("click", function() {
        document.getElementById("comissionPopup").style.display = "flex";
    });
    
    document.getElementById("comissionClose").addEventListener("click", function() {
        document.getElementById("comissionPopup").style.display = "none";
    });
    
    window.addEventListener("click", function(event) {
        if (event.target === document.getElementById("comissionPopup")) {
            document.getElementById("comissionPopup").style.display = "none";
        }
    });

    let headerUpper = document.querySelector(".header__upper");
    let headerBottom = document.querySelector(".header__bottom");
    let headerUpperHeight = headerUpper.offsetHeight;

    window.addEventListener("scroll", function() {
        if (window.scrollY > headerUpperHeight) {
            headerBottom.classList.add("fixed");
        } else {
            headerBottom.classList.remove("fixed");
        }
    });

    const socialBlocks = document.querySelectorAll(".telegram__social");
    
        socialBlocks.forEach(block => {
            console.log(block)
            const icon = block.querySelector(".telegram__icon");
    
            block.addEventListener("mouseenter", function () {
                icon.src = "images/icons/telegram__green.svg"; 
                
            });
    
            block.addEventListener("mouseleave", function () {
                icon.src = "images/icons/telegram.svg"; 
            });
        });
        

    const workSocial = document.querySelector('.work__social');
    const workIcon = document.querySelector('.work__social__icon');

    workSocial.addEventListener('mouseenter', function(){
        workIcon.src = "images/icons/telegram__green.svg"; ;
    });
    
    workSocial.addEventListener('mouseleave',function(){
        workIcon.src = "images/icons/telegram.svg"; 
    })

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.header__mob');

    hamburger.addEventListener('click',function(){
        this.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    })

    const servicesIcons = document.querySelector('.services__icons');
    const servicesMobileButton = document.querySelector('.services__mobile__button')

    servicesMobileButton.addEventListener('click',function(){
        servicesIcons.classList.toggle('open')
    })

    const questions = document.querySelector('.questions')
    const questionsMobileButton = document.querySelector('.questions__mobile__button')

    questionsMobileButton.addEventListener('click',function(){
        questions.classList.toggle('open')
    })

});
