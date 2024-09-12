const User = require('../models/user'); 
const Item = require('../models/item'); 

const weightConversionRates = {
    lb: { lb: 1, kg: 0.453592, g: 453.592, oz: 16 },
    kg: { lb: 2.20462, kg: 1, g: 1000, oz: 35.274 },
    g: { lb: 0.00220462, kg: 0.001, g: 1, oz: 0.035274 },
    oz: { lb: 0.0625, kg: 0.0283495, g: 28.3495, oz: 1 },
  };


async function getCategoryDetails(categoryId) {
  const items = await Item.find({ categoryId });

  const totalWeight = await items.reduce(async (sumPromise, item) => {
    const sum = await sumPromise;
    const user = await User.findById(item.owner);
    const userWeightOption = user?.weightOption;
    const itemWeightOption = item.weightOption || userWeightOption;
    const conversionRate = weightConversionRates[itemWeightOption][userWeightOption];
    return sum + item.weight * item.qty * conversionRate;
  }, Promise.resolve(0));

  const totalWornWeight = await items.reduce(async (sumPromise, item) => {
    const sum = await sumPromise;
    const user = await User.findById(item.owner);
    const userWeightOption = user?.weightOption;
    const itemWeightOption = item.weightOption || userWeightOption;
    const conversionRate = weightConversionRates[itemWeightOption][userWeightOption];
    return sum + (item.worn ? item.weight * item.qty * conversionRate : 0);
  }, Promise.resolve(0));

  return { items, totalWeight, totalWornWeight };
}

module.exports = { getCategoryDetails };
