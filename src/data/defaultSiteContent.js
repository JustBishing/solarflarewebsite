const defaultSiteContent = {
  theme: {
    colors: {
      orange1: '#ff914d',
      orange2: '#ffb27a',
      bg: '#0c0c10',
      surface: '#17171c',
      elevated: '#1f1f25',
      border: '#2f2f38',
      text: '#FFFFFF',
      muted: '#E6E6EA',
    },
  },
  branding: {
    siteName: 'Solar Flare Robotics',
    teamNumber: '25707',
    season: 'Decode',
    region: 'NY-Excelsior region',
    logoAlt: 'Solar Flare Robotics logo',
    logoSrc: 'logo.png',
  },
  hero: {
    eyebrow: 'FTC Team #25707 · DECODE',
    title: 'Lighting the future of FTC innovation',
    description:
      'Solar Flare Robotics is an FTC team from the NY-Excelsior region, building advanced robots, mentoring peers, and expanding STEM access across our community. We are fiscally sponsored by Hack Club, so every contribution is tax-deductible.',
    primaryCtaLabel: 'Meet the team',
    primaryCtaLink: '/team',
    secondaryCtaLabel: 'Support our season',
    secondaryCtaLink: '/sponsorships',
    stats: [
      {
        label:
          '2025-26 Excelsior Winning Alliance Partner & Innovate Award winners.',
        accent: 'orange',
      },
      {
        label:
          'Fiscally sponsored by Hack Club Bank · donations stay tax-deductible.',
        accent: 'light',
      },
    ],
  },
  home: {
    about: {
      title: 'About Solar Flare',
      description:
        'Solar Flare Robotics is a second-year FIRST Tech Challenge team pushing Decode with bold ideas and community impact.',
      paragraphs: [
        'We are FTC Team #25707, a crew of determined students from Edgemont Jr./Sr. High School and the broader NY-Excelsior region. Our team formed to explore the intersection of creativity and engineering, challenging ourselves to design smarter robots every match.',
        'FIRST Tech Challenge gives us the space to prototype, iterate, and solve real-world problems together. Through the program we hone programming, CAD, machining, and leadership skills that extend far beyond the field.',
        'Solar Flare is fiscally sponsored by Hack Club, a 501(c)(3) organization. That partnership means every donation is tax-deductible and directly funds parts, upgrades, tools, and outreach that sustain our mission.',
      ],
    },
    record: {
      eyebrow: 'Season Record',
      title: 'Where we finished',
      titleAccent: 'the Decode season',
      description:
        'Every number below is a competition result from the 2025-26 Decode season, not a projection.',
      stats: [
        {
          value: '#10',
          label: 'Highest score in the world',
          caption: 'Set 3 / 8 / 26',
          accent: true,
        },
        {
          value: '#1',
          label: 'OPR in New York',
          caption: 'Decode season',
        },
        {
          value: '1st',
          label: 'Pick of a 5th-place divisional alliance',
          caption: 'FIRST World Championship',
        },
        {
          value: '#75',
          label: 'EPA worldwide',
          caption: 'At season close',
        },
      ],
    },
    highlights: {
      title: 'Season Highlights',
      description:
        'Turning our second season Decode into an unforgettable run with hardware breakthroughs, award recognition, and alliances that keep us learning.',
      items: [
        {
          date: 'Jan 17, 2026',
          event: 'Albany Academy Qualifier',
          summary: '5th Place Alliance Partner and Think Award 1st Place.',
        },
        {
          date: 'Jan 31, 2026',
          event: 'Peekskill Qualifier',
          summary:
            'Winning Alliance Captain, Inspire Award 2nd Place, and Qualified for the Regional Championship.',
        },
        {
          date: 'Mar 7-8, 2026',
          event: 'MVCC Excelsior Regional Championship',
          summary:
            'Winning Alliance Partner alongside Team 10949 M.O.B., Innovate Award 1st Place, and Qualified for the FIRST World Championship in Houston, Texas.',
        },
        {
          date: 'Season Stats',
          event: 'Decode',
          summary:
            '#10 highest score in the world (3/8/26) and #1 OPR in New York. At the FIRST World Championship we were the 1st pick of a 5th-place divisional alliance, closing the season ranked #75 EPA and #99 OPR worldwide.',
        },
      ],
    },
    sponsors: {
      title: 'Thanks to Our Sponsors',
      description:
        'We’re grateful for the partners who fuel our builds, scrimmages, and community events. Their support keeps Solar Flare blazing forward.',
      ctaDescription:
        'Interested in partnering with Solar Flare? Explore our sponsorship tiers to learn how your organization can make an impact during the 2025-2026 Decode season.',
      ctaLabel: 'View sponsorships',
      ctaLink: '/sponsorships',
    },
  },
  team: {
    intro: {
      title: 'A team of dedicated individuals',
      description:
        'Solar Flare is made up of builders, programmers, storytellers, and leaders who show up ready to learn at every workshop and match.',
      paragraphs: [
        'We rally around a shared love of robotics, combining diverse skill sets in code, mechanical design, outreach, and match strategy. That collaboration helps us iterate quickly and deliver reliable performance on the field.',
        'Beyond competitions we mentor younger students, speak at community events, and advocate for equitable access to STEM. Solar Flare is proof that when driven students work together, we can build more than robots-we build opportunities.',
      ],
    },
    roster: {
      title: 'Meet the squad',
      members: [
        {
          name: 'Tristan Li',
          role: 'Captain & Founder',
          bio: 'Tristan is a sophomore at Edgemont Jr./Sr. High School, who leads CAD, hardware, and outreach, while also helping with programming. He is also our main driver.',
          photo: 'members/Tristan.webp',
        },
        {
          name: 'Arick Khanna',
          role: 'Software Lead',
          bio: 'Arick brings three years of Python and Java experience to Solar Flare and focuses on auto and teleop software. He is also our secondary driver.',
          photo: 'members/Arick.webp',
        },
        {
          name: 'Arjun Khanna',
          role: 'Hardware',
          bio: 'Arjun Khanna does most of the robot assembly and wiring on the team.',
          photo: 'members/Arjun Khanna.webp',
        },
        {
          name: 'Dani Nayal',
          role: 'Computer Vision',
          bio: 'Dani is a dedicated 10th grader focused on developing computer vision models for object tracking and Apriltag-based localization.',
          photo: 'members/Dani.webp',
        },
        {
          name: 'Ryan Ma',
          role: 'Hardware & Manufacturing',
          bio: 'Ryan helps with robot assembly and wiring, as well as operating our CNC router to cut wood and aluminum parts.',
          photo: 'members/Ryan.webp',
        },
        {
          name: 'Rishi',
          role: 'Outreach & Fundraising',
          bio: "Rishi leads our team's fundraising as well as organizing outreach initiatives throughout our community.",
          photo: 'members/Rishi.webp',
        },
      ],
    },
    connect: {
      title: 'Connect with us',
      label: 'Follow',
      links: [
        {
          label: 'Instagram',
          href: 'https://instagram.com/solarflarerobotics',
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/@solarflarerobotics',
        },
        {
          label: 'Email',
          href: 'mailto:team@solarflarerobotics.org',
        },
      ],
    },
    apply: {
      title: 'Apply to join Solar Flare',
      description:
        'Interested in building, programming, outreach, or strategy? Fill out our interest form and we will follow up about the next steps.',
      buttonLabel: 'Apply now',
      buttonLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSddJdvq9qldA5Velh1F4SKJrOyt0YPKk1tst5hpR22xhks9IA/viewform?usp=dialog',
    },
  },
  pastSeasons: {
    intro: {
      title: 'Past seasons',
      description:
        'Track how Solar Flare has evolved from one FTC season to the next, from robot iterations to outreach and competition milestones.',
      paragraphs: [
        'This archive gives sponsors, teammates, and future applicants a quick way to see what we built, what we learned, and how the team grew over time.',
        'As new seasons finish, we add the strongest results, design breakthroughs, and community impact highlights here so the history stays easy to revisit.',
      ],
    },
    archive: {
      title: 'Season archive',
      description:
        'A running log of our major seasons, what defined them, and the moments we want to preserve.',
      seasons: [
        {
          year: '2025-2026',
          title: 'Decode',
          summary:
            'Our second season took Solar Flare to the FIRST World Championship in Houston, capped by a regional championship win and statistically our strongest year yet.',
          highlights: [
            '#10 highest score in the world (3/8/26).',
            '#1 OPR in New York.',
            'Winning Alliance Partner and Innovate Award 1st Place at the MVCC Excelsior Regional Championship.',
            'Divisional 5th-place alliance as the 1st overall pick at the FIRST World Championship.',
            'Closed the season ranked #75 EPA and #99 OPR worldwide.',
          ],
        },
        {
          year: '2024-2025',
          title: 'Into the Deep',
          summary:
            'Our rookie season established Solar Flare as a serious Excelsior team, blending fast iteration, strong autonomous work, and consistent outreach growth.',
          highlights: [
            'Finalist Alliance Captain at the Excelsior championship.',
            'Design Award winners and multiple qualifier award finishes.',
            'Strong autonomous performance and one of the best statistical seasons in the region.',
          ],
        },
      ],
    },
  },
  sponsorships: {
    intro: {
      title: 'Explore opportunities in sponsorships',
      description:
        'Partnerships help us compete at our best while expanding hands-on STEM opportunities for students throughout Westchester County.',
      paragraphs: [
        'Contributions directly fund robot parts, tools, competition fees, and outreach programs. Every donation or in-kind gift allows us to build higher-performing mechanisms, travel to events, and host workshops for aspiring engineers.',
        'As a fiscally sponsored project of Hack Club, a 501(c)(3), your sponsorship is fully tax-deductible. We provide regular season updates so you can see the impact of your support in action.',
      ],
      primaryCtaLabel: 'Donate via Hack Club Bank',
      primaryCtaLink: 'https://hcb.hackclub.com/donations/start/solar-flare',
      secondaryCtaLabel: 'Start a conversation',
      secondaryCtaLink: 'mailto:team@solarflarerobotics.org',
    },
    tiers: {
      title: 'Sponsorship tiers',
      items: [
        {
          title: 'Bronze',
          amount: '$250',
          benefits: [
            'Logo on our website sponsorship wall',
            'Thank-you post naming you across our social media',
            'Logo in our season engineering portfolio, read by FIRST judges',
          ],
        },
        {
          title: 'Silver',
          amount: '$500',
          benefits: [
            'All Bronze benefits',
            'Logo on the pit banner we display at every competition',
            'A dedicated social post about your support, with photos from the season',
          ],
        },
        {
          title: 'Gold',
          amount: '$1,000',
          benefits: [
            'All Silver benefits',
            'Logo on the robot and on the team shirts we wear all season',
            'Standing invitation to any competition, with a pit tour and a look at the robot',
          ],
        },
        {
          title: 'Platinum',
          amount: '$2,500+',
          benefits: [
            'All Gold benefits',
            'Presenting sponsor — named first and largest everywhere we list sponsors',
            'An end-of-season email with our results, photos, and where your money went',
          ],
        },
      ],
    },
    currentSponsors: {
      title: 'Current sponsors',
      description:
        'We are grateful for every organization investing in the future engineers, programmers, and makers on Solar Flare Robotics.',
    },
  },
  sponsors: [
    {
      name: 'Gene Haas Foundation',
      contribution: '$2,000 Grant',
      website: 'https://ghaasfoundation.org/',
      logo: 'sponsorships/HAAS.webp',
    },
    {
      name: 'Pantry Shelf',
      contribution: '$1,000 Sponsorship',
      website: 'https://www.pantryshelf.com/',
      logo: 'sponsorships/pantry.webp',
    },
    {
      name: 'Polymaker',
      contribution: '$200 Credit',
      website: 'https://polymaker.com/',
      logo: 'sponsorships/polymaker.webp',
    },
    {
      name: 'Misumi',
      contribution: '30% Discount',
      website:
        'https://us.misumi-ec.com/?gad_source=1&gad_campaignid=350961273&gbraid=0AAAAADtMMx8sNgD0U0kmwkUof_4Y-0Q2p&gclid=Cj0KCQjwpv7NBhCzARIsADkIfWx5D7rHbo_R9aFy7gTgjExBklqeTk5P4h-RFSqREJ9tCo4uO66eisAaAsZ0EALw_wcB',
      logo: 'sponsorships/Misumi.webp',
    },
    {
      name: 'CNC Madness',
      contribution: '30% Discount',
      website: 'https://cncmadness.com/',
      logo: 'sponsorships/CNC Madness.webp',
    },
    {
      name: 'White Plains Hospital',
      contribution: '$200 Sponsorship',
      website: 'https://www.wphospital.org/',
      logo: 'sponsorships/WhitePlainsHospital.webp',
    },
    {
      name: 'Art of Problem Solving',
      contribution: '$100 Credit',
      website: 'https://artofproblemsolving.com/',
      logo: 'sponsorships/AOPS.webp',
    },
  ],
  footer: {
    description:
      'FTC Team #25707 - Solar Flare Robotics, proudly representing the NY-Excelsior region.',
    sponsorNote:
      'Fiscally sponsored by Hack Club (501(c)(3)), making every donation tax-deductible.',
    contactTitle: 'Get in touch',
    quickLinksTitle: 'Quick links',
    email: 'team@solarflarerobotics.org',
    socials: [
      {
        label: 'Instagram',
        href: 'https://instagram.com/solarflarerobotics',
      },
      {
        label: 'YouTube',
        href: 'https://www.youtube.com/@solarflarerobotics',
      },
    ],
    copyrightPrefix: 'Solar Flare Robotics. All rights reserved.',
  },
};

export default defaultSiteContent;
