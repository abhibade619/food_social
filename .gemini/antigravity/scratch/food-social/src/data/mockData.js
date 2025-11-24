export const currentUser = {
  id: 'u1',
  name: 'Alex Gourmet',
  handle: '@alexgourmet',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  stats: {
    logs: 42,
    followers: 128,
    following: 85
  },
  country: 'USA',
  state: 'NY',
  hitList: []
};

export const mockUsers = [
  currentUser,
  {
    id: 'u2',
    name: 'Sarah Eats',
    handle: '@saraheats',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    stats: { logs: 15, followers: 45, following: 20 },
    country: 'USA',
    state: 'CA'
  },
  {
    id: 'u3',
    name: 'Mike Burger',
    handle: '@mikeburger',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
    stats: { logs: 8, followers: 12, following: 5 },
    country: 'UK',
    state: 'London'
  },
  {
    id: 'u4',
    name: 'Jessica Vegan',
    handle: '@jessvegan',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024e',
    stats: { logs: 32, followers: 200, following: 150 },
    country: 'USA',
    state: 'OR'
  },
  {
    id: 'u5',
    name: 'Chef Tom',
    handle: '@cheftom',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024f',
    stats: { logs: 150, followers: 5000, following: 10 },
    country: 'France',
    state: 'Paris'
  }
];

// Helper to calculate internal score (1-10 scale)
export const calculateInternalScore = (log) => {
  const scores = {
    'poor': 0,
    'okay': 1,
    'good': 2,
    'amazing': 3
  };
  const returnScores = {
    'no': 0,
    'maybe': 1.5,
    'yes': 3
  };

  let totalScore = 0;
  let maxScore = 0;

  // Common metrics
  totalScore += scores[log.ratings.food] || 0;
  maxScore += 3;

  totalScore += scores[log.ratings.value] || 0;
  maxScore += 3;

  totalScore += returnScores[log.ratings.return_intent] || 0;
  maxScore += 3;

  // Dynamic metrics based on visit type
  if (log.visitType === 'Dine In') {
    totalScore += scores[log.ratings.service] || 0;
    maxScore += 3;

    totalScore += scores[log.ratings.ambience] || 0;
    maxScore += 3;
  } else if (log.visitType === 'Take Out') {
    totalScore += scores[log.ratings.packaging] || 0;
    maxScore += 3;

    totalScore += scores[log.ratings.store_service] || 0;
    maxScore += 3;
  } else if (log.visitType === 'Delivery') {
    totalScore += scores[log.ratings.packaging] || 0;
    maxScore += 3;
  }

  // Normalize to 1-10
  return ((totalScore / maxScore) * 10).toFixed(1);
};

export const initialLogs = [
  {
    id: 'l1',
    userId: 'u2',
    user: {
      name: 'Sarah Eats',
      handle: '@saraheats',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    },
    restaurant: 'Pasta Paradise',
    location: 'Downtown',
    cuisine: 'Italian',
    visitType: 'Dine In',
    date: '2023-10-25',
    ratings: {
      food: 'amazing',
      service: 'good',
      ambience: 'amazing',
      value: 'good',
      return_intent: 'yes'
    },
    content: 'The best carbonara I have ever had! The atmosphere was cozy and the service was impeccable. Highly recommend the truffle pasta.',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'l2',
    userId: 'u3',
    user: {
      name: 'Mike Burger',
      handle: '@mikeburger',
      avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d'
    },
    restaurant: 'Burger Joint',
    location: 'Westside',
    cuisine: 'Burgers',
    visitType: 'Take Out',
    date: '2023-10-24',
    ratings: {
      food: 'good',
      packaging: 'okay',
      store_service: 'good',
      value: 'amazing',
      return_intent: 'yes'
    },
    content: 'Solid burger, but the fries were a bit soggy. Still a great spot for a quick lunch.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'l3',
    userId: 'u1',
    user: {
      name: 'Alex Gourmet',
      handle: '@alexgourmet',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    restaurant: 'Sushi Master',
    location: 'Uptown',
    cuisine: 'Japanese',
    visitType: 'Dine In',
    date: '2023-10-23',
    ratings: {
      food: 'amazing',
      service: 'amazing',
      ambience: 'good',
      value: 'okay',
      return_intent: 'yes'
    },
    content: 'Omakase was an experience! Fresh fish, amazing presentation.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
].map(log => ({ ...log, internalScore: calculateInternalScore(log) }));

export const mockCities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "San Francisco, CA",
  "Charlotte, NC",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Mesa, AZ",
  "Sacramento, CA",
  "Atlanta, GA",
  "Kansas City, MO",
  "Colorado Springs, CO",
  "Miami, FL",
  "Raleigh, NC",
  "Omaha, NE",
  "Long Beach, CA",
  "Virginia Beach, VA",
  "Oakland, CA",
  "Minneapolis, MN",
  "Tulsa, OK",
  "Arlington, TX",
  "Tampa, FL",
  "New Orleans, LA"
];
