import { Scenario, ThemeBackgrounds } from './QuizTypes';

// Background themes with gradients
export const backgrounds: ThemeBackgrounds = {
  jungle: "bg-gradient-to-b from-kid-green-light to-kid-green",
  ocean: "bg-gradient-to-b from-kid-blue-light to-kid-blue",
  space: "bg-gradient-to-b from-kid-purple-light to-kid-purple",
  rainbow: "bg-gradient-to-b from-kid-pink-light to-kid-pink"
};

// Scenarios for "Who helps more?" quiz
export const scenarios: Scenario[] = [
  {
    question: "Who helps more?",
    situation: "A doctor's job is to...",
    options: [
      { text: "Cook delicious meals", isHelping: false },
      { text: "Fix broken cars", isHelping: false },
      { text: "Help sick people feel better", isHelping: true }
    ],
    feedback: {
      correct: "That's right! Doctors help sick people feel better!",
      incorrect: "Think about who you go to see when you're not feeling well."
    },
    hint: "Think about who takes care of you when you're sick.",
    imageUrl: "/images/doctor-helping.jpg"
  },
  {
    question: "Which job helps more?",
    situation: "What does a builder do?",
    options: [
      { text: "Build houses so people have a place to live", isHelping: true },
      { text: "Teach kids how to read", isHelping: false },
      { text: "Drive a fire truck", isHelping: false }
    ],
    feedback: {
      correct: "Yes! Builders make homes for people to live in!",
      incorrect: "Builders have an important job giving people places to live."
    },
    hint: "Think about who makes the buildings where we live and work.",
    imageUrl: "/images/builder-working.jpg"
  },
  {
    question: "Why is this job helpful?",
    situation: "Why do we need bakers?",
    options: [
      { text: "They make yummy bread and food for people to eat when they are hungry", isHelping: true },
      { text: "They help put out fires", isHelping: false },
      { text: "They take care of sick animals", isHelping: false }
    ],
    feedback: {
      correct: "Great job! Bakers make delicious food that feeds people when they're hungry!",
      incorrect: "Think about who makes bread and other yummy food."
    },
    hint: "Where does bread come from before it gets to the store?",
    imageUrl: "/images/baker-baking.jpg"
  }
];

// Scenarios for "What is Money?" quiz
export const moneyScenarios: Scenario[] = [
  {
    question: "What is money used for?",
    situation: "Money helps us...",
    options: [
      { text: "Buy things we need and want", isHelping: true },
      { text: "Play games with friends", isHelping: false },
      { text: "Take naps", isHelping: false }
    ],
    feedback: {
      correct: "Yes! Money helps us buy the things we need and want!",
      incorrect: "Think about what we use money for when we go to the store."
    },
    hint: "Think about what your parents use when they go shopping.",
    imageUrl: "/images/money-shopping.jpg"
  },
  {
    question: "Where does money come from?",
    situation: "Most people get money by...",
    options: [
      { text: "Finding it on the ground", isHelping: false },
      { text: "Working at jobs", isHelping: true },
      { text: "Growing it in gardens", isHelping: false }
    ],
    feedback: {
      correct: "That's right! Most people work at jobs to earn money!",
      incorrect: "Think about what grown-ups do to get money."
    },
    hint: "Think about where your parents go during the day to earn money.",
    imageUrl: "/images/working-job.jpg"
  },
  {
    question: "Why is saving money important?",
    situation: "Saving money helps us...",
    options: [
      { text: "Have money for big things later", isHelping: true },
      { text: "Build a money fort", isHelping: false },
      { text: "Make our piggy banks heavy", isHelping: false }
    ],
    feedback: {
      correct: "Great job! Saving money helps us buy bigger things later or handle emergencies!",
      incorrect: "Think about why it's good to keep some money instead of spending it all right away."
    },
    hint: "Think about waiting to buy something big that costs a lot.",
    imageUrl: "/images/saving-money.jpg"
  }
];

