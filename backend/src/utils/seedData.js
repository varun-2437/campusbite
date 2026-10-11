import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { MenuItem } from '../models/MenuItem.js';
import { User } from '../models/User.js';
import { Inventory } from '../models/Inventory.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

export const seedMenuItems = [
  // 1. MAIN COURSE
  { itemId: 'mc-1', name: 'Mini Sambar Idly', category: 'Main Course', price: 50, isAvailable: true, prepTime: 5, isVeg: true, description: 'Bite-sized soft steamed idlies soaked in hot spiced aromatic sambar with ghee.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-2', name: 'Butter Masala Roast', category: 'Main Course', price: 85, isAvailable: true, prepTime: 8, isVeg: true, description: 'Crisp crepe roasted in rich dairy butter, stuffed with spiced potato masala.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-3', name: 'Butter Roast', category: 'Main Course', price: 70, isAvailable: true, prepTime: 6, isVeg: true, description: 'Golden crispy dosa roasted with generous dollops of butter, served with chutneys.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-4', name: 'Dosa (1)', category: 'Main Course', price: 20, isAvailable: true, prepTime: 5, isVeg: true, description: 'Traditional South Indian plain crispy dosa served with freshly ground coconut chutney.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-5', name: 'Ghee Masala Roast', category: 'Main Course', price: 95, isAvailable: true, prepTime: 8, isVeg: true, description: 'Signature crispy roast dosa made with pure Desi ghee and potato masala filling.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-6', name: 'Ghee Roast', category: 'Main Course', price: 70, isAvailable: true, prepTime: 6, isVeg: true, description: 'Aromatic golden dosa roasted crisp in pure ghee, served with sambar and two chutneys.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-7', name: 'Ghee Uthappam', category: 'Main Course', price: 65, isAvailable: true, prepTime: 7, isVeg: true, description: 'Thick, fluffy fermented rice pancake roasted with fragrant pure ghee.', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-8', name: 'Idly (1)', category: 'Main Course', price: 10, isAvailable: true, prepTime: 2, isVeg: true, description: 'Pillowy soft steamed rice and lentil cake, light on the stomach and healthy.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-9', name: 'Masala Fried Rice', category: 'Main Course', price: 75, isAvailable: true, prepTime: 10, isVeg: true, description: 'Wok-tossed basmati rice with mixed garden vegetables, aromatic spices, and curry leaves.', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-10', name: 'Masala Roast', category: 'Main Course', price: 75, isAvailable: true, prepTime: 7, isVeg: true, description: 'Classic thin crispy dosa folded over seasoned potato and onion stuffing.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-11', name: 'Onion Uthappam', category: 'Main Course', price: 65, isAvailable: true, prepTime: 7, isVeg: true, description: 'Soft thick uthappam generously topped with chopped shallots and coriander.', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-12', name: 'Parotta (1)', category: 'Main Course', price: 20, isAvailable: true, prepTime: 4, isVeg: true, description: 'Flaky, layered multi-fold Malabar parotta served hot with spicy kuruma.', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-13', name: 'Plain Roast', category: 'Main Course', price: 55, isAvailable: true, prepTime: 5, isVeg: true, description: 'Wafer-thin golden roast dosa made with fermented batter, served with chutneys.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-14', name: 'Podi Roast', category: 'Main Course', price: 65, isAvailable: true, prepTime: 6, isVeg: true, description: 'Crispy roast dosa coated with spicy gun powder (idli podi) and sesame oil.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-15', name: 'Podi Uthappam', category: 'Main Course', price: 65, isAvailable: true, prepTime: 7, isVeg: true, description: 'Spongy thick uthappam spiced with roasted lentil chili podi and ghee.', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-16', name: 'Poori (1)', category: 'Main Course', price: 16, isAvailable: true, prepTime: 5, isVeg: true, description: 'Puffy deep-fried golden whole-wheat poori served with potato masala bhaji.', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'mc-17', name: 'Schezwan Roast', category: 'Main Course', price: 85, isAvailable: true, prepTime: 8, isVeg: true, description: 'Indo-Chinese fusion dosa smeared with fiery spicy Schezwan sauce and veggies.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80' },

  // 2. TODAY'S SPECIAL
  { itemId: 'sp-1', name: 'Ghee Podi Idly', category: 'Today Special', price: 90, isAvailable: true, prepTime: 5, isVeg: true, description: 'Chef special mini idlies tossed in piping hot clarified butter and gun powder podi.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sp-2', name: 'Podi Idly', category: 'Today Special', price: 75, isAvailable: true, prepTime: 5, isVeg: true, description: 'Steamed rice idlies tossed with spicy roasted lentil podi and gingelly oil.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sp-3', name: 'Chilly Gobi', category: 'Today Special', price: 70, isAvailable: true, prepTime: 8, isVeg: true, description: 'Crisp fried cauliflower florets tossed with crunchy capsicum, green chilies, and soy sauce.', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sp-4', name: 'Gobi Manchurian', category: 'Today Special', price: 100, isAvailable: true, prepTime: 10, isVeg: true, description: 'Wok-tossed cauliflower dumplings in rich ginger-garlic Manchurian gravy with scallions.', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80' },

  // 3. CURRIES
  { itemId: 'cr-1', name: 'Veg Kuruma', category: 'Curries', price: 55, isAvailable: true, prepTime: 5, isVeg: true, description: 'Mildly spiced aromatic coconut milk gravy simmered with carrots, potatoes, and peas.', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80' },

  // 4. BAKES & SNACKS
  { itemId: 'bk-1', name: 'Burger', category: 'Bakes & Snacks', price: 60, isAvailable: true, prepTime: 7, isVeg: true, description: 'Golden spiced vegetable cutlet patty with mayo, lettuce, and onion in a sesame bun.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-2', name: 'Cheese Cake', category: 'Bakes & Snacks', price: 25, isAvailable: true, prepTime: 2, isVeg: true, description: 'Sweet bakery slice cheesecake with crumbly biscuit crust and smooth cream filling.', imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-3', name: 'Chilly Bajji', category: 'Bakes & Snacks', price: 18, isAvailable: true, prepTime: 3, isVeg: true, description: 'Spicy banana pepper dipped in seasoned gram flour batter and deep-fried to golden perfection.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-4', name: 'Choco Roll', category: 'Bakes & Snacks', price: 25, isAvailable: true, prepTime: 2, isVeg: true, description: 'Crispy wafer pastry roll generously filled with creamy cocoa chocolate ganache.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-5', name: 'Coconut Bun', category: 'Bakes & Snacks', price: 20, isAvailable: true, prepTime: 2, isVeg: true, description: 'Oven-fresh bakery sweet bun stuffed with grated coconut and caramelized sugar.', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-6', name: 'Coconut Cookies', category: 'Bakes & Snacks', price: 10, isAvailable: true, prepTime: 1, isVeg: true, description: 'Handmade crisp golden tea-time biscuits packed with toasted coconut flakes.', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-7', name: 'Cream Bun', category: 'Bakes & Snacks', price: 25, isAvailable: true, prepTime: 2, isVeg: true, description: 'Soft fluffy bakery bun sliced and filled with luscious sweet vanilla butter cream.', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-8', name: 'Honey Cake', category: 'Bakes & Snacks', price: 25, isAvailable: true, prepTime: 2, isVeg: true, description: 'Traditional bakery sponge soaked in honey syrup, topped with mixed fruit jam and coconut.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-9', name: 'Masala Bonda', category: 'Bakes & Snacks', price: 15, isAvailable: true, prepTime: 3, isVeg: true, description: 'Spicy mashed potato ball seasoned with mustard, ginger, and curry leaves in chickpea batter.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-10', name: 'Mixture', category: 'Bakes & Snacks', price: 10, isAvailable: true, prepTime: 1, isVeg: true, description: 'Crispy South Indian snack mix with sev, boondi, fried peanuts, and curry leaves.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-11', name: 'Onion Bonda', category: 'Bakes & Snacks', price: 15, isAvailable: true, prepTime: 3, isVeg: true, description: 'Crunchy deep-fried onion fritters with green chilies, coriander, and cumin.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'bk-12', name: 'Sweet Roll', category: 'Bakes & Snacks', price: 20, isAvailable: true, prepTime: 2, isVeg: true, description: 'Soft rolled bakery pastry brushed with sugar glaze and fruity jam.', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80' },

  // 5. SWEETS & PUDDINGS
  { itemId: 'sw-1', name: 'Gulab Jamun Tin', category: 'Sweets & Puddings', price: 150, isAvailable: true, prepTime: 2, isVeg: true, description: 'Packaged tin of melt-in-the-mouth fried milk dough balls soaked in rose-flavored sugar syrup.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sw-2', name: 'Chandrakala', category: 'Sweets & Puddings', price: 30, isAvailable: true, prepTime: 2, isVeg: true, description: 'Half-moon shaped golden fried pastry stuffed with dry fruits and sweetened khoya.', imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sw-3', name: 'Ghee Soan Papdi', category: 'Sweets & Puddings', price: 163, isAvailable: true, prepTime: 2, isVeg: true, description: 'Flaky, thread-like traditional sweet made with pure ghee, gram flour, and crushed pistachios.', imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sw-4', name: 'Rasagula Tin', category: 'Sweets & Puddings', price: 131, isAvailable: true, prepTime: 2, isVeg: true, description: 'Spongy, juicy chhena cottage cheese dumplings in light fragrant cardamom syrup.', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'sw-5', name: 'Swechha Soan Papdi', category: 'Sweets & Puddings', price: 154, isAvailable: true, prepTime: 2, isVeg: true, description: 'Premium crisp fiber sweet confection infused with cardamom and almond slivers.', imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&auto=format&fit=crop&q=80' },

  // 6. HOT DRINKS
  { itemId: 'hd-1', name: 'Black Coffee', category: 'Hot Drinks', price: 15, isAvailable: true, prepTime: 3, isVeg: true, description: 'Bold, unsweetened or lightly sweetened South Indian dark roast coffee decoction.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-2', name: 'Black Tea', category: 'Hot Drinks', price: 15, isAvailable: true, prepTime: 3, isVeg: true, description: 'Refreshing hot brewed Nilgiri black tea infused with lemon or ginger.', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-3', name: 'Boost', category: 'Hot Drinks', price: 40, isAvailable: true, prepTime: 4, isVeg: true, description: 'Steaming cup of nutritious malted chocolate energy drink made with fresh boiled milk.', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-4', name: 'Bournvita', category: 'Hot Drinks', price: 40, isAvailable: true, prepTime: 4, isVeg: true, description: 'Classic chocolate malt health beverage blended hot with rich cow milk.', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-5', name: 'Chocos', category: 'Hot Drinks', price: 40, isAvailable: true, prepTime: 4, isVeg: true, description: 'Crunchy chocolate cereal scoops served with a warm bowl of sweet milk.', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-6', name: 'Coffee', category: 'Hot Drinks', price: 25, isAvailable: true, prepTime: 3, isVeg: true, description: 'Traditional piping hot South Indian filter coffee frothed in stainless steel davarah.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-7', name: 'Cornflakes', category: 'Hot Drinks', price: 40, isAvailable: true, prepTime: 4, isVeg: true, description: 'Golden toasted cornflakes served crisp with steaming sweet milk.', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-8', name: 'Horlicks', category: 'Hot Drinks', price: 40, isAvailable: true, prepTime: 4, isVeg: true, description: 'Warm malted barley health drink made creamy with freshly boiled milk.', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-9', name: 'Hot Badam Milk', category: 'Hot Drinks', price: 40, isAvailable: true, prepTime: 4, isVeg: true, description: 'Creamy warm almond milk flavored with aromatic saffron and crushed badam nuts.', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-10', name: 'Hot Milk', category: 'Hot Drinks', price: 12, isAvailable: true, prepTime: 2, isVeg: true, description: 'Fresh boiled pure milk served hot with sugar or plain on request.', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-11', name: 'Sukku Coffee', category: 'Hot Drinks', price: 15, isAvailable: true, prepTime: 3, isVeg: true, description: 'Traditional digestive herbal decoction with dry ginger, pepper, coriander, and jaggery.', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'hd-12', name: 'Tea', category: 'Hot Drinks', price: 15, isAvailable: true, prepTime: 3, isVeg: true, description: 'Strong, aromatic cutting chai brewed with fresh milk, cardamom, and ginger.', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80' },

  // 7. JUICES & MILKSHAKES
  { itemId: 'jm-1', name: 'Butter Milk', category: 'Juices & Milkshakes', price: 15, isAvailable: true, prepTime: 2, isVeg: true, description: 'Chilled spiced buttermilk tempered with crushed ginger, green chili, and curry leaves.', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-2', name: 'Grape Juice', category: 'Juices & Milkshakes', price: 45, isAvailable: true, prepTime: 4, isVeg: true, description: 'Freshly pressed cold Bangalore blue grape juice served chilled.', imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-3', name: 'Guava Juice', category: 'Juices & Milkshakes', price: 45, isAvailable: true, prepTime: 4, isVeg: true, description: 'Thick pink guava fruit nectar blended smooth with a pinch of black salt.', imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-4', name: 'Lime Juice', category: 'Juices & Milkshakes', price: 25, isAvailable: true, prepTime: 3, isVeg: true, description: 'Refreshing fresh lime juice made with mint and choice of sweet or salted.', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-5', name: 'Musk Melon Juice', category: 'Juices & Milkshakes', price: 35, isAvailable: true, prepTime: 4, isVeg: true, description: 'Fragrant, naturally sweet chilled cantaloupe musk melon fruit shake.', imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-6', name: 'Papaya Juice', category: 'Juices & Milkshakes', price: 35, isAvailable: true, prepTime: 4, isVeg: true, description: 'Cold blended ripe papaya juice, packed with vitamins and natural fruit sweetness.', imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-7', name: 'Rose Milk', category: 'Juices & Milkshakes', price: 25, isAvailable: true, prepTime: 3, isVeg: true, description: 'Chilled refreshing pink milk drink flavored with fragrant damask rose syrup.', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'jm-8', name: 'Watermelon Juice', category: 'Juices & Milkshakes', price: 30, isAvailable: true, prepTime: 4, isVeg: true, description: 'Hydrating 100% natural cold watermelon juice, freshly juiced on order.', imageUrl: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500&auto=format&fit=crop&q=80' },

  // 8. ICE CREAMS
  { itemId: 'ic-1', name: 'Almond Caramel Stick', category: 'Ice Creams', price: 85, isAvailable: true, prepTime: 2, isVeg: true, description: 'Vanilla ice cream bar coated with crunchy roasted almond chunks and thick caramel chocolate.', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-2', name: 'American Sandwich Stick', category: 'Ice Creams', price: 35, isAvailable: true, prepTime: 2, isVeg: true, description: 'Creamy dairy ice cream sandwiched between two dark chocolate wafer biscuits on a stick.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-3', name: 'Blackcurrant Cone', category: 'Ice Creams', price: 35, isAvailable: true, prepTime: 2, isVeg: true, description: 'Crispy wafer cone filled with tangy blackcurrant berry swirl ice cream and chocolate tip.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-4', name: 'Butterscotch Cone', category: 'Ice Creams', price: 45, isAvailable: true, prepTime: 2, isVeg: true, description: 'Classic butterscotch ice cream cone studded with crunchy caramelized cashew praline.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-5', name: 'Butterscotch Cone B.R', category: 'Ice Creams', price: 85, isAvailable: true, prepTime: 2, isVeg: true, description: 'Premium rich Baskin-Robbins style butterscotch ice cream waffle cone topped with caramel drizzle.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-6', name: 'Chocolate Cup', category: 'Ice Creams', price: 15, isAvailable: true, prepTime: 2, isVeg: true, description: 'Individual cup of silky smooth, velvety dark chocolate dairy ice cream.', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-7', name: 'Classic Vanilla B.R', category: 'Ice Creams', price: 65, isAvailable: true, prepTime: 2, isVeg: true, description: 'Rich Bourbon Madagascar vanilla bean ice cream in a specialty cone.', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-8', name: 'Cotton Candy B.R', category: 'Ice Creams', price: 80, isAvailable: true, prepTime: 2, isVeg: true, description: 'Whimsical swirl of pink and blue carnival cotton candy flavored ice cream.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-9', name: 'Guava Chilli Sorbet', category: 'Ice Creams', price: 15, isAvailable: true, prepTime: 2, isVeg: true, description: 'Exotic refreshing pink guava fruit sorbet stick dusted with mild spicy chili powder.', imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-10', name: 'Magic Bar', category: 'Ice Creams', price: 25, isAvailable: true, prepTime: 2, isVeg: true, description: 'Vanilla cream ice cream bar coated in crackling crisp chocolate magic shell.', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-11', name: 'Malai Kulfi', category: 'Ice Creams', price: 40, isAvailable: true, prepTime: 2, isVeg: true, description: 'Traditional slow-simmered rabri kulfi on a stick infused with green cardamom and saffron.', imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-12', name: 'Mango Candy', category: 'Ice Creams', price: 10, isAvailable: true, prepTime: 2, isVeg: true, description: 'Real Alphonso mango pulp frozen ice pop, sweet, fruity, and nostalgic.', imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-13', name: 'Pista Badam Cone', category: 'Ice Creams', price: 45, isAvailable: true, prepTime: 2, isVeg: true, description: 'Royal pistachio and almond flavored ice cream cone topped with chopped nuts.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-14', name: 'Raspberry Candy', category: 'Ice Creams', price: 10, isAvailable: true, prepTime: 2, isVeg: true, description: 'Sweet and tangy frozen raspberry fruit juice ice lollipop.', imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-15', name: 'Vanilla Cup', category: 'Ice Creams', price: 10, isAvailable: true, prepTime: 2, isVeg: true, description: 'Single-serve cup of creamy sweet vanilla bean dairy ice cream.', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80' },
  { itemId: 'ic-16', name: 'Vanilla Cone', category: 'Ice Creams', price: 20, isAvailable: true, prepTime: 2, isVeg: true, description: 'Crispy wafer cone filled with classic vanilla ice cream and crunchy chocolate core.', imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80' }
];

async function seedDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // 1. Seed Menu Items
    console.log(`Seeding ${seedMenuItems.length} cafeteria menu items...`);
    await MenuItem.deleteMany({});
    const insertedMenu = await MenuItem.insertMany(seedMenuItems);
    console.log(`✅ Inserted ${insertedMenu.length} menu items into Atlas!`);

    // 2. Seed Staff Accounts
    console.log('Seeding staff accounts...');
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const staffUsers = [
      { name: 'Store Manager (Varun)', email: 'varun.manager@campusbite.com', password: hashedPassword, role: 'manager', shift: 'Admin' },
      { name: 'Cashier Staff', email: 'gokul.cashier@campusbite.com', password: hashedPassword, role: 'cashier', shift: 'Morning' },
      { name: 'Kitchen Head Chef', email: 'anthony.kitchen@campusbite.com', password: hashedPassword, role: 'kitchen', shift: 'All-Day' },
      { name: 'Juice Bar Specialist', email: 'ravi.juice@campusbite.com', password: hashedPassword, role: 'beverage', shift: 'Morning' },
      { name: 'Order Handover Staff', email: 'divya.counter@campusbite.com', password: hashedPassword, role: 'counter', shift: 'Evening' },
      { name: 'Student Krithik', email: 'krithik.student@campusbite.com', password: hashedPassword, role: 'student', shift: 'Day' }
    ];
    await User.insertMany(staffUsers);
    console.log(`✅ Inserted ${staffUsers.length} users into Atlas!`);

    // 3. Seed Initial Inventory
    console.log('Seeding inventory records...');
    await Inventory.deleteMany({});
    const inventoryItems = [
      { itemName: 'Idly & Dosa Batter', quantity: 60, threshold: 25, unit: 'liters', category: 'Batter' },
      { itemName: 'Pure Desi Ghee', quantity: 18, threshold: 8, unit: 'kg', category: 'Dairy' },
      { itemName: 'Butter Blocks', quantity: 14, threshold: 10, unit: 'kg', category: 'Dairy' },
      { itemName: 'Fresh Milk', quantity: 35, threshold: 20, unit: 'liters', category: 'Dairy' },
      { itemName: 'Cauliflower (Gobi)', quantity: 25, threshold: 10, unit: 'kg', category: 'Vegetables' },
      { itemName: 'Bakery Buns & Rolls', quantity: 45, threshold: 15, unit: 'pcs', category: 'Bakery' },
      { itemName: 'Ice Cream Cones & Tubs', quantity: 80, threshold: 30, unit: 'pcs', category: 'Frozen' },
      { itemName: 'Filter Coffee Powder & Tea', quantity: 15, threshold: 5, unit: 'kg', category: 'Pantry' }
    ];
    await Inventory.insertMany(inventoryItems);
    console.log(`✅ Inserted ${inventoryItems.length} inventory records into Atlas!`);

    console.log('==============================================');
    console.log('🎉 MongoDB Atlas Database seeding completed successfully!');
    console.log('==============================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding MongoDB Atlas:', err);
    process.exit(1);
  }
}

seedDatabase();
