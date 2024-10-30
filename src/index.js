// change the opacity of background of #header when scrolling down
const header = document.getElementById('header');
const startFadingOffset = 10;
const endFadingOffset = 160;
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
    const opacity = Math.max(0, Math.min(1, (scrollY - startFadingOffset) / (endFadingOffset - startFadingOffset)));
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

const talkChoicesElements = document.querySelectorAll('.talk-choices > li');
const talkContentElement = document.querySelector('.talk-content');
const talkInfoDict = {
    title: '.talk-title-text > div:first-child',
    speaker: '.speaker-text > div:nth-child(2)',
    abstract: '.talk-abstract-text > div:nth-child(2)',
    bio: '.speaker-bio-text > div:nth-child(2)',
}
const talkInfoElements = {};
for (const k in talkInfoDict) {
    const query = talkInfoDict[k];
    talkInfoElements[k] = talkContentElement.querySelector(`${query}`);
}

const talkInfoList = [
    {
        title: 'CoEdPilot: Recommending Code Edits with Learned Prior Edit Relevance, Project-wise Awareness, and Interactive Nature',
        speaker: 'Chenyan Liu',
        abstract: 'Incremental code edits are more frequent than generating new code in software projects. To automate this process, existing language model-based solutions focus primarily on generating edit solutions based on given location and relevant prior edits. However, editing tasks can be more complicated: It is non-trivial to infer the subsequent edit location, as the scope of edit ripple effect can be the whole project. Moreover, editing sessions may contain multiple (ir)relevant edits. In this talk, I will share our work CoEdPilot, a LLM-driven framework for code evolution assistance. CoEdPilot orchestrates a set of neural Transformers, for discriminating relevant edits, monitoring the ripple effects of edits, exploring their interactive natures and generating edit solution. We also implement CoEdPilot as a VS Code extension for user-friendly interaction.',
        bio: 'Chenyan Liu is currently a PhD student at School of Computing, National University of Singapore. He is supervised by Dr. Yun LIN, Dr. Jin Song DONG and Dr. ZhiYong HUANG. He received his Bachelor’s degree at Huazhong University of Science and Technology in 2021 and Master’s degree at National University of Singapore in 2023. His research focuses on the design and evaluation of code evolution systems.'
    },
    {
        title: 'Generating Domain-Specific Tests via LLM-based Conversation with Code Repository',
        speaker: 'Binhang Qi',
        abstract: `Software testing has been a long-standing challenge in the software engineering community. While automatic test generators like EvoSuite (focused on branch coverage) and LLM-based solutions (focused on code generation) show promising results, they often fall short when it comes to incorporating project-specific domain knowledge. This gap makes the generated tests less practical and harder to pass code review or be integrated into a software product.
In this talk, I will share our work DTester, an LLM-based test generator designed to generate practical project-specific tests. First, our empirical study reveals that sophisticated software projects contain abundant code assets valuable for guiding the generation of new tests. Based on the empirical observation, DTester is designed to retrieve a referable test and adapt it to the target test through LLM-based conversation with the project, thus capturing crucial domain-specific information. We also implement DTester as a VSCode extension to facilitate the practical use of test generation.'`,
        bio: 'Binhang Qi is currently a Postdoctoral Researcher at School of Computing, National University of Singapore, working with Professors Jin-Song Dong and Yun Lin. He received PhD degree from School of Computer Science and Engineering at Beihang University (BUAA) in 2024. His main research interests include DNN modularization and test generation, with his work published in ASE, ICSE, FSE, and TOSEM. He received the ACM SIGSOFT Distinguished Paper Award at ICSE 2024.'
    }
]

const sleep = async (ms) => {
    const p = new Promise((res) => {
        setTimeout(res, ms);
    });
    await p;
}

const switchToTalk = async (num, doScroll) => {
    talkChoicesElements.forEach((element, i) => {
        if (i == num) {
            element.classList.remove('outline');
        } else {
            element.classList.add('outline');
        }
    });

    talkContentElement.classList.add('fading');
    await sleep(200);
    const talkInfo = talkInfoList[num];
    if (talkInfo) {
        for (const k in talkInfoElements) {
            talkInfoElements[k].innerText = talkInfo[k];
        }
    }
    talkContentElement.classList.remove('fading');
}

talkChoicesElements.forEach((element, i) => {
    element.addEventListener('click', () => {
        switchToTalk(i, true);
    });
});

switchToTalk(0);

/* title scaling */

const titleScalingUntilScrollY = 160;
const titleElement = document.querySelector('.title-text');
const titleDescElement = document.querySelector('.title-desc');

const scaleTitle = () => {
    const scrollY = window.scrollY;
    const scaleRatio = 1.1 - 0.1 * Math.min(1, scrollY / titleScalingUntilScrollY);
    const translateYPixel = Math.min(titleScalingUntilScrollY, scrollY) / 2;
    titleElement.style.transform = `scale(${scaleRatio}) translateY(${translateYPixel}px)`;
    titleDescElement.style.transform = `scale(${scaleRatio}) translateY(${translateYPixel}px)`;
};

window.addEventListener('scroll', () => { scaleTitle(); });

document.querySelectorAll('.speaker-name > a').forEach((a) => {
    const homeIcon = a.querySelector('span');
    a.addEventListener('mouseover', () => {
        homeIcon.classList.add('active');
    });
    a.addEventListener('mouseleave', () => {
        homeIcon.classList.remove('active');
    });
});
