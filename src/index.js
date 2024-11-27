/*
    nav bar control and links
*/

// change the opacity of background of nav bar when scrolling down
const header = document.getElementById('header');
const startFadingOffset = 50;
const endFadingOffset = 51;
const sectionElementToNav = new Map();

let preventScrollEvent = false;
const ignoringHeaderScrollTo = (element) => {
    window.scrollTo({
        top: element.offsetTop - header.offsetHeight,
        behavior: 'smooth'
    });
}

// setup links to nav bar items
// forward links:
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
        ignoringHeaderScrollTo(sectionElement);
        
        setTimeout(() => { preventScrollEvent = false; }, 800);
    });
})

// backward links (scrolling)
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

/*
    interaction of talk number selector and information
*/

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
        title: 'Evaluating and Harnessing Large Language Models for Automated Penetration Testing',
        speaker: 'Tianwei Zhang',
        abstract: 'Penetration testing, a crucial industrial practice for ensuring system security, has traditionally resisted automation due to the extensive expertise required by human professionals. Large Language Models (LLMs) have shown significant advancements in various domains, and their emergent abilities suggest their potential to revolutionize industries. In this work, we establish a comprehensive benchmark using real-world penetration testing targets and further use it to explore the capabilities of LLMs in this domain. Our findings reveal that while LLMs demonstrate proficiency in specific sub-tasks within the penetration testing process, such as using testing tools, interpreting outputs, and proposing subsequent actions, they also encounter difficulties maintaining a whole context of the overall testing scenario. Based on these insights, we introduce PENTESTGPT, an LLM-empowered automated penetration testing framework that leverages the abundant domain knowledge inherent in LLMs. PENTESTGPT is meticulously designed with three self-interacting modules, each addressing individual sub-tasks of penetration testing, to mitigate the challenges related to context loss. It not only outperforms LLMs among the benchmark targets, but also proves effective in tackling real-world penetration testing targets and CTF challenges. Having been open-sourced on GitHub, PENTESTGPT has garnered over 6,500 stars in 12 months and fostered active community engagement, attesting to its value and impact in both the academic and industrial spheres.',
        bio: `Dr. Tianwei Zhang is currently an associate professor at College of Computing and Data Science, Nanyang Technological University, Singapore. He received his Bachelor's degree at Peking University in 2011, and Ph.D degree at Princeton University in 2017. His research focuses on building efficient and trustworthy computer systems. He has been involved in the organization committee of numerous technical conferences, including serving as the general chair of KSEM'22. He serves on the editorial board of IEEE Transactions on Circuits and Systems for Video Technology (TCSVT) since 2021, and receives the best editor award in 2023. He has published more than 150 papers in top-tier security, AI, and system conferences and journals. He has received several research awards, including Distinguished Paper Award @ ASPLOS'23, Distinguished Paper Award @ ACL'24, Distinguished Artifact Award @ Usenix Security'24, Distinguished Artifact Award @ CCS'24. `
    },
    {
        title: 'Automated Generation of Formal Program Specifications via Large Language Models',
        speaker: 'Yi Li',
        abstract: 'In the software development process, formal program specifications play a crucial role in various stages, including requirement analysis, software testing, and verification. However, manually crafting program specifications is rather difficult, making the job time-consuming and labour-intensive. To tackle this challenge, we introduce SpecGen, a novel technique for formal program specification generation based on Large Language Models (LLMs). Our key insight is to overcome the limitations of existing methods by leveraging the code comprehension capability of LLMs. The process of SpecGen consists of two phases. The first phase employs a conversational approach that guides the LLM to generate appropriate specifications for a given program, aiming to utilize the ability of LLM to generate high-quality specifications. The second phase, designed for where the LLM fails to generate correct specifications, applies four mutation operators to the model-generated specifications and selects verifiable specifications from the mutated ones through a novel heuristic selection strategy by assigning different weights of variants in an efficient manner. We evaluate SpecGen on two datasets, including the SV-COMP Java category benchmark and a manually constructed dataset containing 120 programs. Experimental results demonstrate that SpecGen succeeds in generating verifiable specifications for 279 out of 385 programs, outperforming the existing purely LLM-based approaches and conventional specification generation tools like Houdini and Daikon. Further investigations on the quality of generated specifications indicate that SpecGen can comprehensively articulate the behaviors of the input program.',
        bio: `Yi Li is an Associate Professor at the College of Computing and Data Science, Nanyang Technological University (NTU) and an Associate Director of the NTU Centre in Computational Technologies for Finance (CCTF). Dr Li has been leading the Software Reliability and Security Lab (SRSLab@NTU) since 2018. His research interests are in program analysis and automated reasoning techniques with applications in software engineering and software security. Together with his research team, he develops solutions enabling the construction of high-quality software systems that are both reliable and sustainable. Currently, his work focuses on the security and fairness of decentralized applications and blockchain systems, as well as the robustness and dependability of AI systems. His work in these areas won four ACM Distinguished Paper Awards and two Best Artifact Awards at top-tier conferences, including ASE'15, ICSME'20, FSE'21, ISSTA'22, and ASE'23.`
    },
    {
        title: 'Large Language Models for Automated Program Repair',
        speaker: 'Xiaofei Xie',
        abstract: 'Large Language Models (LLMs) have shown exceptional achievements in diverse applications, particular in code generation tasks. In this talk, I will introduce a LLM-based Automated Program Repair (APR) approach that leverages conversation-driven mechanisms augmented by contrastive test pairs. This technique primarily aims to minimize discrepancies between generated passing tests and associated failing tests. Such a strategy enhances the ability of LLMs to isolate the root causes of bugs effectively. Moreover, while LLMs have achieved significant achievements, the reliance on extensive training corpora raises concerns about whether these successes stem from genuine comprehension or merely from data memorization. To address this, we further introduce a hypothesis testing method specifically designed to dissect the memorization phenomena within APR contexts. Our preliminary findings suggest that many fixes generated by LLMs may indeed be attributed to memorization, highlighting the critical need for more robust and rigorous evaluations in LLM-based tasks.',
        bio: `Dr. Xiaofei Xie is an Assistant Professor and  Lee Kong Chian Fellow at Singapore Management University. He obtained his Ph.D from Tianjin University and won the CCF Outstanding Doctoral Dissertation Award (2019) in China. Previously, he was a Wallenberg-NTU Presidential Postdoctoral Fellow at NTU. His research mainly focuses on the quality assurance of both traditional software and AI-enabled software. He has published top-tier conference/journal papers in the areas of software engineering, security and AI. In particular, he has received four ACM SIGSOFT Distinguished Paper Awards (FSE'16, ASE '19, ISSTA '22 and ASE '23) and a APSEC Best Paper Award.`
    },
    {
        title: 'Generating Domain-Specific Tests via LLM-based Conversation with Code Repository',
        speaker: 'Binhang Qi',
        abstract: `Software testing has been a long-standing challenge in the software engineering community. While automatic test generators like EvoSuite (focused on branch coverage) and LLM-based solutions (focused on code generation) show promising results, they often fall short when it comes to incorporating project-specific domain knowledge. This gap makes the generated tests less practical and harder to pass code review or be integrated into a software product.
In this talk, I will share our work DTester, an LLM-based test generator designed to generate practical project-specific tests. First, our empirical study reveals that sophisticated software projects contain abundant code assets valuable for guiding the generation of new tests. Based on the empirical observation, DTester is designed to retrieve a referable test and adapt it to the target test through LLM-based conversation with the project, thus capturing crucial domain-specific information. We also implement DTester as a VSCode extension to facilitate the practical use of test generation.'`,
        bio: 'Binhang Qi is currently a Postdoctoral Researcher at School of Computing, National University of Singapore, working with Professors Jin-Song Dong and Yun Lin. He received PhD degree from School of Computer Science and Engineering at Beihang University (BUAA) in 2024. His main research interests include DNN modularization and test generation, with his work published in ASE, ICSE, FSE, and TOSEM. He received the ACM SIGSOFT Distinguished Paper Award at ICSE 2024.'
    },
    {
        title: 'CoEdPilot: Recommending Code Edits with Learned Prior Edit Relevance, Project-wise Awareness, and Interactive Nature',
        speaker: 'Chenyan Liu',
        abstract: 'Incremental code edits are more frequent than generating new code in software projects. To automate this process, existing language model-based solutions focus primarily on generating edit solutions based on given location and relevant prior edits. However, editing tasks can be more complicated: It is non-trivial to infer the subsequent edit location, as the scope of edit ripple effect can be the whole project. Moreover, editing sessions may contain multiple (ir)relevant edits. In this talk, I will share our work CoEdPilot, a LLM-driven framework for code evolution assistance. CoEdPilot orchestrates a set of neural Transformers, for discriminating relevant edits, monitoring the ripple effects of edits, exploring their interactive natures and generating edit solution. We also implement CoEdPilot as a VS Code extension for user-friendly interaction.',
        bio: `Chenyan Liu is currently a PhD student at School of Computing, National University of Singapore. He is supervised by Dr. Yun LIN, Dr. Jin Song DONG and Dr. ZhiYong HUANG. He received his Bachelor's degree at Huazhong University of Science and Technology in 2021 and Master's degree at National University of Singapore in 2023. His research focuses on the design and evaluation of code evolution systems.`
    }
    
]

