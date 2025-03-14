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
    
    const track = document.querySelector('.reviews__slider__track');
    const pointsContainer = document.querySelector('.reviews__slider__points');
    const items = Array.from(document.querySelectorAll('.reviews__slider__item'));
    
    const itemsPerPage = 4; 
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentIndex = 0; 
    let isAnimating = false; 
    let autoSlideTimer; 
    
    
    pointsContainer.innerHTML = ''; 
    
    for (let i = 0; i < totalPages; i++) {
        const point = document.createElement('div');
        point.classList.add('review__slider__point');
        if (i === 0) point.classList.add('active');
        point.dataset.index = i;
        pointsContainer.appendChild(point);
    }
    
   
    const points = document.querySelectorAll('.review__slider__point');
    
    
    function updatePoints() {
        points.forEach(p => p.classList.remove('active'));
        points[currentIndex].classList.add('active');
    }
    
    
    points.forEach((point, index) => {
        point.addEventListener('click', () => {
            if (index !== currentIndex && !isAnimating) {
                moveSlider(index);
                resetAutoSlide(); 
            }
        });
    });
    
    function moveSlider(targetIndex) {
        if (isAnimating) return;
        isAnimating = true;
    
        const steps = targetIndex - currentIndex; 
        const shift = steps * -100; 
    
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(${shift}%)`;
    
        setTimeout(() => {
            track.style.transition = 'none';
    
            if (steps > 0) {
               
                for (let i = 0; i < steps * itemsPerPage; i++) {
                    track.appendChild(track.firstElementChild);
                }
            } else {
               
                for (let i = 0; i < Math.abs(steps) * itemsPerPage; i++) {
                    track.prepend(track.lastElementChild);
                }
            }
    
           
            track.style.transform = 'translateX(0%)';
    
            currentIndex = targetIndex;
            updatePoints();
            isAnimating = false;
        }, 500); 
    }

    function autoSlide() {
        autoSlideTimer = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalPages; 
            moveSlider(nextIndex);
        }, 5000); 
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideTimer); 
        autoSlide(); //
    }
    
    
    updatePoints();
    autoSlide();

});
