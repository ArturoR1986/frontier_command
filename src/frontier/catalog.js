export const SCHEMA = 3;
export const RESOURCES = ['wood', 'stone', 'ore', 'food', 'meals', 'parts', 'fuel', 'medicine', 'crystal'];
export const ROLES = ['build', 'gather', 'grow', 'cook', 'craft', 'research', 'care', 'pilot'];
// Costs are physical inputs. Work is seconds at skill zero, before breaks and hauling.
export const STRUCTURES = {
  core: { name: 'Colony hearth', w: 5, h: 4, cost: { wood: 100, stone: 70 }, work: 180, hp: 1800, storage: true, beds: 4, description: 'The colony seat. Stores supplies and shelters four founders.' },
  stockpile: { name: 'Stockyard', w: 4, h: 3, cost: { wood: 12 }, work: 20, hp: 250, storage: true, description: 'A nearby drop-off shortens every gathering and construction trip.' },
  wall: { name: 'Stone wall', w: 1, h: 1, cost: { stone: 4 }, work: 8, hp: 700, description: 'Blocks walking and fire. Place doors for access.' },
  door: { name: 'Timber door', w: 1, h: 1, cost: { wood: 6 }, work: 10, hp: 220, pass: true, description: 'Friendly workers pass; hostile units must break through.' },
  floor: { name: 'Timber floor', w: 1, h: 1, cost: { wood: 2 }, work: 3, hp: 100, pass: true, description: 'Dry, comfortable footing. Improves nearby rest and work.' },
  bed: { name: 'Personal bed', w: 1, h: 2, cost: { wood: 12 }, work: 18, hp: 120, beds: 1, description: 'Assign a home to reduce walking. Enclosed bedrooms restore rest faster.' },
  table: { name: 'Gathering table', w: 2, h: 2, cost: { wood: 18 }, work: 25, hp: 150, description: 'Shared meals restore belonging. Nearby residents form friendships.' },
  field: { name: 'Growing plot', w: 5, h: 5, cost: {}, work: 20, hp: 180, pass: true, description: 'Plant and tend food. Fertile soil improves harvest; crops need labor.' },
  kitchen: { name: 'Cookhouse', w: 3, h: 3, cost: { wood: 32, stone: 15 }, work: 90, hp: 420, recipe: 'meals', description: 'A cook turns two raw food into two nourishing meals.' },
  clinic: { name: 'Care lodge', w: 4, h: 3, cost: { wood: 40, stone: 25 }, work: 140, hp: 520, beds: 2, description: 'A caregiver spends medicine or food to treat wounds and restore specialists.' },
  workshop: { name: 'Machine workshop', w: 4, h: 4, cost: { wood: 40, stone: 35, ore: 30 }, work: 220, hp: 620, recipe: 'parts', description: 'Turns ore into parts. Craft skill improves production and repairs.' },
  laboratory: { name: 'Study hall', w: 4, h: 3, cost: { wood: 50, stone: 30 }, work: 180, hp: 480, description: 'Assigned researchers unlock tools, medicine, transport and robotics.' },
  generator: { name: 'Fuel turbine', w: 3, h: 3, cost: { stone: 30, ore: 35, parts: 8 }, work: 200, hp: 580, tech: 'engineering', power: 24, description: 'Burns fuel to power industry within 24 tiles. Protect its fuel supply.' },
  refinery: { name: 'Fuel press', w: 3, h: 3, cost: { stone: 20, ore: 20, parts: 6 }, work: 160, hp: 420, tech: 'engineering', recipe: 'fuel', description: 'A craftsperson converts wood into transport and generator fuel.' },
  fabricator: { name: 'Drone foundry', w: 5, h: 4, cost: { stone: 50, ore: 60, parts: 25 }, work: 360, hp: 850, tech: 'robotics', demand: 8, description: 'Fabricates replaceable military machines. Needs power, parts and a craftsperson.' },
  garage: { name: 'Vehicle hangar', w: 6, h: 5, cost: { stone: 60, ore: 80, parts: 30 }, work: 450, hp: 1100, tech: 'transport', demand: 6, description: 'Builds valuable crewed vehicles; trains operators and supports hull repair.' },
  turret: { name: 'Perimeter lance', w: 2, h: 2, cost: { stone: 20, ore: 30, parts: 14 }, work: 150, hp: 650, tech: 'robotics', demand: 4, range: 15, damage: 14, description: 'Automatic defense with a clear firing lane. Power failure silences it.' },
  relay: { name: 'Frontier relay', w: 3, h: 3, cost: { stone: 35, ore: 30, parts: 12 }, work: 200, hp: 650, tech: 'transport', storage: true, description: 'A supplied territorial seat. Enables occupation and local provisioning.' }
};
export const TECH = {
  tools: { name: 'Practical tools', work: 900, cost: { ore: 20 }, description: 'Gathering and construction become 20% faster.' },
  medicine: { name: 'Field medicine', work: 1400, cost: { food: 30, ore: 15 }, requires: 'tools', description: 'Craft medicine and improve wound recovery.' },
  engineering: { name: 'Power engineering', work: 2000, cost: { parts: 20 }, requires: 'tools', description: 'Unlock fuel presses and powered turbines.' },
  transport: { name: 'Vehicle engineering', work: 3000, cost: { parts: 35, ore: 50 }, requires: 'engineering', description: 'Build transports, hangars and frontier relays.' },
  robotics: { name: 'Autonomous frames', work: 3600, cost: { parts: 45, ore: 50 }, requires: 'engineering', description: 'Fabricate basic scouts and line robots; build perimeter lances.' },
  advanced: { name: 'Crystal control systems', work: 5400, cost: { parts: 60, crystal: 25 }, requires: 'robotics', description: 'Long-range artillery, heavy crewed armor and aircraft.' }
};
export const MACHINES = {
  scout: { name: 'Skimmer drone', type: 'robot', cost: { ore: 16, parts: 6 }, work: 100, hp: 65, speed: 3.4, range: 7, damage: 4, armor: 0, cycle: 1, tech: 'robotics', description: 'Fast scouting and flanking. Fragile against line units.' },
  guard: { name: 'Ward frame', type: 'robot', cost: { ore: 26, parts: 10 }, work: 180, hp: 150, speed: 2, range: 10, damage: 10, armor: 3, cycle: 1.5, tech: 'robotics', description: 'Armored frontline robot. Screens valuable vehicles.' },
  artillery: { name: 'Spire artillery', type: 'robot', cost: { ore: 55, parts: 28, crystal: 6 }, work: 420, hp: 105, speed: 1.2, range: 23, minRange: 6, damage: 36, armor: 1, cycle: 5, tech: 'advanced', description: 'Long range, slow firing, vulnerable up close. Needs a screen.' },
  hauler: { name: 'Wayfarer carrier', type: 'vehicle', cost: { ore: 85, parts: 32 }, work: 600, hp: 650, speed: 3.2, range: 0, damage: 0, armor: 5, cycle: 1, seats: 6, capacity: 300, travel: 28, fuel: 0.08, tech: 'transport', description: 'A skilled driver carries people and supplies far faster than a foot party.' },
  tank: { name: 'Bastion crawler', type: 'vehicle', cost: { ore: 150, parts: 65, crystal: 10 }, work: 1200, hp: 1400, speed: 1.7, range: 18, damage: 48, armor: 12, cycle: 4.5, seats: 2, capacity: 60, travel: 16, fuel: 0.12, tech: 'advanced', description: 'Valuable crewed armor. Operator skill improves firing and movement; recover disabled hulls.' },
  aircraft: { name: 'Kestrel lifter', type: 'vehicle', cost: { ore: 130, parts: 80, crystal: 16 }, work: 1500, hp: 520, speed: 4.5, range: 8, damage: 8, armor: 2, cycle: 2, seats: 8, capacity: 220, travel: 90, fuel: 0.2, flying: true, tech: 'advanced', description: 'Crosses mountains and seas with a trained pilot. Fuel and a fragile hull constrain range.' }
};
export const RECIPES = {
  meals: { input: { food: 2 }, output: { meals: 2 }, work: 12, skill: 'cook' },
  parts: { input: { ore: 4 }, output: { parts: 2 }, work: 30, skill: 'craft' },
  fuel: { input: { wood: 5 }, output: { fuel: 3 }, work: 25, skill: 'craft' },
  medicine: { input: { food: 3, parts: 1 }, output: { medicine: 1 }, work: 45, skill: 'care', tech: 'medicine' }
};
export const COLORS = ['#72d5bf', '#ec9872', '#90baf2', '#d6a1e7', '#d8bd73', '#bbcf88'];
export const emptyStock = () => Object.fromEntries(RESOURCES.map(k => [k, 0]));
