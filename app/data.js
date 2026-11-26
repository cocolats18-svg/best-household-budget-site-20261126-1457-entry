// Seed data for the Marlowe household budget, November 2026.
// All figures are the family's own monthly numbers. The app loads this
// seed once, then keeps the family's edits in localStorage.

export const HOUSEHOLD = {
  name: 'The Marlowe Household',
  members: ['Maya Marlowe', 'Tom Marlowe', 'Leo Marlowe', 'June Marlowe'],
  month: 'November 2026',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', color: '#2e7d5b' },
  { id: 'dining', label: 'Dining out', color: '#c2703d' },
  { id: 'transport', label: 'Transport', color: '#3d6fb4' },
  { id: 'housing', label: 'Housing', color: '#6a4fa3' },
  { id: 'utilities', label: 'Utilities', color: '#b49a2e' },
  { id: 'entertainment', label: 'Entertainment', color: '#b44d7a' },
  { id: 'health', label: 'Health', color: '#3d8f8a' },
  { id: 'clothing', label: 'Clothing', color: '#7a6a58' },
  { id: 'other', label: 'Other', color: '#8a8f98' },
];

export const INCOME = [
  { id: 'inc-1', source: "Maya's salary — school librarian", amount: 3420, day: 1 },
  { id: 'inc-2', source: "Tom's salary — electrician", amount: 4150, day: 15 },
  { id: 'inc-3', source: 'Weekend market stall (crafts)', amount: 260, day: 21 },
];

export const BUDGETS = [
  { category: 'groceries', limit: 720 },
  { category: 'dining', limit: 240 },
  { category: 'transport', limit: 310 },
  { category: 'housing', limit: 1650 },
  { category: 'utilities', limit: 290 },
  { category: 'entertainment', limit: 150 },
  { category: 'health', limit: 180 },
  { category: 'clothing', limit: 120 },
  { category: 'other', limit: 100 },
];

export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Rent — November', category: 'housing', amount: 1650, kind: 'expense' },
  { id: 't02', date: '2026-11-01', description: "Maya's salary", category: 'other', amount: 3420, kind: 'income' },
  { id: 't03', date: '2026-11-02', description: 'Green Mart weekly shop', category: 'groceries', amount: 148.20, kind: 'expense' },
  { id: 't04', date: '2026-11-03', description: 'Bus passes — Maya & Tom', category: 'transport', amount: 96, kind: 'expense' },
  { id: 't05', date: '2026-11-04', description: 'Electric bill — October usage', category: 'utilities', amount: 132.40, kind: 'expense' },
  { id: 't06', date: '2026-11-05', description: 'Pizza night with the kids', category: 'dining', amount: 41.50, kind: 'expense' },
  { id: 't07', date: '2026-11-06', description: 'Pharmacy — June inhaler refill', category: 'health', amount: 28.75, kind: 'expense' },
  { id: 't08', date: '2026-11-07', description: 'Farmers market vegetables', category: 'groceries', amount: 62.10, kind: 'expense' },
  { id: 't09', date: '2026-11-08', description: 'Cinema — family film', category: 'entertainment', amount: 38, kind: 'expense' },
  { id: 't10', date: '2026-11-09', description: 'Green Mart weekly shop', category: 'groceries', amount: 171.85, kind: 'expense' },
  { id: 't11', date: '2026-11-10', description: 'Internet & phone bundle', category: 'utilities', amount: 89, kind: 'expense' },
  { id: 't12', date: '2026-11-11', description: 'Petrol — Tom van', category: 'transport', amount: 54.30, kind: 'expense' },
  { id: 't13', date: '2026-11-12', description: 'School lunch money — Leo & June', category: 'other', amount: 40, kind: 'expense' },
  { id: 't14', date: '2026-11-13', description: 'Dentist check-up — Leo', category: 'health', amount: 65, kind: 'expense' },
  { id: 't15', date: '2026-11-14', description: 'Takeaway Thai', category: 'dining', amount: 36.80, kind: 'expense' },
  { id: 't16', date: '2026-11-15', description: "Tom's salary", category: 'other', amount: 4150, kind: 'income' },
  { id: 't17', date: '2026-11-16', description: 'Green Mart weekly shop', category: 'groceries', amount: 159.60, kind: 'expense' },
  { id: 't18', date: '2026-11-17', description: 'Winter coats — Leo & June', category: 'clothing', amount: 112, kind: 'expense' },
  { id: 't19', date: '2026-11-18', description: 'Water bill', category: 'utilities', amount: 47.20, kind: 'expense' },
  { id: 't20', date: '2026-11-19', description: 'Board game night supplies', category: 'entertainment', amount: 24.90, kind: 'expense' },
  { id: 't21', date: '2026-11-20', description: 'Petrol — Tom van', category: 'transport', amount: 48.75, kind: 'expense' },
  { id: 't22', date: '2026-11-21', description: 'Weekend market stall takings', category: 'other', amount: 260, kind: 'income' },
  { id: 't23', date: '2026-11-22', description: 'Green Mart weekly shop', category: 'groceries', amount: 143.55, kind: 'expense' },
  { id: 't24', date: '2026-11-23', description: 'Sunday lunch out — grandparents visiting', category: 'dining', amount: 74.20, kind: 'expense' },
  { id: 't25', date: '2026-11-24', description: 'Gym membership — Maya', category: 'health', amount: 32, kind: 'expense' },
  { id: 't26', date: '2026-11-25', description: 'Library book sale donation', category: 'other', amount: 15, kind: 'expense' },
  { id: 't27', date: '2026-11-25', description: 'Streaming — family plan', category: 'entertainment', amount: 15.99, kind: 'expense' },
];