// Scenarios for "Wants vs. Needs" quiz
export const wantsVsNeedsScenarios: Scenario[] = [
  {
    question: "Which is a need?",
    situation: "We need these things to live:",
    options: [
      { text: "A video game", isHelping: false },
      { text: "Healthy food", isHelping: true },
      { text: "A new toy", isHelping: false }
    ],
    feedback: {
      correct: "Yes! Healthy food is something we need to live and be healthy!",
      incorrect: "Think about what you absolutely must have to stay healthy and alive."
    },
    hint: "Think about what keeps your body healthy and strong.",
    imageUrl: "/images/healthy-food.jpg"
  },
  {
    question: "Which is a want?",
    situation: "These things are nice to have but not necessary:",
    options: [
      { text: "Clean water", isHelping: false },
      { text: "A place to live", isHelping: false },
      { text: "A bicycle", isHelping: true }
    ],
    feedback: {
      correct: "That's right! A bicycle is fun to have, but we can live without it!",
      incorrect: "Think about what you could live without if you had to."
    },
    hint: "Think about things that are fun but not essential for survival.",
    imageUrl: "/images/bicycle.jpg"
  },
  {
    question: "Why is it important to know the difference?",
    situation: "Knowing wants from needs helps us...",
    options: [
      { text: "Make better choices with our money", isHelping: true },
      { text: "Have more fun at the store", isHelping: false },
      { text: "Get more toys", isHelping: false }
    ],
    feedback: {
      correct: "Great job! When we know what we truly need, we can make smarter choices with our money!",
      incorrect: "Think about how understanding needs and wants helps when deciding how to spend money."
    },
    hint: "Think about what happens when you spend all your money on things you want but forget things you need.",
    imageUrl: "/images/choices.jpg"
  }
];

// Scenarios for "Starting Your Business" quiz
export const businessScenarios: Scenario[] = [
  {
    question: "What do businesses do?",
    situation: "Businesses help by...",
    options: [
      { text: "Taking naps", isHelping: false },
      { text: "Solving problems for people", isHelping: true },
      { text: "Playing games all day", isHelping: false }
    ],
    feedback: {
      correct: "Yes! Businesses solve problems or provide things people want or need!",
      incorrect: "Think about why people go to stores or hire services."
    },
    hint: "Think about why people pay money to businesses.",
    imageUrl: "/images/business-help.jpg"
  },
  {
    question: "What's the first step to start a business?",
    situation: "To start a business, first you need...",
    options: [
      { text: "Lots of money", isHelping: false },
      { text: "A big building", isHelping: false },
      { text: "A good idea that helps people", isHelping: true }
    ],
    feedback: {
      correct: "That's right! Every business starts with a good idea that solves a problem!",
      incorrect: "Think about what you need before you can start selling anything."
    },
    hint: "Think about what comes before you can make or sell anything.",
    imageUrl: "/images/idea-lightbulb.jpg"
  },
  {
    question: "Why do businesses need customers?",
    situation: "Businesses need customers because...",
    options: [
      { text: "Customers pay money for products or services", isHelping: true },
      { text: "Customers help clean up the store", isHelping: false },
      { text: "Customers bring toys to share", isHelping: false }
    ],
    feedback: {
      correct: "Great job! Customers are important because they buy what businesses sell!",
      incorrect: "Think about why businesses want people to come to their store or website."
    },
    hint: "Think about what happens when people visit a business.",
    imageUrl: "/images/customers.jpg"
  }
];

// Scenarios for "Making a Snack" quiz
export const makingSnackScenarios: Scenario[] = [
  {
    question: "Which is safe to do when making a snack?",
    situation: "When making a snack, you should...",
    options: [
      { text: "Ask an adult before using sharp tools", isHelping: true },
      { text: "Rush so you can eat faster", isHelping: false },
      { text: "Leave everything out when you're done", isHelping: false }
    ],
    feedback: {
      correct: "Great job! Always ask an adult before using sharp tools!",
      incorrect: "It's important to be safe when making food. Adults can help with sharp tools."
    },
    hint: "Think about what keeps you safe in the kitchen.",
    imageUrl: "/images/kitchen-safety.jpg"
  },
  {
    question: "What should you do before making food?",
    situation: "Before touching food, you should...",
    options: [
      { text: "Play with your pet", isHelping: false },
      { text: "Wash your hands with soap", isHelping: true },
      { text: "Text your friends", isHelping: false }
    ],
    feedback: {
      correct: "That's right! Always wash your hands with soap before touching food!",
      incorrect: "Think about how to keep everything clean and germ-free."
    },
    hint: "Think about what keeps germs away from your food.",
    imageUrl: "/images/washing-hands.jpg"
  },
  {
    question: "What should you do after making a snack?",
    situation: "After enjoying your snack, you should...",
    options: [
      { text: "Leave the mess for later", isHelping: false },
      { text: "Run outside to play", isHelping: false },
      { text: "Clean up the area you used", isHelping: true }
    ],
    feedback: {
      correct: "Yes! Cleaning up after yourself is very important!",
      incorrect: "Think about what makes the kitchen nice for the next person who wants to use it."
    },
    hint: "Think about what makes the kitchen ready for someone else to use.",
    imageUrl: "/images/kitchen-cleanup.jpg"
  }
];

