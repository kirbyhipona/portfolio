document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       STATE
    ========================= */
    let isDragging = false;
    let modalData = [];

    /* =========================
       SWIPERS
    ========================= */
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 3,
        spaceBetween: 10,
        grabCursor: true,
        autoplay: {
            delay: 10000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: false,
        },
        on: {
            touchStart: () => (isDragging = false),
            touchMove: () => (isDragging = true),
        },
        breakpoints: {
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
        },
    });

    const swiperThumbs = new Swiper(".myCertSwiper2", {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });

    const swiperCert = new Swiper(".myCertSwiper", {
        loop: true,
        spaceBetween: 10,
        autoplay: {
            delay: 10000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: swiperThumbs,
        },
        breakpoints: {
            1024: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
        },
    });

    /* =========================
       FETCH DATA (ONCE)
    ========================= */
    fetch("assets/data/projects-v2.json")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load projects.json");
            return res.json();
        })
        .then(data => {
            modalData = data;
            initProjectClicks();
        })
        .catch(err => console.error(err));

    /* =========================
       EVENT DELEGATION
    ========================= */
    function initProjectClicks() {
        document.addEventListener("click", (e) => {
            const target = e.target.closest(
                ".swiper-content[data-id], .showcase[data-id]"
            );

            if (!target) return;

            // Prevent click after swipe
            if (isDragging) {
                isDragging = false;
                return;
            }

            const id = target.getAttribute("data-id");
            const project = modalData.find(item => String(item.id) === String(id));
            if (!project) return;

            updateModal(project);
        });
    }

    /* =========================
       MODAL UPDATE
    ========================= */
    function updateModal(project) {
        const modalTitle = document.getElementById("modal-title");
        const modalImg = document.getElementById("modal-img");
        const modalContent = document.getElementById("modal-content");
        const techContainer = document.getElementById("modal-tech");

        modalTitle.innerHTML = project.title || "";

        if (project.link?.trim()) {
            modalTitle.innerHTML += `
                <a href="${project.link}" target="_blank" rel="noopener">
                    <i class="fas fa-link"></i>
                </a>
            `;
        }

        modalImg.src = project.image || "";
        modalImg.alt = project.title || "";
        modalContent.textContent = project.content || "";

        techContainer.innerHTML = "";
        if (Array.isArray(project.technologies)) {
            project.technologies.forEach(tech => {
                const img = document.createElement("img");
                img.src = `assets/img/${tech}`;
                img.alt = tech;
                img.title = tech;
                img.className = "tech-icon";
                techContainer.appendChild(img);
            });
        }
    }

    /* =========================
       HEADER SCROLL EFFECT
    ========================= */
    const header = document.querySelector("header");
    let lastScrollY = 0;
    let ticking = false;
    let isScrolled = false;

    const ENTER = 60;
    const LEAVE = 45;

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                if (!isScrolled && lastScrollY > ENTER) {
                    header.classList.add("scrolled");
                    isScrolled = true;
                } else if (isScrolled && lastScrollY < LEAVE) {
                    header.classList.remove("scrolled");
                    isScrolled = false;
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    /* =========================
       SEE MORE TOGGLE
    ========================= */
    document.querySelectorAll(".see-more-link").forEach(link => {
        link.addEventListener("click", () => {
            const summary = link.closest("small")?.querySelector(".job-summary");
            if (!summary) return;

            summary.classList.toggle("expanded");
            link.textContent = summary.classList.contains("expanded")
                ? "See less"
                : "See more";
        });
    });

    /* =========================
       TYPED.JS
    ========================= */
    function initTyped(selector) {
        const el = document.querySelector(selector);
        if (!el) return;

        const strings = el.getAttribute("data-typed-items")?.split(",");
        if (!strings) return;

        new Typed(selector, {
            strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
        });
    }

    initTyped(".typed");
    initTyped(".typed-mobile");
});
