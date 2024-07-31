// Get all navigation links
const navItems = document.querySelectorAll('.nav_item');

// Add click event listener to each link
navItems.forEach(item => {
  item.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior

    // Get the target section ID from the data-page attribute
    const targetSection = this.dataset.page;

    // Smooth scroll to the target section
    document.querySelector(targetSection).scrollIntoView({ behavior: 'smooth' });

    // Update active class (remove active class from other items)
    navItems.forEach(navItem => navItem.classList.remove('nav_active'));
    this.classList.add('nav_active'); 
  });
});