// Author biographies for classic poets

export interface AuthorInfo {
  bio: string;
  years: string;
  imagePath: string;
  wikipediaUrl: string;
  poetryFoundationUrl?: string;
}

export const AUTHOR_BIOS: Record<string, AuthorInfo> = {
  "John Donne": {
    bio: "English poet and cleric, considered the preeminent metaphysical poet. Known for his passionate and intellectual verse exploring themes of love, death, and spirituality.",
    years: "1572-1631",
    imagePath: "/authors/john-donne.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/John_Donne",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/john-donne"
  },
  
  "Robert Frost": {
    bio: "American poet, four-time Pulitzer Prize winner. Celebrated for his realistic depictions of rural life and his command of American colloquial speech.",
    years: "1874-1963",
    imagePath: "/authors/robert_frost.png",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Robert_Frost",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/robert-frost"
  },
  
  "Maya Angelou": {
    bio: "American poet and civil rights activist. Best known for her series of autobiographies and powerful poetry celebrating the human spirit and African American culture.",
    years: "1928-2014",
    imagePath: "/authors/maya-angelou.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Maya_Angelou",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/maya-angelou"
  },
  
  "William Shakespeare": {
    bio: "English playwright and poet, widely regarded as the greatest writer in the English language. His 154 sonnets remain timeless explorations of love, beauty, and mortality.",
    years: "1564-1616",
    imagePath: "/authors/william-shakespeare.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/William_Shakespeare",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/william-shakespeare"
  },
  
  "Sara Teasdale": {
    bio: "American lyric poet, known for her short, personal lyrics and nature imagery. Won the first Pulitzer Prize for Poetry in 1918.",
    years: "1884-1933",
    imagePath: "/authors/sara-teasdale.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sara_Teasdale",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/sara-teasdale"
  },
  
  "Walt Whitman": {
    bio: "American poet and journalist, known as the father of free verse. His groundbreaking work 'Leaves of Grass' celebrated democracy, nature, and the common person.",
    years: "1819-1892",
    imagePath: "/authors/walt-whitman.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Walt_Whitman",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/walt-whitman"
  },
  
  "Langston Hughes": {
    bio: "American poet and social activist, a leading figure of the Harlem Renaissance. His work celebrated African American culture and addressed racial injustice.",
    years: "1901-1967",
    imagePath: "/authors/langston-hughes.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Langston_Hughes",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/langston-hughes"
  },
  
  "Joyce Kilmer": {
    bio: "American poet and journalist. Best known for the widely anthologized poem 'Trees,' celebrating the beauty of the natural world.",
    years: "1886-1918",
    imagePath: "/authors/joyce-kilmer.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Joyce_Kilmer",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/joyce-kilmer"
  },
  
  "Percy Bysshe Shelley": {
    bio: "English Romantic poet, known for his radical politics and idealistic verse. One of the major English Romantic poets alongside Keats and Byron.",
    years: "1792-1822",
    imagePath: "/authors/percy-shelley.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Percy_Bysshe_Shelley",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/percy-bysshe-shelley"
  },
  
  "Rudyard Kipling": {
    bio: "English journalist and poet, Nobel Prize winner in Literature. Best known for 'The Jungle Book' and poems exploring duty, courage, and empire.",
    years: "1865-1936",
    imagePath: "/authors/rudyard-kipling.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Rudyard_Kipling",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/rudyard-kipling"
  },
  
  "Christina Georgina Rossetti": {
    bio: "English poet, associated with the Pre-Raphaelite movement. Known for her devotional and romantic verse with intense emotional depth.",
    years: "1830-1894",
    imagePath: "/authors/christina-rossetti.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Christina_Rossetti",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/christina-rossetti"
  },
  
  "Mary Elizabeth Frye": {
    bio: "American poet, best known for her poem 'Do Not Stand at My Grave and Weep,' which has become one of the most popular funeral poems.",
    years: "1905-2004",
    imagePath: "/authors/mary-frye.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Mary_Elizabeth_Frye",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/mary-elizabeth-frye"
  },
  
  "Edgar Allan Poe": {
    bio: "American writer and poet, master of the macabre and pioneer of detective fiction. His poetry is known for its musicality and exploration of dark themes.",
    years: "1809-1849",
    imagePath: "/authors/edgar-poe.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Edgar_Allan_Poe",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/edgar-allan-poe"
  },
  
  "Elizabeth Barrett Browning": {
    bio: "English poet, one of the most prominent poets of the Victorian era. Her 'Sonnets from the Portuguese' remain among the most celebrated love poems.",
    years: "1806-1861",
    imagePath: "/authors/elizabeth-browning.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Elizabeth_Barrett_Browning",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/elizabeth-barrett-browning"
  },
  
  "William Ernest Henley": {
    bio: "English poet and critic. His poem 'Invictus' became an anthem of resilience, famously inspiring Nelson Mandela during his imprisonment.",
    years: "1849-1903",
    imagePath: "/authors/william-henley.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/William_Ernest_Henley",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/william-ernest-henley"
  },
  
  "Dylan Thomas": {
    bio: "Welsh poet, known for his lyrical and passionate verse. His work is celebrated for its vivid imagery and emotional intensity.",
    years: "1914-1953",
    imagePath: "/authors/dylan-thomas.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Dylan_Thomas",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/dylan-thomas"
  },
  
  "Emily Dickinson": {
    bio: "American poet, one of the most original voices in American poetry. Her unconventional style and profound insights were largely unrecognized during her lifetime.",
    years: "1830-1886",
    imagePath: "/authors/emily-dickinson.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Emily_Dickinson",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/emily-dickinson"
  },
  
  "William Blake": {
    bio: "English poet and artist, a visionary figure of the Romantic Age. His illuminated books combined poetry and visual art to explore spirituality and imagination.",
    years: "1757-1827",
    imagePath: "/authors/william-blake.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/William_Blake",
    poetryFoundationUrl: "https://www.poetryfoundation.org/poets/william-blake"
  },
};

export function getAuthorInfo(authorName: string): AuthorInfo {
  return AUTHOR_BIOS[authorName] || {
    bio: "Classic poet whose work continues to inspire readers around the world.",
    years: "Unknown",
    imagePath: "/authors/default.jpg",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Poetry",
    poetryFoundationUrl: "https://www.poetryfoundation.org"
  };
}