const sleep = async (ms) => {
    const p = new Promise((res) => {
        setTimeout(res, ms);
    });
    await p;
}

// add control to numbers
const speakerSectionTitleElement = document.querySelector('#speakers-section .section-title');
const talkContentWrapperElement = document.querySelector('.talk-content-wrapper');
const talkAbstractElement = document.querySelectorAll('.talk-abstract-text')[0];
let currentTalkNum = undefined;
const switchToTalk = async (num, doScroll) => {
    if (doScroll) {
        ignoringHeaderScrollTo(speakerSectionTitleElement);
    }

    if (num == currentTalkNum) return; 
    currentTalkNum = num;

    talkContentElement.classList.add('fading');
    await sleep(200);
    const talkInfo = talkInfoList[num];
    if (talkInfo) {
        for (const k in talkInfoElements) {
            talkInfoElements[k].innerText = talkInfo[k];
        }
    }
    talkContentElement.classList.remove('fading');

    const cardElement = talkIndexToCard.get(num);
    speakerCardElements.forEach(e => {
        e.classList.remove('selected');
    })
    cardElement.classList.add('selected');
}

/*
    title scaling animation
*/

// const titleScalingUntilScrollY = 120;
// const titleElement = document.querySelector('.title-text');
// const titleDescElement = document.querySelector('.title-desc');

