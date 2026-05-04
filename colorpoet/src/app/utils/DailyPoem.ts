
// This will retreive the poem data from each day as a object and display it on the home page of the app
interface Poem { 
    title: string; 
    author: string;
    lines: string[];
}

// 31 Classic poems that cycle through based on day of year
const DAILY_POEMS: Poem[] = [
  {
    title: "No Man Is An Island",
    author: "John Donne",
    lines: [
      "No man is an island,",
      "Entire of itself,",
      "Every man is a piece of the continent,",
      "A part of the main.",
      "If a clod be washed away by the sea,",
      "Europe is the less.",
      "As well as if a promontory were.",
      "As well as if a manor of thy friend's",
      "Or of thine own were:",
      "Any man's death diminishes me,",
      "Because I am involved in mankind,",
      "And therefore never send to know for whom the bell tolls;",
      "It tolls for thee."
    ]
  },
  {
    title: "Stopping by Woods On a Snowy Evening",
    author: "Robert Frost",
    lines: [
      "Whose woods these are I think I know.",
      "His house is in the village though;",
      "He will not see me stopping here",
      "To watch his woods fill up with snow.",
      "My little horse must think it queer",
      "To stop without a farmhouse near",
      "Between the woods and frozen lake",
      "The darkest evening of the year.",
      "He gives his harness bells a shake",
      "To ask if there is some mistake.",
      "The only other sound's the sweep",
      "Of easy wind and downy flake.",
      "The woods are lovely, dark and deep,",
      "But I have promises to keep,",
      "And miles to go before I sleep,",
      "And miles to go before I sleep."
    ]
  },
  {
    title: "Still I Rise",
    author: "Maya Angelou",
    lines: [
      "You may write me down in history",
      "With your bitter, twisted lies,",
      "You may tread me in the very dirt",
      "But still, like dust, I'll rise."
    ]
  },
  {
    title: "Shall I Compare Thee To A Summer's Day?",
    author: "William Shakespeare",
    lines: [
      "Shall I compare thee to a summer's day?",
      "Thou art more lovely and more temperate.",
      "Rough winds do shake the darling buds of May,",
      "And summer's lease hath all too short a date.",
      "Sometime too hot the eye of heaven shines,",
      "And often is his gold complexion dimmed;",
      "And every fair from fair sometime declines,",
      "By chance, or nature's changing course, untrimmed;",
      "But thy eternal summer shall not fade,",
      "Nor lose possession of that fair thou ow'st,",
      "Nor shall death brag thou wand'rest in his shade,",
      "When in eternal lines to Time thou grow'st.",
      "So long as men can breathe, or eyes can see,",
      "So long lives this, and this gives life to thee."
    ]
  },
  {
    title: "There Will Come Soft Rain",
    author: "Sara Teasdale",
    lines: [
      "There will come soft rains and the smell of the ground,",
      "And swallows circling with their shimmering sound;",
      "And frogs in the pools singing at night,",
      "And wild plum trees in tremulous white;",
      "Robins will wear their feathery fire,",
      "Whistling their whims on a low fence-wire;",
      "And not one will know of the war, not one",
      "Will care at last when it is done."
    ]
  },
  {
    title: "O Captain! My Captain!",
    author: "Walt Whitman",
    lines: [
      "O Captain! my Captain! our fearful trip is done;",
      "The ship has weather'd every rack, the prize we sought is won;",
      "The port is near, the bells I hear, the people all exulting,",
      "While follow eyes the steady keel, the vessel grim and daring:",
      "But O heart! heart! heart!",
      "O the bleeding drops of red,",
      "Where on the deck my Captain lies,",
      "Fallen cold and dead."
    ]
  },
  {
    title: "Fire And Ice",
    author: "Robert Frost",
    lines: [
      "Some say the world will end in fire,",
      "Some say in ice.",
      "From what I've tasted of desire",
      "I hold with those who favor fire.",
      "But if it had to perish twice,",
      "I think I know enough of hate",
      "To say that for destruction ice",
      "Is also great",
      "And would suffice."
    ]
  },
  {
    title: "The Road Not Taken",
    author: "Robert Frost",
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;",
      "Then took the other, as just as fair,",
      "And having perhaps the better claim",
      "Because it was grassy and wanted wear,",
      "Though as for that the passing there",
      "Had worn them really about the same,"
    ]
  },
  {
    title: "Dreams",
    author: "Langston Hughes",
    lines: [
      "Hold fast to dreams",
      "For if dreams die",
      "Life is a broken-winged bird",
      "That cannot fly.",
      "Hold fast to dreams",
      "For when dreams go",
      "Life is a barren field",
      "Frozen with snow."
    ]
  },
  {
    title: "Trees",
    author: "Joyce Kilmer",
    lines: [
      "I think that I shall never see",
      "A poem lovely as a tree.",
      "A tree whose hungry mouth is prest",
      "Against the earth's sweet flowing breast;",
      "A tree that looks at God all day,",
      "And lifts her leafy arms to pray;",
      "Poems are made by fools like me,",
      "But only God can make a tree."
    ]
  },
  {
    title: "Ozymandias",
    author: "Percy Bysshe Shelley",
    lines: [
      "I met a traveller from an antique land",
      "Who said: Two vast and trunkless legs of stone",
      "Stand in the desert. Near them, on the sand,",
      "Half sunk, a shattered visage lies, whose frown,",
      "And wrinkled lip, and sneer of cold command,",
      "Tell that its sculptor well those passions read",
      "My name is Ozymandias, king of kings:",
      "Look on my works, ye Mighty, and despair!",
      "Nothing beside remains. Round the decay",
      "Of that colossal wreck, boundless and bare",
      "The lone and level sands stretch far away."
    ]
  },
  {
    title: "If",
    author: "Rudyard Kipling",
    lines: [
      "If you can keep your head when all about you",
      "Are losing theirs and blaming it on you;",
      "If you can trust yourself when all men doubt you,",
      "But make allowance for their doubting too:",
      "If you can dream and not make dreams your master;",
      "If you can think and not make thoughts your aim,"
    ]
  },
  {
    title: "Remember",
    author: "Christina Georgina Rossetti",
    lines: [
      "Remember me when I am gone away,",
      "Gone far away into the silent land;",
      "When you can no more hold me by the hand,",
      "Nor I half turn to go yet turning stay.",
      "Remember me when no more day by day",
      "You tell me of our future that you plann'd:",
      "Only remember me; you understand"
    ]
  },
  {
    title: "A Fairy Song",
    author: "William Shakespeare",
    lines: [
      "Over hill, over dale,",
      "Thorough bush, thorough brier,",
      "Over park, over pale,",
      "Thorough flood, thorough fire!",
      "I do wander everywhere,",
      "Swifter than the moon's sphere;",
      "And I serve the Fairy Queen,",
      "To dew her orbs upon the green;"
    ]
  },
  {
    title: "Do Not Stand At My Grave And Weep",
    author: "Mary Elizabeth Frye",
    lines: [
      "Do not stand at my grave and weep",
      "I am not there. I do not sleep.",
      "I am a thousand winds that blow.",
      "I am the diamond glints on snow.",
      "I am the sunlight on ripened grain.",
      "I am the gentle autumn rain."
    ]
  },
  {
    title: "A Dream Within A Dream",
    author: "Edgar Allan Poe",
    lines: [
      "Take this kiss upon the brow!",
      "And, in parting from you now,",
      "Thus much let me avow-",
      "You are not wrong, who deem",
      "That my days have been a dream;",
      "All that we see or seem",
      "Is but a dream within a dream."
    ]
  },
  {
    title: "How Do I Love Thee?",
    author: "Elizabeth Barrett Browning",
    lines: [
      "How do I love thee? Let me count the ways.",
      "I love thee to the depth and breadth and height",
      "My soul can reach, when feeling out of sight",
      "For the ends of Being and ideal Grace.",
      "I love thee to the level of every day's",
      "Most quiet need, by sun and candlelight."
    ]
  },
  {
    title: "Invictus",
    author: "William Ernest Henley",
    lines: [
      "Out of the night that covers me,",
      "Black as the Pit from pole to pole,",
      "I thank whatever gods may be",
      "For my unconquerable soul.",
      "In the fell clutch of circumstance",
      "I have not winced nor cried aloud.",
      "Under the bludgeonings of chance",
      "My head is bloody, but unbowed.",
      "I am the master of my fate:",
      "I am the captain of my soul."
    ]
  },
  {
    title: "Do Not Go Gentle Into That Good Night",
    author: "Dylan Thomas",
    lines: [
      "Do not go gentle into that good night,",
      "Old age should burn and rave at close of day;",
      "Rage, rage against the dying of the light."
    ]
  },
  {
    title: "Hope Is The Thing With Feathers",
    author: "Emily Dickinson",
    lines: [
      "Hope is the thing with feathers",
      "That perches in the soul",
      "And sings the tune without the words",
      "And never stops at all"
    ]
  },
  {
    title: "A Poison Tree",
    author: "William Blake",
    lines: [
      "I was angry with my friend:",
      "I told my wrath, my wrath did end.",
      "I was angry with my foe:",
      "I told it not, my wrath did grow.",
      "And I watered it in fears,",
      "Night and morning with my tears;",
      "And I sunned it with smiles,",
      "And with soft deceitful wiles."
    ]
  },
  {
    title: "I Wandered Lonely As A Cloud",
    author: "William Wordsworth",
    lines: [
      "I wandered lonely as a cloud",
      "That floats on high o'er vales and hills,",
      "When all at once I saw a crowd,",
      "A host, of golden daffodils;",
      "Beside the lake, beneath the trees,",
      "Fluttering and dancing in the breeze."
    ]
  },
  {
    title: "Mother To Son",
    author: "Langston Hughes",
    lines: [
      "Well, son, I'll tell you:",
      "Life for me ain't been no crystal stair.",
      "It's had tacks in it,",
      "And splinters,",
      "And boards torn up,",
      "And places with no carpet on the floor",
      "Bare."
    ]
  },
  {
    title: "Lovebirds",
    author: "Bean Poems",
    lines: [
      "The forest shines and shows its green",
      "It's steam, the leaves, their sheen is seen",
      "Two lovebirds hold and watch the sight",
      "Their love glows white with hours of flight"
    ]
  },
  {
    title: "The Mango",
    author: "Bean Poems",
    lines: [
      "For weeks they wait, a girl and boy",
      "She waters, tends with glee",
      "At last, it's free and green with joy",
      "A mango from that tree!"
    ]
  },
  {
    title: "Coffee",
    author: "Bean Poems",
    lines: [
      "Heat and the beans and the water is joined",
      "Coming together in joint is the point",
      "Black or with milk or as sweet as a fruit",
      "Make it just right and a friend is with you"
    ]
  },
  {
    title: "The Octopus Project",
    author: "Bean Poems",
    lines: [
      "This octopus tells me",
      "a lot about you",
      "that you care for justice",
      "in all that you do"
    ]
  },
  {
    title: "Surprises",
    author: "Bean Poems",
    lines: [
      "Surprise! A gift! From me to go.",
      "It's here so take a look",
      "A craft? A painting? Close! But no!",
      "A poem for your book."
    ]
  },
  {
    title: "The Tyger",
    author: "William Blake",
    lines: [
      "Tyger Tyger, burning bright,",
      "In the forests of the night;",
      "What immortal hand or eye,",
      "Could frame thy fearful symmetry?"
    ]
  },
  {
    title: "Annabel Lee",
    author: "Edgar Allan Poe",
    lines: [
      "It was many and many a year ago,",
      "In a kingdom by the sea,",
      "That a maiden there lived whom you may know",
      "By the name of Annabel Lee;",
      "And this maiden she lived with no other thought",
      "Than to love and be loved by me."
    ]
  },
  {
    title: "The New Colossus",
    author: "Emma Lazarus",
    lines: [
      "Give me your tired, your poor,",
      "Your huddled masses yearning to breathe free,",
      "The wretched refuse of your teeming shore.",
      "Send these, the homeless, tempest-tost to me,",
      "I lift my lamp beside the golden door!"
    ]
  }
];

// Helper function to calculate day of year
function getDayOfYear(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear;
}

// Get today's poem (cycles through 31 poems)
export function getTodaysPoem(): Poem {
  const dayOfYear = getDayOfYear();
  return DAILY_POEMS[dayOfYear % DAILY_POEMS.length];
}

// Optional: Get specific day's poem
export function getPoemForDay(dayOfYear: number): Poem {
  return DAILY_POEMS[dayOfYear % DAILY_POEMS.length];
}

