/**
 * The Dragon's Library is a LINK DIRECTORY, not an ebook host or price comparison API.
 * Editorial summaries are original. No book covers, metadata scraping or third-party text.
 * `access` flags where to SEARCH, never confirmed current stock or country-specific copyright.
 * "free" is reserved for books found in Book Dash's officially free-to-read collection.
 * To add a book: add a tuple below; never add pirated-download websites.
 *
 * Tuple: [title, author/credit, band, genre, subjects, access, original discovery note].
 * Stages are approximate recommendations, never age restrictions.
 */
const RAW = [
  // Book Dash: the free-reading button opens Book Dash's searchable catalogue.
  ["Let's Go Looking", "Book Dash creators", "early", "Picture books", "English,Nature", "bookdash", "A playful invitation to look closely at the world."],
  ["Khumo's Big Trip", "Book Dash creators", "early", "Picture books", "English,Geography", "bookdash", "A gentle trip-themed pick for curious young readers."],
  ["I Can Do It!", "Book Dash creators", "early", "Picture books", "English,Wellbeing", "bookdash", "A picture-book pick about trying things for yourself."],
  ["Amo and the Missing Mielies", "Book Dash creators", "early", "Picture books", "English,Wellbeing", "bookdash", "A colourful story to practise retelling and prediction."],
  ["Can We Eat a Rainbow?", "Book Dash creators", "early", "Picture books", "English,Science", "bookdash", "Explore colourful foods and everyday healthy choices."],
  ["Play With Me", "Book Dash creators", "early", "Picture books", "English,Wellbeing", "bookdash", "A friendly conversation starter about play."],
  ["The Red Umbrella", "Book Dash creators", "early", "Picture books", "English,Art", "bookdash", "A wordless picture book for inventing your own narration."],
  ["Where Is Lulu?", "Book Dash creators", "early", "Picture books", "English,Wellbeing", "bookdash", "Look for clues and discuss what might happen next."],
  ["Where Is Thabo?", "Book Dash creators", "early", "Picture books", "English,Wellbeing", "bookdash", "A discovery-focused story to read together."],
  ["Who Took My Shoe?", "Book Dash creators", "early", "Picture books", "English,Art", "bookdash", "A playful prompt for describing and noticing details."],
  ["What Is It?", "Book Dash creators", "early", "Picture books", "English,Science", "bookdash", "A short pick for building vocabulary and curiosity."],
  ["Why Birds Sing at Dawn", "Book Dash creators", "early", "Picture books", "English,Nature", "bookdash", "An animal-themed story for noticing morning sounds."],
  ["Woof-Woof!", "Book Dash creators", "early", "Picture books", "English,Nature", "bookdash", "A lively animal-themed read for the smallest adventurers."],
  ["Yapo Saves the Day", "Book Dash creators", "early", "Picture books", "English,Wellbeing", "bookdash", "Talk about decisions and helping others."],
  ["Meerkat Magic", "Book Dash creators", "early", "Picture books", "English,Nature", "bookdash", "A nature-flavoured picture book to browse together."],
  ["Zanele Sees Numbers", "Book Dash creators", "early", "Picture books", "Maths,English", "bookdash", "Spot numbers and practise counting through story."],

  // Older classics: search the official Gutenberg catalogue; rights vary by country.
  ["Alice's Adventures in Wonderland", "Lewis Carroll", "middle", "Fantasy", "English,Art", "gutenberg", "A curious child discovers a world where logic behaves strangely."],
  ["The Wonderful Wizard of Oz", "L. Frank Baum", "primary", "Fantasy", "English,Geography", "gutenberg", "A journey through an unusual land and an unlikely group of friends."],
  ["Anne of Green Gables", "L. M. Montgomery", "middle", "Classics", "English,Wellbeing", "gutenberg", "A lively imagination transforms life in a new home."],
  ["The Secret Garden", "Frances Hodgson Burnett", "middle", "Classics", "English,Nature", "gutenberg", "A neglected garden becomes a place of change and friendship."],
  ["Little Women", "Louisa May Alcott", "middle", "Classics", "English,History", "gutenberg", "Four sisters navigate family, ambition and growing up."],
  ["Black Beauty", "Anna Sewell", "middle", "Classics", "English,Wellbeing", "gutenberg", "A horse's experiences open conversations about kindness."],
  ["Treasure Island", "Robert Louis Stevenson", "middle", "Adventure", "English,Geography", "gutenberg", "A sea adventure of maps, mystery and difficult choices."],
  ["The Jungle Book", "Rudyard Kipling", "middle", "Adventure", "English,Nature", "gutenberg", "Animal stories invite discussion about belonging and rules."],
  ["The Wind in the Willows", "Kenneth Grahame", "middle", "Classics", "English,Nature", "gutenberg", "Friendships and adventures unfold beside a river."],
  ["Peter Pan", "J. M. Barrie", "middle", "Fantasy", "English,Art", "gutenberg", "An imaginary island raises questions about childhood and adventure."],
  ["A Little Princess", "Frances Hodgson Burnett", "middle", "Classics", "English,Wellbeing", "gutenberg", "Imagination and resilience are tested by a change of fortune."],
  ["The Adventures of Tom Sawyer", "Mark Twain", "middle", "Adventure", "English,History", "gutenberg", "Mischief and moral choices in a small river town."],
  ["The Adventures of Pinocchio", "Carlo Collodi", "primary", "Fantasy", "English,Wellbeing", "gutenberg", "A wooden puppet learns about choices and consequences."],
  ["A Christmas Carol", "Charles Dickens", "middle", "Classics", "English,History", "gutenberg", "A visit from three spirits prompts a change of heart."],
  ["Around the World in Eighty Days", "Jules Verne", "middle", "Adventure", "English,Geography", "gutenberg", "A race across continents invites map work and discussion."],
  ["Twenty Thousand Leagues Under the Seas", "Jules Verne", "teen", "Science fiction", "English,Science", "gutenberg", "An underwater voyage imagined before modern submarines."],
  ["The Adventures of Sherlock Holmes", "Arthur Conan Doyle", "teen", "Mystery", "English,Logic", "gutenberg", "Short detective cases built around inference and clues."],
  ["Frankenstein", "Mary Shelley", "teen", "Science fiction", "English,Science", "gutenberg", "An influential novel about scientific responsibility; mature themes."],
  ["Pride and Prejudice", "Jane Austen", "teen", "Classics", "English,History", "gutenberg", "Family and society collide with first impressions."],
  ["Jane Eyre", "Charlotte Brontë", "teen", "Classics", "English,History", "gutenberg", "A young woman's independence is tested by her circumstances."],
  ["Dracula", "Bram Stoker", "teen", "Horror", "English,History", "gutenberg", "A Gothic vampire novel with frightening material; mature readers."],
  ["The Time Machine", "H. G. Wells", "teen", "Science fiction", "English,Science", "gutenberg", "A journey into a speculative future prompts big questions."],

  // Contemporary and in-copyright titles: borrowing/second-hand search ONLY.
  ["The Very Hungry Caterpillar", "Eric Carle", "early", "Picture books", "English,Science", "borrow", "A familiar first read that can spark life-cycle questions."],
  ["Where the Wild Things Are", "Maurice Sendak", "early", "Picture books", "English,Art", "borrow", "Imaginary creatures make a wonderful drawing prompt."],
  ["Possum Magic", "Mem Fox", "early", "Picture books", "English,Geography", "borrow", "An Australian favourite that can inspire food and map activities."],
  ["Wombat Stew", "Marcia K. Vaughan", "early", "Picture books", "English,Nature", "borrow", "Rhythm and repetition make this a playful shared read."],
  ["Diary of a Wombat", "Jackie French", "early", "Picture books", "English,Nature", "borrow", "A wombat's daily life inspires a funny observation diary."],
  ["The Gruffalo", "Julia Donaldson", "early", "Picture books", "English,Art", "borrow", "Rhyme and inventive problem-solving in the woods."],
  ["The Paper Bag Princess", "Robert Munsch", "early", "Picture books", "English,Wellbeing", "borrow", "A spirited twist on a familiar fairy-tale adventure."],
  ["The Day the Crayons Quit", "Drew Daywalt", "early", "Picture books", "English,Art", "borrow", "Imagine what everyday classroom objects might say."],
  ["The Lorax", "Dr. Seuss", "primary", "Picture books", "English,Science", "borrow", "A story that opens discussion about caring for environments."],
  ["The Rainbow Fish", "Marcus Pfister", "early", "Picture books", "English,Wellbeing", "borrow", "A colourful picture book for talking about friendships."],
  ["We're Going on a Bear Hunt", "Michael Rosen", "early", "Picture books", "English,Geography", "borrow", "Repetition and landscapes invite dramatic read-alouds."],
  ["The Magic School Bus Inside the Human Body", "Joanna Cole", "primary", "Non-fiction", "Science,English", "borrow", "A story-led introduction to how the body works."],
  ["The Bad Guys", "Aaron Blabey", "primary", "Graphic novels", "English,Art", "borrow", "Illustrated humour for reluctant or confident readers."],
  ["The 13-Storey Treehouse", "Andy Griffiths", "primary", "Humour", "English,Art", "borrow", "An absurd treehouse adventure with plenty to illustrate."],
  ["WeirDo", "Anh Do", "primary", "Humour", "English,Wellbeing", "borrow", "Short funny chapters about fitting in."],
  ["Dog Man", "Dav Pilkey", "primary", "Graphic novels", "English,Art", "borrow", "A comic-style adventure that encourages visual storytelling."],
  ["Captain Underpants", "Dav Pilkey", "primary", "Humour", "English,Art", "borrow", "Silly superhero antics with accessible illustrated pages."],
  ["Diary of a Wimpy Kid", "Jeff Kinney", "primary", "Humour", "English,Wellbeing", "borrow", "A diary format that's handy for trying your own journal entries."],
  ["Matilda", "Roald Dahl", "primary", "Fantasy", "English,Wellbeing", "borrow", "A book-loving child discovers remarkable abilities."],
  ["Charlie and the Chocolate Factory", "Roald Dahl", "primary", "Fantasy", "English,Art", "borrow", "A fantastical factory sparks design-your-own-invention ideas."],
  ["The BFG", "Roald Dahl", "primary", "Fantasy", "English,Art", "borrow", "Inventive language makes a terrific word-play starting point."],
  ["Charlotte's Web", "E. B. White", "primary", "Classics", "English,Nature", "borrow", "Friendship and farm animals in a moving novel."],
  ["The Wild Robot", "Peter Brown", "primary", "Science fiction", "English,Science", "borrow", "A robot learns to survive among island wildlife."],
  ["The One and Only Ivan", "Katherine Applegate", "primary", "Adventure", "English,Wellbeing", "borrow", "An animal narrator opens conversations about empathy."],
  ["Because of Winn-Dixie", "Kate DiCamillo", "primary", "Classics", "English,Wellbeing", "borrow", "A dog helps bring neighbours together."],
  ["Wonder", "R. J. Palacio", "middle", "Realistic fiction", "English,Wellbeing", "borrow", "Different viewpoints explore kindness and belonging."],
  ["Holes", "Louis Sachar", "middle", "Mystery", "English,Geography", "borrow", "A desert mystery told through interwoven timelines."],
  ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "middle", "Fantasy", "English,Art", "borrow", "A new school opens the door to a hidden magical world."],
  ["Percy Jackson and the Lightning Thief", "Rick Riordan", "middle", "Fantasy", "English,History", "borrow", "Greek mythology enters a modern-day quest."],
  ["The Lion, the Witch and the Wardrobe", "C. S. Lewis", "middle", "Fantasy", "English,Art", "borrow", "A winter-bound fantasy world awaits beyond a wardrobe."],
  ["The Hobbit", "J. R. R. Tolkien", "middle", "Fantasy", "English,Geography", "borrow", "An unlikely adventurer leaves home for a dangerous journey."],
  ["The Giver", "Lois Lowry", "middle", "Science fiction", "English,Wellbeing", "borrow", "A controlled community sparks questions about memory and choice."],
  ["Amulet: The Stonekeeper", "Kazu Kibuishi", "middle", "Graphic novels", "English,Art", "borrow", "A richly illustrated fantasy mystery."],
  ["New Kid", "Jerry Craft", "middle", "Graphic novels", "English,Wellbeing", "borrow", "School experiences told through expressive comic panels."],
  ["The Explorer", "Katherine Rundell", "middle", "Adventure", "English,Geography", "borrow", "Children stranded in the rainforest must work together."],
  ["The Girl Who Drank the Moon", "Kelly Barnhill", "middle", "Fantasy", "English,Art", "borrow", "A lyrical fantasy about magic and family."],
  ["The Graveyard Book", "Neil Gaiman", "middle", "Fantasy", "English,Wellbeing", "borrow", "An unusual upbringing unfolds in a spooky setting."],
  ["The Hunger Games", "Suzanne Collins", "teen", "Science fiction", "English,Wellbeing", "borrow", "A dystopian survival story with violence and mature themes."],
  ["The Book Thief", "Markus Zusak", "teen", "Historical fiction", "English,History", "borrow", "A wartime story about books, words and loss; mature themes."],
  ["Tomorrow, When the War Began", "John Marsden", "teen", "Adventure", "English,History", "borrow", "Australian teenagers face an invasion; mature themes."],
  ["The Outsiders", "S. E. Hinton", "teen", "Realistic fiction", "English,Wellbeing", "borrow", "Teenage loyalty and class tensions; contains violence."],
  ["The Hate U Give", "Angie Thomas", "teen", "Realistic fiction", "English,Wellbeing", "borrow", "A contemporary story about speaking up; mature themes."],
  ["Fahrenheit 451", "Ray Bradbury", "teen", "Science fiction", "English,History", "borrow", "A future society questions reading and censorship."],
  ["Nineteen Eighty-Four", "George Orwell", "teen", "Science fiction", "English,History", "borrow", "Surveillance and language in an unsettling dystopia."],
  ["Animal Farm", "George Orwell", "teen", "Classics", "English,History", "borrow", "An allegory that invites discussion about power."],
  ["The Martian", "Andy Weir", "teen", "Science fiction", "Science,Maths", "borrow", "Problem-solving on Mars; adult language."],
  ["The Fellowship of the Ring", "J. R. R. Tolkien", "teen", "Fantasy", "English,Geography", "borrow", "A long-form fantasy journey with rich world-building."],
  ["The Curious Incident of the Dog in the Night-Time", "Mark Haddon", "teen", "Mystery", "English,Wellbeing", "borrow", "A mystery with a distinctive narrator; some mature content."],
  ["A Really Short History of Nearly Everything", "Bill Bryson", "middle", "Non-fiction", "Science,History", "borrow", "Big science ideas explained for younger readers."],
  ["Horrible Histories: Rotten Romans", "Terry Deary", "middle", "Non-fiction", "History,English", "borrow", "Unusual details bring the ancient Romans to life."],
  ["Hidden Figures: Young Readers' Edition", "Margot Lee Shetterly", "middle", "Non-fiction", "History,Maths", "borrow", "Stories of mathematicians whose work shaped space exploration."],
  ["The Boy Who Harnessed the Wind: Young Readers Edition", "William Kamkwamba and Bryan Mealer", "middle", "Non-fiction", "Science,Geography", "borrow", "A true story of engineering through resourcefulness."],
];

export const DRAGON_BOOKS = RAW.map(([title,author,band,genre,subjects,access,note],index) => ({
  id: "dragon-book-" + (index+1),
  title, author, band, genre, subjects:subjects.split(","), access, note,
}));
export const BOOK_BANDS = [
  {value:"early",label:"Early readers & read-alouds"},
  {value:"primary",label:"Growing readers"},
  {value:"middle",label:"Confident readers"},
  {value:"teen",label:"Teen & mature reads"},
];
export const BOOK_SUBJECTS = [...new Set(DRAGON_BOOKS.flatMap(b=>b.subjects))].sort();
export const BOOK_GENRES = [...new Set(DRAGON_BOOKS.map(b=>b.genre))].sort();
export function dragonBookLinks(book) {
  const query = encodeURIComponent(book.title + " " + (book.author === "Book Dash creators" ? "" : book.author));
  return {
    trove: "https://trove.nla.gov.au/search/category/books?keyword=" + query,
    secondhand: "https://www.ebay.com.au/sch/i.html?_nkw=" + query,
    free: book.access === "bookdash" ? "https://bookdash.org/books/" :
      book.access === "gutenberg" ? "https://www.gutenberg.org/ebooks/search/?query=" + query : null,
  };
}
