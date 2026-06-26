/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, VenueSpace } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'heritage-platter',
    title: 'The Heritage Club Platter',
    description: 'A delicious platter of four fresh club sandwiches, layered with tender charcoal-grilled chicken breast, fresh lettuce, and our special garlic mayo, served with crispy french fries.',
    price: 'Rs. 7,800',
    category: 'Gastronomy',
    signature: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu2LV7OtGMooVHXa7iJwvrUkB_XM886Dtk4jiwD775aYOLx1mTqRSAlnlDacAwlOnFC-A3252mVZITNIbeJ2j3Jrf6G60IwnafXqRUAyNloGSDFsq-eVwPGiOnnLwXmBsAs6zyJQjweX5Nvl5Um8xNjIDypVtHER4LW5damVHWKmfnqYTbtvK_UdBr3OwIH-S1w73s7EAZiSZmaV67RPpLDib2dlUQDybhW9OYRtkyWkrj23MQD8GGNSjD1Rtyb2fqDoRJCRfr42w'
  },
  {
    id: 'saffron-rice',
    title: 'Imperial Saffron Rice',
    description: 'Fragrant long-grain basmati tossed with fire-roasted chicken chunks and local scallions.',
    price: 'Rs. 5,100',
    category: 'Gastronomy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqv0xphv18nn8xsemRrSkt3DtNBT0gs_qZR9hyxUvVy8_BdYYKrm6O0AfEm-h5zAWjUAAnH98f9dLxpFxUZz3gwa9qnG4xXkUCxHa8bmjCVfNqdYtBAJhkZqG5TXQlnT_ScfdvHt8VNqORzVzcW1M3Kqd1m6nocqEs05OxOpojM-M7W_qr0xvJaJndO1zGdbU1X4ZUTdBYYaRGojF7ZpINFXkEY0EgxuQQ88fOUrFe5g2sMhL4Sl4aPEDtfV8s39dFXAZMDDRDAPA'
  },
  {
    id: 'lamb-karahi',
    title: 'Shinwari Lamb Karahi',
    description: 'Slow-cooked in a traditional iron wok with ginger, black pepper, and fresh tomatoes. Classic Shinwari style.',
    price: 'Rs. 9,500',
    category: 'Shinwari',
    tags: ['TRADITIONAL', 'MILD']
  },
  {
    id: 'ganache-sphere',
    title: 'Noir Ganache Sphere',
    description: '70% dark cocoa with gold leaf.',
    price: 'Rs. 3,300',
    category: 'Patisserie',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD43ICgbfLXY5CjOJD-9XgaVUYEZyGp2JR5gY3gZsAhyH347NjrLu1tRsHJ-eOS594Kl63IPv9ByZzgmCOxUWIoh-sPrALOmouHrsS6x0vFghRa84I6CaJBwr7nVdLCwuy89oPsjxSbdVbQTfZYvCu7Ks2E4xyzOx73IbH-Sl6q0Q8foL19qXM1Q43_LvLR--vwAMf-SIc8D-j6bKFEvILJHQEpKjmCYoUOlJI7SpTDVmDMeHgHkK0xNkXWemQJ__YRhLzk-zawCw4'
  },
  {
    id: 'smoked-sizzler',
    title: 'Smoked Sizzler',
    description: 'Infused with applewood and wild peppers, cooked slowly on open flame.',
    price: 'Rs. 7,200',
    category: 'BBQ',
    tags: ['NEW ARRIVAL', 'SMOKY']
  },
  {
    id: 'fire-tikka',
    title: 'Fire-Kissed Tikka',
    description: 'A close-up of a sizzling plate of chicken tikka, with vibrant bell peppers and onions charred to perfection.',
    price: 'Rs. 6,700',
    category: 'BBQ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTo_Uz6Z3um866-5XRuE1gSIJHjL4PWB4jueajldE9rt14C84y9cwQZHIS_Epn8xWYOxkj1_a_U_GsWaVuKsBQFDEh47h7WwTZAoGKQBg6hDc0KMcpH2_Ix-R0Y9tE065a9VQGHwq0Smna_o2xC0Crt9cSlw7ma3Yi0rOuYNlsx0w8Pfml7CKNJ4YpRjlzO7CM9SvnBtJqgKC7iHmAYJkaBQdsg7OAkZIie3Y_rwJKLyxuOOxCDw5jRKXAne1_6JfrE3xi_yzL5GM'
  },
  {
    id: 'royal-platter',
    title: 'The Royal Platter',
    description: 'A large premium platter featuring seven of our signature grilled meats served with aromatic rice.',
    price: 'Rs. 23,600',
    category: 'International',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5QIkaeQt1Gbihrs7YirBU1B41INQM2yc2QPxuRiP5Fvt4iAcmjZksUoLTMMvh-wmMkHou7fHTu0qoNbYjPt1xfIQttnS2gbo3432QwVvdRrrmexgqMV4JL1GU5lmgx4nqzR4kN3OeGXlnGXX_KBge93Yrw2T8jRuMsQN0nCY8xN8YVtf_iHMjGQb1i3ujggwWxzsUMSVEo8R67p4hTqfcSNBJCqXfFt1gHhNK_HTzkYflLWGfVtf20hxmvDTk0TSnDM_tQTYxmNo'
  },
  {
    id: 'truffle-ribeye',
    title: 'Truffle Wagyu Ribeye',
    description: 'Pan-seared premium Wagyu beef glazed with rich truffle butter and premium sea salt.',
    price: 'Rs. 20,000',
    category: 'International'
  }
];

