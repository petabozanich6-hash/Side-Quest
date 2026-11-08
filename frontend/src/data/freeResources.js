// Free learning websites for families, shown in the Resource Library. Links only: Side-Quest doesn't host or copy
// any of this content. "Free" means free to use; some sites ask for a free account or offer paid extras.
// Ages are rough guides.
export const FREE_SUBJECTS = ["Maths", "English", "Science", "History & Geography", "Creative Arts", "PDHPE", "Technology", "Languages"];

export const FREE_RESOURCES = [
  // Maths
  { title: "PhET Interactive Simulations", url: "https://phet.colorado.edu/", provider: "University of Colorado Boulder", subjects: ["Science", "Maths"], ages: "5–18", licence: "cc_by", note: "Free", purpose: "Hands-on simulations for physics, chemistry, biology, earth science and maths. Great for exploring 'what happens if…' questions." },
  { title: "Khan Academy", url: "https://www.khanacademy.org/", provider: "Khan Academy", subjects: ["Maths", "Science", "English", "History & Geography"], ages: "5–18", licence: "link_only", note: "Free (free account to track progress)", purpose: "Videos and practice for maths from early years to senior, plus science, grammar and more." },
  { title: "Khan Academy Kids", url: "https://learn.khanacademy.org/khan-academy-kids/", provider: "Khan Academy", subjects: ["Maths", "English"], ages: "2–8", licence: "link_only", note: "Free app", purpose: "Playful early reading, writing and maths app for young children." },
  { title: "NRICH", url: "https://nrich.maths.org/", provider: "University of Cambridge", subjects: ["Maths"], ages: "5–18", licence: "link_only", note: "Free", purpose: "Rich maths problems, games and investigations that build reasoning and problem solving." },
  { title: "Desmos", url: "https://www.desmos.com/", provider: "Desmos", subjects: ["Maths"], ages: "11–18", licence: "link_only", note: "Free", purpose: "Graphing, scientific and geometry calculators for exploring functions and shapes." },
  { title: "GeoGebra", url: "https://www.geogebra.org/", provider: "GeoGebra", subjects: ["Maths"], ages: "8–18", licence: "link_only", note: "Free", purpose: "Interactive geometry, graphing and maths activities shared by teachers worldwide." },
  { title: "Math Learning Center apps", url: "https://www.mathlearningcenter.org/apps", provider: "The Math Learning Center", subjects: ["Maths"], ages: "5–12", licence: "link_only", note: "Free", purpose: "Virtual manipulatives such as number frames, fractions, geoboards and number lines." },
  { title: "Topmarks", url: "https://www.topmarks.co.uk/", provider: "Topmarks", subjects: ["Maths", "English"], ages: "3–11", licence: "link_only", note: "Free (with ads)", purpose: "Quick interactive games for times tables, place value, phonics and more." },

  // English
  { title: "Storyline Online", url: "https://storylineonline.net/", provider: "SAG-AFTRA Foundation", subjects: ["English"], ages: "3–10", licence: "link_only", note: "Free", purpose: "Picture books read aloud by actors, with activity guides." },
  { title: "Unite for Literacy", url: "https://www.uniteforliteracy.com/", provider: "Unite for Literacy", subjects: ["English", "Languages"], ages: "3–8", licence: "link_only", note: "Free", purpose: "Free picture e-books for early readers, many with audio in different languages." },
  { title: "Project Gutenberg", url: "https://www.gutenberg.org/", provider: "Project Gutenberg", subjects: ["English", "History & Geography"], ages: "10–18", licence: "link_only", note: "Free", purpose: "Thousands of classic books as free e-books. Check copyright rules for Australia before printing or sharing." },
  { title: "ABC Kids Listen", url: "https://www.abc.net.au/kidslisten", provider: "ABC", subjects: ["English", "Creative Arts"], ages: "2–8", licence: "link_only", note: "Free", purpose: "Stories, songs and podcasts for young children." },
  { title: "BBC Bitesize", url: "https://www.bbc.co.uk/bitesize", provider: "BBC", subjects: ["English", "Maths", "Science", "History & Geography"], ages: "5–16", licence: "link_only", note: "Free", purpose: "Short lessons, videos and quizzes across most subjects (UK curriculum)." },

  // Science
  { title: "ABC Education", url: "https://www.abc.net.au/education", provider: "ABC", subjects: ["Science", "English", "History & Geography", "Maths"], ages: "5–18", licence: "link_only", note: "Free", purpose: "Australian videos, games and teaching resources matched to the curriculum." },
  { title: "NASA Space Place", url: "https://spaceplace.nasa.gov/", provider: "NASA", subjects: ["Science"], ages: "6–12", licence: "link_only", note: "Free", purpose: "Space and earth science explainers, games and hands-on activities." },
  { title: "Questacon", url: "https://www.questacon.edu.au/", provider: "Questacon", subjects: ["Science", "Technology"], ages: "4–16", licence: "link_only", note: "Free online activities", purpose: "Australia's national science centre: experiments to try at home and science activities." },
  { title: "CSIRO Education", url: "https://www.csiro.au/en/education", provider: "CSIRO", subjects: ["Science", "Technology"], ages: "5–18", licence: "link_only", note: "Free resources", purpose: "Australian science activities and resources from the national science agency." },
  { title: "Science Buddies", url: "https://www.sciencebuddies.org/", provider: "Science Buddies", subjects: ["Science", "Technology"], ages: "6–18", licence: "link_only", note: "Free", purpose: "Hundreds of science project and experiment ideas with step-by-step instructions." },
  { title: "National Geographic Kids", url: "https://kids.nationalgeographic.com/", provider: "National Geographic", subjects: ["Science", "History & Geography"], ages: "6–12", licence: "link_only", note: "Free", purpose: "Animals, places, science and history articles, photos and videos for kids." },

  // History & Geography
  { title: "National Museum of Australia: Defining Moments", url: "https://www.nma.gov.au/defining-moments", provider: "National Museum of Australia", subjects: ["History & Geography"], ages: "10–18", licence: "link_only", note: "Free", purpose: "Short histories of the events that shaped Australia." },
  { title: "Australian War Memorial: Learn", url: "https://www.awm.gov.au/learn", provider: "Australian War Memorial", subjects: ["History & Geography"], ages: "8–18", licence: "link_only", note: "Free", purpose: "Education resources, stories and primary sources about Australians at war." },
  { title: "Trove", url: "https://trove.nla.gov.au/", provider: "National Library of Australia", subjects: ["History & Geography", "English"], ages: "10–18", licence: "link_only", note: "Free", purpose: "Search old Australian newspapers, photos, maps and books for primary sources." },
  { title: "Google Earth", url: "https://earth.google.com/", provider: "Google", subjects: ["History & Geography"], ages: "6–18", licence: "link_only", note: "Free", purpose: "Explore the world in 3D, with guided tours of places and landforms." },
  { title: "Google Arts & Culture", url: "https://artsandculture.google.com/", provider: "Google", subjects: ["Creative Arts", "History & Geography"], ages: "6–18", licence: "link_only", note: "Free", purpose: "Virtual museum tours, famous artworks up close and history stories." },

  // Creative Arts
  { title: "Chrome Music Lab", url: "https://musiclab.chromeexperiments.com/", provider: "Google", subjects: ["Creative Arts"], ages: "4–14", licence: "link_only", note: "Free", purpose: "Playful experiments for exploring rhythm, melody, sound and composing music." },
  { title: "Art for Kids Hub", url: "https://www.artforkidshub.com/", provider: "Art for Kids Hub", subjects: ["Creative Arts"], ages: "4–12", licence: "link_only", note: "Free", purpose: "Step-by-step drawing lessons with a parent-and-child teaching style." },

  // PDHPE
  { title: "Smiling Mind", url: "https://www.smilingmind.com.au/", provider: "Smiling Mind", subjects: ["PDHPE"], ages: "3–18", licence: "link_only", note: "Free app", purpose: "Australian mindfulness and wellbeing programs for children, teens and families." },
  { title: "eSafety Kids", url: "https://www.esafety.gov.au/kids", provider: "eSafety Commissioner", subjects: ["PDHPE", "Technology"], ages: "5–12", licence: "link_only", note: "Free", purpose: "Australian Government online safety advice and activities for children." },
  { title: "GoNoodle", url: "https://www.gonoodle.com/", provider: "GoNoodle", subjects: ["PDHPE"], ages: "4–10", licence: "link_only", note: "Free (with optional paid extras)", purpose: "Movement and dance videos for brain breaks and getting the wiggles out." },
  { title: "Cosmic Kids Yoga", url: "https://www.youtube.com/@CosmicKidsYoga", provider: "Cosmic Kids (YouTube)", subjects: ["PDHPE"], ages: "3–9", licence: "link_only", note: "Free on YouTube", purpose: "Story-based yoga and mindfulness adventures for kids." },

  // Technology
  { title: "Scratch", url: "https://scratch.mit.edu/", provider: "MIT", subjects: ["Technology", "Creative Arts"], ages: "8–16", licence: "link_only", note: "Free", purpose: "Make interactive stories, games and animations with block coding." },
  { title: "ScratchJr", url: "https://www.scratchjr.org/", provider: "MIT / Tufts", subjects: ["Technology"], ages: "5–7", licence: "link_only", note: "Free app", purpose: "A simpler coding app for young children." },
  { title: "Code.org", url: "https://code.org/", provider: "Code.org", subjects: ["Technology"], ages: "4–18", licence: "link_only", note: "Free", purpose: "Coding courses and puzzles, including the Hour of Code." },
  { title: "Blockly Games", url: "https://blockly.games/", provider: "Google", subjects: ["Technology"], ages: "8–14", licence: "link_only", note: "Free", purpose: "Self-paced puzzle games that teach programming concepts." },

  // Languages
  { title: "Duolingo", url: "https://www.duolingo.com/", provider: "Duolingo", subjects: ["Languages"], ages: "8–18", licence: "link_only", note: "Free (with optional paid extras)", purpose: "Short daily lessons in dozens of languages." },
];
