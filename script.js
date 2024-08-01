window.addEventListener("load", init);

var nav = document.getElementById("nav");
var isNavScrolled = false;

function init() {
    const navItems = document.querySelectorAll('.nav_item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.dataset.page;
            const targetSection = document.querySelector(targetPage);

            //移動到section
            targetSection.scrollIntoView({ behavior: 'smooth' });

            navItems.forEach(navItem => {
                navItem.classList.remove('nav_active');
            });
            item.classList.add('nav_active'); 

            // 觸發section title 的動畫
            const sectionTitle = targetSection.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.classList.remove('animated'); // 初始化
                void sectionTitle.offsetWidth; // 重新觸發
                sectionTitle.classList.add('animated');
            }
        });
    });
}