export const VENUE_SPACES: VenueSpace[] = [
  {
    id: 'grand-lawn',
    name: 'The Grand Lawn',
    subtitle: 'Beautiful Outdoor Area',
    description: 'A beautiful, spacious green lawn perfect for family events and outdoor dining under the sky. Enjoy the fresh air and beautiful lighting.',
    capacity: 'Up to 150 Guests',
    type: 'Outdoor Sanctuary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwsxhcPZ6QCYciq9F674Ng6o1IKCWqiJMFIJp2hC00dyCVPWah8H-ve2PhRWAfSMLapvFl1geeH0yhqwQkx0ZfVNQzjke-LiCwvYAUTAur_XByS1QKimcrM5NHslUoLbSqJlJv-LHx_n4dz9lQsXtZ-nnOQ7RHUozDOF08iZQUEfoGucPczyWCUXPub7O3WUuad_s57-B-vldgb_5My8fKfX80O7hVJFOo2TiZFCSnyaVffBWZ9wyfJfmYxAJImgaW3clNNlabJJQ',
    features: ['Starry Night Backdrop', 'Soft Illumination']
  },
  {
    id: 'family-sitting',
    name: 'Family Sitting',
    subtitle: 'Cozy Family Sitting',
    description: 'Designed for families, these cozy sitting areas offer comfortable, private seating to enjoy your meals and conversations in complete peace.',
    capacity: '12 Guests',
    type: 'Lounge Comfort',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZk8XbnYDBjnJHA35UFASsaZ-A3cQO-EGpF5MUQtVuWXgI5F5reexkHewJ4qRxRz9VoUpy_yjRVuRh18-2H38-Yn1pxuAaaF3s57Dv67DPDqPJLZyvLefDULBHIz4ixn3ohwpDmwRLJJuLn5viuZbdmCcRAsme_6jtXeJhe_e6GYtNjSSfRhglqnSIu_Ha5ojLmWWEf7k2_Y2M9X92Gdyq_P4FpHOUY04ZKwyFFnLPJ3OBAxdJL3PQBYu5njrwSBDPT0cKArc1iqo',
    features: ['Recessed Fireplace Glow', 'Climate Controlled']
  },
  {
    id: 'premium-sitting',
    name: 'Premium Sitting',
    subtitle: 'VIP Private Dining',
    description: 'Our premium dining experience. Features a dedicated waiter, luxury seating, and a beautiful panoramic view of the lawn.',
    capacity: '6 Guests',
    type: 'Private VIP Room',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1cF4yY8Dz84dFmyiB5S8yP08iIUP_hsxKCOcCxl4Xk8qj56ueO5OfJGetwzv7Na5QmdBB_yGmWc_EuDlN6THZehMKnYfc6wpOysQRJwczSbyVkha9N1q3hVJh5znaREXgZDfa2LP1GMQ-Md1H4D6ku0ydbN9Ou6vQGEipRpvk48SubbBQ0M7ItuCA-EEF3MjXuqLv_c_8jA1pEz92-vViRZDturX_-E7KFx_8WndCSj4ZyPAxFm8jFJW2cMeJUKWPQJORUqTXNx8',
    features: ['Personal Concierge Team', 'Panoramic Estate Views']
  }
];