// Scenarios for "Keeping My Space Clean" quiz
export const keepingCleanScenarios: Scenario[] = [
  {
    question: "Why is it good to keep your room clean?",
    situation: "A clean room helps you...",
    options: [
      { text: "Find your things easier", isHelping: true },
      { text: "Have fewer toys", isHelping: false },
      { text: "Stay inside more", isHelping: false }
    ],
    feedback: {
      correct: "That's right! When your room is organized, you can find what you need quickly!",
      incorrect: "Think about what problems a messy room can cause."
    },
    hint: "Think about how you feel when you can't find something you want.",
    imageUrl: "/images/organized-room.jpg"
  },
  {
    question: "What's a good cleaning habit?",
    situation: "To keep things tidy, you should...",
    options: [
      { text: "Clean everything once a month", isHelping: false },
      { text: "Put things away when you're done using them", isHelping: true },
      { text: "Hide messes under your bed", isHelping: false }
    ],
    feedback: {
      correct: "Yes! Putting things away right after using them keeps spaces clean!",
      incorrect: "Think about what makes cleaning easier and faster."
    },
    hint: "Think about what's easier: cleaning a small mess now or a big mess later.",
    imageUrl: "/images/putting-away-toys.jpg"
  },
  {
    question: "What should you do with things you don't use anymore?",
    situation: "For toys and clothes you've outgrown...",
    options: [
      { text: "Keep them all forever", isHelping: false },
      { text: "Throw everything in the trash", isHelping: false },
      { text: "Donate them to someone who can use them", isHelping: true }
    ],
    feedback: {
      correct: "Great job! Donating things you don't need helps others and keeps your space clean!",
      incorrect: "Think about how your unused items might help someone else."
    },
    hint: "Think about how something you don't need might make someone else happy.",
    imageUrl: "/images/donating-toys.jpg"
  }
];

// Scenarios for "Getting Ready Like a Pro" quiz
export const gettingReadyScenarios: Scenario[] = [
  {
    question: "What helps you get ready faster in the morning?",
    situation: "To have a smooth morning, you should...",
    options: [
      { text: "Wait until the last minute to get up", isHelping: false },
      { text: "Prepare your clothes the night before", isHelping: true },
      { text: "Skip breakfast to save time", isHelping: false }
    ],
    feedback: {
      correct: "That's right! Preparing things the night before saves time in the morning!",
      incorrect: "Think about what can make mornings less rushed and stressful."
    },
    hint: "Think about what takes time in the morning that could be done earlier.",
    imageUrl: "/images/clothes-ready.jpg"
  },
  {
    question: "What's important for a good bedtime routine?",
    situation: "Before bed, it's good to...",
    options: [
      { text: "Play exciting video games", isHelping: false },
      { text: "Drink lots of sugary drinks", isHelping: false },
      { text: "Brush your teeth and have a regular bedtime", isHelping: true }
    ],
    feedback: {
      correct: "Yes! Brushing your teeth and having a regular bedtime helps you sleep well!",
      incorrect: "Think about what helps your body rest and be ready for sleep."
    },
    hint: "Think about what helps your body calm down and get ready to sleep.",
    imageUrl: "/images/bedtime-routine.jpg"
  },
  {
    question: "Why is it good to be independent with your routines?",
    situation: "When you can get ready by yourself...",
    options: [
      { text: "You feel proud and grown-up", isHelping: true },
      { text: "You can stay up later", isHelping: false },
      { text: "You don't have to follow rules", isHelping: false }
    ],
    feedback: {
      correct: "Great job! Being independent with your routines helps you feel proud and grown-up!",
      incorrect: "Think about how it feels when you can do something all by yourself."
    },
    hint: "Think about how you feel when you accomplish something without help.",
    imageUrl: "/images/independent-kid.jpg"
  }
];