// const scaleTitle = () => {
//     const scrollY = window.scrollY;
//     const scaleRatio = 1.1 - 0.1 * Math.min(1, scrollY / titleScalingUntilScrollY);
//     const translateYPixel = Math.min(titleScalingUntilScrollY, scrollY) / 2;
//     titleElement.style.transform = `scale(${scaleRatio}) translateY(${translateYPixel}px)`;
//     titleDescElement.style.transform = `scale(${scaleRatio}) translateY(${translateYPixel}px)`;
// };

// window.addEventListener('scroll', () => { scaleTitle(); });

/*
    speaker name animation
*/

document.querySelectorAll('.speaker-name > a').forEach((a) => {
    const homeIcon = a.querySelector('.material-symbols-outlined');
    a.addEventListener('mouseover', () => {
        homeIcon.classList.add('active');
    });
    a.addEventListener('mouseleave', () => {
        homeIcon.classList.remove('active');
    });
});

/*
    link from speaker to talks
*/

const nameToTalkIndex = new Map();
talkInfoList.forEach((talkInfo, i) => {
    nameToTalkIndex.set(talkInfo.speaker, i);
});

const getNameFromSpeakerCard = (cardElement) => {
    return cardElement.querySelector('.speaker-name > a')
    .childNodes[0]
    .textContent
    .trim();
}

const talkIndexToCard = new Map();

const speakerCardElements = document.querySelectorAll('.speaker-card');
speakerCardElements.forEach((element) => {
    const name = getNameFromSpeakerCard(element);
    const talkIndex = nameToTalkIndex.get(name);
    if (talkIndex === undefined) return;
    talkIndexToCard.set(talkIndex, element);

    element.addEventListener('mouseover', () => {
        element.classList.add('active');
    })
    element.addEventListener('mouseleave', () => {
        element.classList.remove('active');
    })

    element.addEventListener('click', () => {
        switchToTalk(talkIndex, true);
    });
})

switchToTalk(0);

/* Prepare agenda */
const rows = document.querySelectorAll('.schedule-table tbody tr');
rows.forEach((r, i) => {
    const speakerNameTd = r.querySelector('td:nth-child(2)');
    const topicTd = r.querySelector('td:last-child');
    
    speakerNameTd.textContent = talkInfoList[i].speaker;
    topicTd.textContent = talkInfoList[i].title;
});
