class Distance {
    constructor(value, unit) {
        this.conversionOfUnits = {
            'm': 1,
            'km': 1000,
            'inch': 0.0254,
            'feet': 0.3048,
            'yard': 0.9144,
            'mile': 1609.34,
        };
        if (!this.conversionOfUnits[unit]) {
            throw new Error('Invalid unit');
        }
        this.value = value,
        this.unit = unit
    }
    add(distance) {
        const transfer = this.conversionOfUnits[this.unit];
        const convertedDistance = distance.value * (distance.conversionOfUnits[distance.unit] / transfer);
        this.value += convertedDistance;
    }
    toString(unit) {
        if (!this.conversionOfUnits[unit]) {
          throw new Error('Invalid unit');
        }

        const convertedValue = this.value * this.conversionOfUnits[this.unit] / this.conversionOfUnits[unit];
        return `${convertedValue} ${unit}`;
      }

}
const distance = new Distance(5, 'm');
distance.add(new Distance(1, 'km'));
distance.add(new Distance(1, 'inch'));
distance.add(new Distance(1, 'feet'));
distance.add(new Distance(1, 'yard'));
distance.add(new Distance(1, 'mile'));
console.log(distance.toString('m'));

class ImmutableDistance extends Distance {
    constructor(value, unit) {
        super(value, unit);
        Object.freeze(this);
    }

    add(distance) {
        const transfer = this.conversionOfUnits[this.unit];
        const convertedDistance = distance.value * (distance.conversionOfUnits[distance.unit] / transfer);

        return new ImmutableDistance(this.value + convertedDistance, this.unit);
    }
}
const immutableDistance = new ImmutableDistance(1, 'm');
const newDistance = immutableDistance.add(new ImmutableDistance(1, 'km'));
console.log(immutableDistance.toString('m')); // Має вивести "1 m"
console.log(newDistance.toString('m'));

//Завдання по асинхронним функціям
const delay = (ms) => {
    return new Promise((r) => setTimeout(() => r(), ms));
};

const urlPrivat = "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5";
async function fetchTodos() {
    console.log("Fetch started");
    await delay(2000);
    const responsePrivat = await fetch(urlPrivat);
    const dataPrivat = await responsePrivat.json();
    console.log("Data Privat:", dataPrivat);
}
fetchTodos()
   .then(() => {
    return fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
  })
  .then((response) => response.json())
  .then((jsonData) => {
    const usdData = jsonData.find((item) => item.cc === "USD");
    const eurData = jsonData.find((item) => item.cc === "EUR");
    const usdBuyRate = usdData.rate;
    const usdSellRate = usdData.rate + 0.5;
    const eurBuyRate = eurData.rate;
    const eurSellRate = eurData.rate + 0.5;

    console.log("Data NBU");
    console.log(`Buy USA: ${usdBuyRate}, Sell USA: ${usdSellRate}`);
    console.log(`Buy EUR: ${eurBuyRate}, Sell EUR: ${eurSellRate}`);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });