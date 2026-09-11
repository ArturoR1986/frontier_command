export const VERSION = 1;
export const WIDTH = 64;
export const HEIGHT = 48;
export const BUILDINGS = {
  hub: { name: 'Command Hub', w: 3, h: 3, alloy: 60, biomass: 30, hp: 900, power: 8, demand: 0, color: '#d8b66b', description: 'Landing anchor, storage and four emergency bunks. Can be rebuilt if lost.' },
  depot: { name: 'Storage Depot', w: 2, h: 2, alloy: 18, biomass: 8, hp: 300, demand: 0, color: '#b59f81', description: 'A physical drop-off point. Shorter walks mean more work.' },
  habitat: { name: 'Habitat', w: 3, h: 2, alloy: 24, biomass: 12, hp: 360, demand: 2, color: '#a3c3bf', description: 'Four beds. Powered homes restore rest and health faster.' },
  farm: { name: 'Hydro Farm', w: 3, h: 2, alloy: 20, biomass: 10, hp: 240, demand: 3, color: '#91b87b', description: 'Tend crops, harvest and haul food. Fertile soil grows faster.' },
  generator: { name: 'Generator', w: 2, h: 2, alloy: 30, biomass: 8, hp: 300, power: 16, demand: 0, color: '#d39c61', description: '16 power, 11-tile service radius. Industry attracts attention.' },
  workshop: { name: 'Workshop', w: 3, h: 2, alloy: 36, biomass: 16, hp: 360, demand: 5, color: '#b5a9c7', description: 'Research tools, field medicine or defensive equipment.' },
  barracks: { name: 'Barracks', w: 3, h: 2, alloy: 32, biomass: 12, hp: 400, demand: 3, color: '#8ca7a0', description: 'Train any selected colonist as a ranger for 12 alloy.' },
  turret: { name: 'Sentry Turret', w: 1, h: 1, alloy: 28, biomass: 4, hp: 280, demand: 4, color: '#cfbc84', description: 'Powered perimeter defense. Rocks and walls block its fire.' },
  sensor: { name: 'Sensor Mast', w: 1, h: 1, alloy: 24, biomass: 8, hp: 180, demand: 2, color: '#86bbc6', description: 'Longer warning time and wider map visibility.' },
  wall: { name: 'Barrier', w: 1, h: 1, alloy: 4, biomass: 2, hp: 500, demand: 0, color: '#9b9990', description: 'Blocks movement and fire. Leave a gate-shaped gap.' }
};
export const UPGRADES = {
  tools: { name: 'Field tools', cost: 45, description: 'Gather and build 40% faster.' },
  armor: { name: 'Defensive equipment', cost: 45, description: 'Rangers deal more damage and all settlers take less.' },
  medicine: { name: 'Colony medicine', cost: 45, description: 'Double recovery in homes; improved morale.' }
};
export const PEOPLE = [
  ['Mara', 'Engineer', 'Patient', '#d4ad72', { build: 1, haul: 2, mine: 3, grow: 4 }],
  ['Tomas', 'Prospector', 'Industrious', '#8ebac3', { build: 3, haul: 2, mine: 1, grow: 4 }],
  ['Lena', 'Grower', 'Steady', '#a3bf7e', { build: 3, haul: 2, mine: 4, grow: 1 }],
  ['Kei', 'Security', 'Watchful', '#c393a5', { build: 2, haul: 1, mine: 3, grow: 4 }]
];
