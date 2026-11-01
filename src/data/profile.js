// Your bio, used by the home page and by the search-engine HTML generated at build time.
// Each paragraph is a list of pieces: plain text, or { text, href } for a link.
const profile = {
  name: 'Rohit Bommisetti',
  url: 'https://bommisetti.org',
  location: 'Philadelphia',
  employer: { name: 'Renovus Capital', url: 'https://renovuscapital.com' },
  alumniOf: ['University of Pittsburgh'],
  sameAs: ['https://twitter.com/rohitbommisetti', 'https://www.linkedin.com/in/rohitbommisetti'],
  // Shown in Google results for the home page.
  description:
    'Rohit Bommisetti works at Renovus Capital, a private equity firm outside Philadelphia, where he’s focused on modernizing the service economy with AI.',
  bio: [
    [
      'I work at ',
      { text: 'Renovus Capital', href: 'https://renovuscapital.com' },
      ', where I’m focused on modernizing the service economy with AI.',
    ],
    [
      'Before that, I worked on reducing oncology readmissions at Carnegie Mellon, built a student entrepreneurship community, and taught AI with a team from Stanford. I studied economics at the University of Pittsburgh.',
    ],
    ['When I’m not working, I’m probably deep in a biography, on a trail, or in the ocean.'],
  ],
};

export default profile;
