document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            menuItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category').split(' ');

                if (category === 'all' || itemCategories.includes(category)) {
                    item.classList.remove('hidden');
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
});