export const BILLS = [
  { id: 'b1', name: 'Rent', amount: 1650, due: '2026-11-01', paid: true, note: 'Direct debit, 1st of the month' },
  { id: 'b2', name: 'Electricity', amount: 132.40, due: '2026-11-04', paid: true, note: 'October usage, meter read 28 Oct' },
  { id: 'b3', name: 'Internet & phone bundle', amount: 89, due: '2026-11-10', paid: true, note: 'Fibre 500 + two mobiles' },
  { id: 'b4', name: 'Water', amount: 47.20, due: '2026-11-18', paid: true, note: 'Quarterly, due 18 Nov' },
  { id: 'b5', name: 'Home insurance', amount: 58.50, due: '2026-11-27', paid: false, note: 'Annual policy, monthly instalment' },
  { id: 'b6', name: 'Car insurance — Tom van', amount: 74, due: '2026-11-28', paid: false, note: 'Monthly instalment' },
  { id: 'b7', name: 'Streaming — family plan', amount: 15.99, due: '2026-11-25', paid: true, note: 'Renews 25th' },
  { id: 'b8', name: 'Gym — Maya', amount: 32, due: '2026-11-26', paid: false, note: 'Monthly, cancel anytime' },
];

export const GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 6000, saved: 4210, note: 'Three months of essentials, for peace of mind.' },
  { id: 'g2', name: 'Family holiday — seaside, July', target: 2400, saved: 1185, note: 'A week by the sea with the grandparents.' },
  { id: 'g3', name: 'New sofa', target: 900, saved: 640, note: 'The old one has survived two kids and a dog.' },
  { id: 'g4', name: "Kids' school fund", target: 1500, saved: 375, note: 'Trips, uniforms and new shoes as they grow.' },
];

export const MONTHLY_TOTALS = [
  { month: 'Jun', income: 7620, spending: 3410 },
  { month: 'Jul', income: 7790, spending: 3680 },
  { month: 'Aug', income: 7710, spending: 3590 },
  { month: 'Sep', income: 7830, spending: 3725 },
  { month: 'Oct', income: 7680, spending: 3490 },
  { month: 'Nov', income: 7830, spending: 3327 },
];

export function seedState() {
  return {
    transactions: structuredClone(TRANSACTIONS),
    bills: structuredClone(BILLS),
    goals: structuredClone(GOALS),
    budgets: structuredClone(BUDGETS),
  };
}
