// Animation d'entrée
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        document.body.classList.add('loaded');
    }, 1000);
});

// Navigation sections
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');
}

// Carousel categories
let currentCategory = 0;
const totalCategories = 4;

function showCategory(index) {
    // Masquer tous les panneaux
    document.querySelectorAll('.category-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Afficher le panneau sélectionné
    document.getElementById(`category-${index}`).style.display = 'flex';
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.nav-item')[index].classList.add('active');
    
    currentCategory = index;
}

// Smooth scrolling pour les carousels
document.querySelectorAll('.certificates-carousel').forEach(carousel => {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
});

// Parallax effect pour les panneaux
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const panels = document.querySelectorAll('.category-panel');
    
    panels.forEach((panel, index) => {
        const rate = scrolled * -0.1;
        panel.style.transform = `translateY(${rate}px)`;
    });
});

// Intersection Observer pour les animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments animés
document.querySelectorAll('.certificat-card, .bulletin-item, .certificat-scolaire, .document-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Gestion tactile pour mobile - Désactivé pour éviter les conflits avec le scroll
// La navigation se fait uniquement via les boutons sur mobile/tablette
let touchStartX = 0;
let touchEndX = 0;
let isMobile = window.innerWidth <= 768;

function handleSwipe() {
    // Désactiver le swipe sur mobile et tablette pour éviter les conflits
    if (isMobile) return;
    
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next category
        currentCategory = (currentCategory + 1) % totalCategories;
        showCategory(currentCategory);
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous category
        currentCategory = (currentCategory - 1 + totalCategories) % totalCategories;
        showCategory(currentCategory);
    }
}

// Mettre à jour isMobile lors du redimensionnement
window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
});

document.addEventListener('touchstart', e => {
    if (!isMobile) {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', e => {
    if (!isMobile) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        currentCategory = (currentCategory + 1) % totalCategories;
        showCategory(currentCategory);
    } else if (e.key === 'ArrowLeft') {
        currentCategory = (currentCategory - 1 + totalCategories) % totalCategories;
        showCategory(currentCategory);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showCategory(0);
    
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.certificat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
























// Ajouter cette fonction à la fin du fichier script.js
function initShowMoreSections() {
    // Configuration pour chaque section
    const sections = [
        {
            container: '.bulletins-panel',
            items: '.bulletin-item',
            limit: 3,
            buttonText: 'Bulletins'
        },
        {
            container: '.certificats-scolaires',
            items: '.certificat-scolaire',
            limit: 4,
            buttonText: 'Certificats'
        },
        {
            container: '.documents-annexes',
            items: '.document-item',
            limit: 3,
            buttonText: 'Documents'
        }
    ];

    sections.forEach(section => {
        const container = document.querySelector(section.container);
        if (!container) return;

        const items = container.querySelectorAll(section.items);
        if (items.length <= section.limit) return;

        // Cacher les éléments supplémentaires
        for (let i = section.limit; i < items.length; i++) {
            items[i].classList.add('hidden');
        }

        // Créer le bouton "Voir plus"
        const seeMoreContainer = document.createElement('div');
        seeMoreContainer.className = 'see-more-container';
        
        const seeMoreBtn = document.createElement('button');
        seeMoreBtn.className = 'see-more-btn';
        seeMoreBtn.innerHTML = `
            <span>Voir plus de ${section.buttonText}</span>
            <ion-icon name="chevron-down-outline"></ion-icon>
        `;

        seeMoreContainer.appendChild(seeMoreBtn);
        container.appendChild(seeMoreContainer);

        // Gérer le clic sur le bouton
        seeMoreBtn.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            
            if (isExpanded) {
                // Replier
                for (let i = section.limit; i < items.length; i++) {
                    items[i].classList.add('hidden');
                    items[i].classList.remove('show-more-enter');
                }
                this.classList.remove('expanded');
                this.querySelector('span').textContent = `Voir plus de ${section.buttonText}`;
            } else {
                // Déplier
                this.classList.add('expanded');
                this.querySelector('span').textContent = `Voir moins de ${section.buttonText}`;
                
                for (let i = section.limit; i < items.length; i++) {
                    items[i].classList.remove('hidden');
                    setTimeout(() => {
                        items[i].classList.add('show-more-enter');
                    }, 50 * (i - section.limit));
                }
            }
        });
    });
}

// Appeler cette fonction après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // ... code existant ...
    initShowMoreSections();
});