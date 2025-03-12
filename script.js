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

        // Проверяем, клик был внутри dropdown
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
});
