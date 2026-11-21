const { getAllNationalSchemes } = require('./nationalSchemesDatabase');
const { SCHEMES: base } = require('./schemesData');
const list = getAllNationalSchemes(base);

const ALL_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const ALL_UTS = [
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const stateMap = {};
ALL_STATES.forEach(s => stateMap[s] = 0);
const utMap = {};
ALL_UTS.forEach(u => utMap[u] = 0);

let centralCount = 0;
list.forEach(s => {
  if (s.state === 'All India (Central)' || s.state.includes('Central')) {
    centralCount++;
  } else if (stateMap[s.state] !== undefined) {
    stateMap[s.state]++;
  } else if (utMap[s.state] !== undefined) {
    utMap[s.state]++;
  }
});

console.log('Central schemes count:', centralCount);
console.log('States covered:', Object.entries(stateMap).filter(([k, v]) => v > 0).length, 'of 28');
console.log('States missing:', Object.entries(stateMap).filter(([k, v]) => v === 0).map(([k, v]) => k));
console.log('UTs covered:', Object.entries(utMap).filter(([k, v]) => v > 0).length, 'of 8');
console.log('UTs missing:', Object.entries(utMap).filter(([k, v]) => v === 0).map(([k, v]) => k));

