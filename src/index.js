// change the opacity of background of #header when scrolling down
const header = document.getElementById('header');
const startFadingOffset = 10;
const sectionElementToNav = new Map();

let preventScrollEvent = false;

// setup links to nav bar items
document.querySelectorAll('.nav-bar ul li').forEach((li) => {
    const sectionId = li.querySelector('a')
        ?.getAttribute('href')
        ?.substring(1);
    if (!sectionId) return;

    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    sectionElementToNav.set(sectionElement, li);

    li.addEventListener('click', (e) => {
        e.preventDefault();

        switchActiveNavItem(li);
        
        preventScrollEvent = true;
        window.scrollTo({
            top: sectionElement.offsetTop - header.offsetHeight,
            behavior: 'smooth'
        });
        setTimeout(() => { preventScrollEvent = false; }, 800);
    });
})

let lastActiveNavItem = undefined;

const switchActiveNavItem = (currentActiveNavItem) => {
    if (currentActiveNavItem != lastActiveNavItem) {
        lastActiveNavItem?.classList.remove('active');
        currentActiveNavItem?.classList.add('active');
        lastActiveNavItem = currentActiveNavItem;
    }
}

const updateNavBar = (force) => {
    const scrollY = window.scrollY;
    const headerHeight = header.offsetHeight;
    const opacity = Math.max(0, Math.min(1, (scrollY - startFadingOffset) / (headerHeight - startFadingOffset)));
    header.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;

    if (force) preventScrollEvent = false;
    if (preventScrollEvent) return;

    let currentActiveNavItem = undefined;
    let isFirstSection = true;

    const scrollBottom = scrollY + window.innerHeight;

    for (const [section, li] of sectionElementToNav.entries()) {
        const top = section.offsetTop - header.offsetHeight;
        const bottom = top + section.offsetHeight;

        // at leaset cover the first section
        if (isFirstSection && scrollY <= top - 50) break;

        // bottom and top is integer but scrollY is not, add some flexible space
        if (scrollY <= bottom + 2 && scrollBottom >= top - 2) {
            currentActiveNavItem = li;
            if (scrollBottom >= bottom - 2) break;
        } 
        if (isFirstSection) isFirstSection = false;
    }

    switchActiveNavItem(currentActiveNavItem);
};

window.addEventListener('scroll', () => { updateNavBar(); });
updateNavBar();
