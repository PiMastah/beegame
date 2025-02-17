let tmp = {
  gameSpeedFormTicks: 1,
  usedTime: 1,
};

type t_gods = "flower" | "pollen" | "nectar" | "honey" | "money";

const format = (x: number, p = 0): string => {
  // @ts-ignore
  if (typeof x != "number" || x == null || x == undefined) return;
  if (x < -1000) {
    let power = Math.floor(Math.log10(Math.abs(x)));

    return (x / 10 ** power / 1.0001).toFixed(2) + "e" + power;
  }
  if (x < -100) return x.toFixed(Math.max(0, 1 + p));
  if (x < -10) return x.toFixed(Math.max(0, 2 + p));
  if (x < -1) return x.toFixed(Math.max(0, 3 + p));
  if (x == 0) return "0";
  if (x < 1) return x.toFixed(Math.max(0, 3 + p));
  if (x < 10) return x.toFixed(Math.max(0, 2 + p));
  if (x < 100) return x.toFixed(Math.max(0, 1 + p));
  if (x < 1000) return x.toFixed(Math.max(0, 0 + p));
  let power = Math.floor(Math.log10(x));
  return (x / 10 ** power / 1.0001).toFixed(2) + "e" + power;
};

const ft2 = (x: number): number => Math.floor(x * 100) / 100;
const rt5 = (x: number): number => Math.round(x * 100000) / 100000;

const c = 10 ** (1 / 12);

const getBeePrice = (): number => {
  let a = c ** p.bees;
  let price = 1 * a;
  price /= n_tributes.tmp.me[1];
  return price;
};
const getBeePriceMult = (): number => {
  let a = 1;
  a /= n_tributes.tmp.me[1];
  return a;
};

const getHivePrice = (): number => {
  let a = c ** (p.hives - 1);
  let price = 2 * a;
  price /= n_sacrifices.tmp.capitalistGodEffect;
  return price;
};
const getHivePriceMult = (): number => {
  let a = 2;
  a /= n_sacrifices.tmp.capitalistGodEffect;
  return a;
};

const getFlowerFieldPrice = (): number => {
  let a = c ** (p.flowerFields - 1);
  let price = 5 * a;
  price /= n_sacrifices.tmp.capitalistGodEffect;
  return price;
};
const getFlowerFieldPriceMult = (): number => {
  let a = 5;
  a /= n_sacrifices.tmp.capitalistGodEffect;
  return a;
};

const getMaxForagerBees = (): number => {
  let space = (3 + p.hives) / 5;
  space += Math.floor((4 + p.bees + n_tributes.tmp.me[3]) / 5);
  space += p.pollenGodTributes * n_tributes.tmp.me[5];
  space += p.pollenGodRJTributes;
  space *= n_sacrifices.tmp.capitalistGodEffect;
  if (p.cge) {
    return ft2(space);
  } else return Math.floor(space);
};

const getMaxHoneyBees = (): number => {
  let space = (3 + p.hives) / 5;
  space += Math.floor((4 + p.bees + n_tributes.tmp.me[3]) / 5);
  space += p.nectarGodTributes * n_tributes.tmp.me[5];
  space += p.nectarGodRJTributes;
  space *= n_sacrifices.tmp.capitalistGodEffect;
  if (p.cge) {
    return ft2(space);
  } else return Math.floor(space);
};

const getFlowerProduction = (
  flowerFields = p.flowerFields + (p.flowerGodTributes * n_tributes.tmp.me[5] + p.flowerGodRJTributes * 2)
): number => {
  let prod = flowerFields;
  prod *= 1.01 ** Math.max(0, p.flowerFields - 1 + p.flowerGodTributes);
  prod *= 1.01 ** (p.RJflowerFields * 2);
  prod *= 1.03 ** ((p.flowerGodTributes + p.flowerGodRJTributes) * n_tributes.tmp.me[5]);
  prod *= n_tributes.tmp.me[0];
  prod *= tmp.gameSpeedFormTicks;
  prod *= n_jelly.tmp.RJBonus;
  return prod;
};

const getPollenProduction = (foragerBees = p.foragerBees): number => {
  let prod = (foragerBees * 3) / 40;
  prod *= 1.01 ** Math.max(0, p.flowerFields + p.flowerGodTributes * n_tributes.tmp.me[5] - 1);
  prod *= 1.01 ** (p.RJflowerFields * 2);
  prod *= 1.03 ** ((p.pollenGodTributes + p.pollenGodRJTributes) * n_tributes.tmp.me[5]);
  prod *= p.pge ? 2 : 1;
  prod *= n_tributes.tmp.me[8];
  prod *= tmp.gameSpeedFormTicks;
  prod *= n_jelly.tmp.RJBonus;
  return prod;
};

const getHoneyProduction = (honeyBees = p.honeyBees): number => {
  let prod = honeyBees / 30;
  prod *= 1.01 ** Math.max(0, p.hives);
  prod *= 1.01 ** (p.RJhives * 2);
  prod *= 1.03 ** (p.honeyGodTributes * n_tributes.tmp.me[5] + p.honeyGodRJTributes);
  prod *= p.nge ? 2 : 1;
  prod *= n_tributes.tmp.me[4];
  prod *= n_tributes.tmp.me[8];
  prod *= tmp.gameSpeedFormTicks;
  prod *= n_jelly.tmp.RJBonus;
  return prod;
};

let percentOfHoneySold = {
  1: 1 - 0.99 ** 1,
  2: 1 - 0.99 ** 2,
  5: 1 - 0.99 ** 5,
  10: 1 - 0.99 ** 10,
  20: 1 - 0.99 ** 20,
  50: 1 - 0.99 ** 50,
  100: 1 - 0.99 ** 100,
};

const getHoneyToSell = (honeyToSell = p.honey * (percentOfHoneySold[tmp.usedTime] ?? 0.01)): number => {
  if (p.honey < 1 / (getHoneyWorth() * 10)) return 0;
  return honeyToSell;
};
const getHoneyWorth = (): number => {
  let worth = n_tributes.tmp.me[7];
  worth *= n_jelly.tmp.RJBonus;
  return worth;
};

const tributeBaseScalling = 10 ** (1 / 5);
const smallTributeBase = 50 / tributeBaseScalling;
const smallTributeBase2 = 500 / tributeBaseScalling;

//todo? idk these feel kinda off but i guess thats fine
// eyJmbG93ZXJzIjowLCJwb2xsZW4iOjIwNzYuNTY3NzE4MDYyMDE2NCwibmVjdGFyIjo0NzEuNTMzOTkwNjUxNTg4MiwiaG9uZXkiOjkxMS43ODg4MDYzNTIzMzM2LCJtb25leSI6MzM0LjQyMzM4OTQ2NDcwNzYsImhpZ2hlc3RmbG93ZXJzIjozMjk0LjcwMDU0MjgxMjQzMiwiaGlnaGVzdHBvbGxlbiI6MjA3Ni41Njc3MTgwNjIwMTY0LCJoaWdoZXN0bmVjdGFyIjo1MzAuNzA3MDg4NjkwMzI0MiwiaGlnaGVzdGhvbmV5Ijo5MTEuNzg4ODA2MzUyMzMzNiwiaGlnaGVzdG1vbmV5IjozMzQuNDIzMzg5NDY0NzA3NiwidG90YWxmbG93ZXJzIjoxNjY3OC4yMzMzNjkyNzM0OSwidG90YWxwb2xsZW4iOjQwMDIuMzU2ODQ2NjAzMjQxLCJ0b3RhbG5lY3RhciI6MzY1OC4yMjEwMDI2ODAxMDIsInRvdGFsaG9uZXkiOjIyOTEuMTY2MDU3NzYzMzUyLCJ0b3RhbG1vbmV5IjoyODIyLjc4ODAyODU2NzUxMzcsImJlZXMiOjEyLCJmcmVlQmVlcyI6MCwiZm9yYWdlckJlZXMiOjguNzcsImhvbmV5QmVlcyI6MTAuNDE2MDMyMzAwNjI3OTc1LCJmbG93ZXJGaWVsZHMiOjEsImhpdmVzIjoxOSwidG90YWxTYWNyaWZpY2VzIjowLCJwb2xsZW5Hb2RUcmlidXRlcyI6NCwibmVjdGFyR29kVHJpYnV0ZXMiOjIsImhvbmV5R29kVHJpYnV0ZXMiOjcsImZsb3dlckdvZFRyaWJ1dGVzIjoxLCJjYXBpdGFsaXN0R29kVHJpYnV0ZXMiOjQsImF1dG9Bc2lnbkJlZXNUbyI6WyJmb3JhZ2VyIiwiaG9uZXkiXSwicGdlIjp0cnVlLCJuZ2UiOnRydWUsImhnZSI6dHJ1ZSwiZmdlIjp0cnVlLCJjZ2UiOnRydWUsInNlbGxpbmdIb25leSI6ZmFsc2UsImF1dG9zYXZlcyI6ZmFsc2UsInVubG9ja3MiOnsiYmVlcyI6dHJ1ZSwiZm9yYWdlckJlZXMiOnRydWUsImhpdmUiOnRydWUsImhvbmV5QmVlcyI6dHJ1ZSwic2FjcmlmaWNpbmciOnRydWUsInRyaWJ1dGVzIjp0cnVlLCJqZWxseSI6ZmFsc2UsImplbGx5MiI6ZmFsc2V9LCJsYXN0VXBkYXRlIjoxNjY2OTc2NDc4MTc5LCJvZmZsaW5lVGltZSI6NjcxMjguMTcyOTk5OTkzMzYsIlJKIjowLCJoaWdoZXN0UkoiOjAsInRvdGFsUkoiOjAsIlJKYmVlcyI6MCwiUkpmbG93ZXJGaWVsZHMiOjAsIlJKaGl2ZXMiOjAsIlJKVHJpYnV0ZXMiOjAsInVudXNlZFJKVHJpYnV0ZXMiOjAsInBvbGxlbkdvZFJKVHJpYnV0ZXMiOjAsIm5lY3RhckdvZFJKVHJpYnV0ZXMiOjAsImhvbmV5R29kUkpUcmlidXRlcyI6MCwiZmxvd2VyR29kUkpUcmlidXRlcyI6MCwiY2FwaXRhbGlzdEdvZFJKVHJpYnV0ZXMiOjAsInRhYiI6InNldHRpbmdzIiwiZGFya21vZGUiOnRydWUsImJpZ0J1dHRvbnMiOmZhbHNlLCJkaXNwbGF5RXZlcnl0aGluZyI6ZmFsc2UsImV4Y2hhbmdlQ29uZmlybWF0aW9uIjp0cnVlLCJpY29uTW92ZSI6ZmFsc2V9
const getSmallGodTribute = (smallResource: number): number => {
  let base = smallResource;
  base *= n_tributes.tmp.me[2];
  return Math.floor(Math.log(Math.max(1, base / smallTributeBase)) / Math.log(tributeBaseScalling));
};
const getSmallGodTribute2 = (smallResource: number): number => {
  let base = smallResource;
  base *= n_tributes.tmp.me[2];
  return Math.floor(Math.log(Math.max(1, base / smallTributeBase2)) / Math.log(tributeBaseScalling));
};

const getNextsmallGodTribute = (tributes: number): number => {
  let base = smallTributeBase;
  base /= n_tributes.tmp.me[2];
  return tributeBaseScalling ** tributes * base;
};
const getNextsmallGodTribute2 = (tributes: number): number => {
  let base = smallTributeBase2;
  base /= n_tributes.tmp.me[2];
  return tributeBaseScalling ** tributes * base;
};

const getTotalSacrificeTributes = (): number => {
  return p.pollenGodTributes + p.nectarGodTributes + p.honeyGodTributes + p.flowerGodTributes + p.capitalistGodTributes;
};
const getTotalTributes = (): number => getTotalSacrificeTributes() + getTotalRJTributes();

const totalBees = () => {
  return p.freeBees + p.foragerBees + p.honeyBees;
};
const floor = (x: number) => Math.floor(x);

const stepwise1 = (s: number, n: number): number => {
  let f = floor(n / s);
  let a = (n % s) * (f + 1);
  let b = (s * (f * (f + 1))) / 2;
  return a + b;
};

const stepwise2 = (s: number, n: number): number => {
  let f = floor(n / s);
  let a = 2 ** f * (n % s);
  let b = s * 2 ** f - s;
  return a + b;
};

const reversedstepwise2 = (s: number, x: number): number => {
  let base = floor(Math.log2((x + s) / s));
  let a = s * 2 ** base - s;
  let b = (x - a) / 2 ** base;
  return base * s + b;
};

const getPSWithS = (what: string, x: number) => {
  if (x > 1) return `${format(x)} ${what}s per second`;
  else if (x == 1) return `${format(x)} ${what} per second`;
  else return `1 ${what} per ${format(1 / x)} seconds`;
};

const getPS = (what: string, x: number) => {
  if (x >= 1) return `${format(x)} ${what} per 1 second`;
  else return `1 ${what} per ${format(1 / x)} seconds`;
};
type t_tribute = {
  unlockAt: number;
  showAt: number;
  displayAt: number;
  description: string;
};

// prettier-ignore
let tributes: TupleOf<t_tribute, 15> = [
  {unlockAt: 2  , showAt: 1  , displayAt: 0  , description: "1.02x flower production for every 2 free bee and for every 2 tributes"},
  {unlockAt: 5  , showAt: 2  , displayAt: 1  , description: "bee price divided by 1.02x for every 2 tributes"},
  {unlockAt: 10 , showAt: 5  , displayAt: 2  , description: "sacrifice requirement divided by 1.02 for every 2 tributes"},
  {unlockAt: 15 , showAt: 10 , displayAt: 5  , description: "1 bee for every 5 tributes"},
  {unlockAt: 20 , showAt: 15 , displayAt: 10 , description: "1.02x honey production per tribute"},
  {unlockAt: 30 , showAt: 20 , displayAt: 15 , description: "1.02x tribute efficiency for every 10 tributes"},
  {unlockAt: 45 , showAt: 30 , displayAt: 20 , description: "1.02x nectar production for every 2 tributes"},
  {unlockAt: 60 , showAt: 40 , displayAt: 25 , description: "1.02x honey price multiplier per 3 tributes"},
  {unlockAt: 75 , showAt: 50 , displayAt: 30 , description: "1.02x time speed multiplier per 5 tributes"},
  {unlockAt: 100, showAt: 100, displayAt: 75 , description: "unlocks royal jelly"},
  {unlockAt: 110, showAt: 110, displayAt: 100, description: "combine a pair of gods"},
  {unlockAt: 130, showAt: 120, displayAt: 110, description: "combine another pair of gods"},
  {unlockAt: 150, showAt: 130, displayAt: 120, description: "combine another pair of gods"},
  {unlockAt: 170, showAt: 140, displayAt: 130, description: "combine another pair of gods"},
  {unlockAt: 180, showAt: 160, displayAt: 140, description: "challenges"},
];

const ft = (x: number): string => {
  let rx = x;
  let t = "";
  if (x > 86400) {
    let d = Math.floor(x / 86400) % 365;
    x -= d * 86400;
    t += ` ${d}d`;
  }
  if (x > 3600) {
    let h = Math.floor(x / 3600) % 24;
    x -= h * 3600;
    t += ` ${h}h`;
  }
  if (x > 60) {
    let m = Math.floor(x / 60) % 60;
    x -= m * 60;
    t += ` ${m}m`;
  }
  if (x > 1 && rx < 86400) {
    let s = Math.floor(x) % 60;
    t += ` ${s}s`;
  }
  return t;
};

let gameSpeed = 1;
const getForagerBeeConsumption = () => (11.85185185185185 * getNectarProduction(1) * getPollenProduction(1)) ** 0.5;

const updateOfflineTicks = (diff: number) => {
  if (diff > 5) {
    p.offlineTime += diff - 5;
    diff = 5;
  }

  if (p.offlineTime > 2) {
    d.ticksLeft.innerHTML = `offline time: ${ft(p.offlineTime)}`;
    d.offlineTicks.style.display = "";
  } else {
    d.offlineTicks.style.display = "none";
  }

  if (p.offlineTime > 1) {
    let ticksLeft = Math.max(0, Math.min(tmp.usedTime, p.offlineTime));
    p.offlineTime -= Math.max(0, ticksLeft - 1) * diff;
    tmp.gameSpeedFormTicks = Math.max(1, ticksLeft);
  } else {
    tmp.gameSpeedFormTicks = 1;
  }
  return diff;
};
const updateTmp = () => {
  tmp.usedTime = 1;
  if (d.offlineTicksSpeed2.checked) tmp.usedTime *= 2;
  if (d.offlineTicksSpeed5.checked) tmp.usedTime *= 5;
  if (d.offlineTicksSpeed10.checked) tmp.usedTime *= 10;
  if (!d.offlineTicksSpeed2.checked && !d.offlineTicksSpeed5.checked && !d.offlineTicksSpeed10.checked) tmp.usedTime = 1;
  tmp.usedTime = Math.max(0, Math.min(p.offlineTime, tmp.usedTime));
  if (tmp.usedTime < 1) tmp.usedTime = 0; // ouch
  if (p.offlineTime < 1) p.offlineTime = 0; // ouch
};

const updateUnlocks = () => {
  if (p.bees > 0) p.unlocks.bees = true;
  if (p.pollen >= 1) p.unlocks.hive = true;
  if (p.foragerBees > 0) p.unlocks.foragerBees = true;
  if (p.honeyBees > 0) p.unlocks.honeyBees = true;
  if (
    totalBees() >= 3 &&
    (p.highestpollen >= 35 || p.highestnectar >= 35 || p.highesthoney >= 35 || p.highestflowers >= 700 || p.highestmoney >= 35)
  )
    p.unlocks.sacrificing = true;
  if (n_tributes.tmp.totalTributes > 0) {
    p.unlocks.tributes = true;
  }
  if (n_tributes.tmp.totalTributes >= tributes[9].unlockAt) p.unlocks.jelly = true;
  if (p.RJ > 0) p.unlocks.jelly2 = true;
};

const updateDisplay = () => {
  p.settings.sacrificeConfirmation = d.sacrificeConfirmation.checked;
  p.settings.exchangeConfirmation = d.exchangeConfirmation.checked;
  p.settings.toggleHoneyOfflineTime = d.toggleHoneyOfflineTime.checked;
  p.settings.toggleSacrificeOfflineTime = d.toggleSacrificeOfflineTime.checked;
  p.settings.toggleRJOfflineTime = d.toggleRJOfflineTime.checked;

  if (p.fge) {
    d.honeyCheckBox.disabled = false;
  } else {
    d.honeyCheckBox.disabled = true;
    d.honeyCheckBox.checked = false;
    p.sellingHoney = false;
  }

  if (d.honeyCheckBox.checked) {
    p.sellingHoney = true;
    d.moneyPS.classList.remove("lighttext");
  } else {
    p.sellingHoney = false;
    d.moneyPS.classList.add("lighttext");
  }

  if (d.toggleDarkmode.checked) {
    d.body.classList.add("dark-mode");
    p.settings.darkmode = true;
  } else {
    d.body.classList.remove("dark-mode");
    p.settings.darkmode = false;
  }
  if (d.toggleBigButtons.checked) {
    d.body.classList.add("big-buttons");
    p.settings.bigButtons = true;
  } else {
    d.body.classList.remove("big-buttons");
    p.settings.bigButtons = false;
  }
  if (d.disaplyeverything.checked) p.settings.displayEverything = true;
  else p.settings.displayEverything = false;
  if (d.exchangeConfirmation.checked) p.settings.exchangeConfirmation = true;
  else p.settings.exchangeConfirmation = false;

  if (p.money < getFlowerFieldPrice()) {
    d.quickBuyFlowerField.disabled = true;
    d.buyFlowerField.disabled = true;
  } else {
    d.quickBuyFlowerField.disabled = false;
    d.buyFlowerField.disabled = false;
  }
  if (p.honey < getBeePrice()) {
    d.quickBuyBee.disabled = true;
    d.buyBee.disabled = true;
  } else {
    d.quickBuyBee.disabled = false;
    d.buyBee.disabled = false;
  }
  if (p.pollen < getHivePrice()) {
    d.quickBuyHive.disabled = true;
    d.buyHive.disabled = true;
  } else {
    d.quickBuyHive.disabled = false;
    d.buyHive.disabled = false;
  }

  if (p.settings.displayEverything || p.unlocks.bees) {
    d.foragerbeeswrapper.style.display = "";
    d.quickbuyhivewrapper.style.display = "";
    d.beesEffect.style.display = "";
    d.fifthbeestatwrapper.style.display = "";
  } else {
    d.foragerbeeswrapper.style.display = "none";
    d.quickbuyhivewrapper.style.display = "none";
    d.beesEffect.style.display = "none";
    d.fifthbeestatwrapper.style.display = "none";
  }
  if ((!p.settings.displayEverything && !p.unlocks.foragerBees) || (p.unlocks.bees && !p.unlocks.foragerBees)) {
    d.foragerbeestext.innerHTML = "└";
  } else {
    d.foragerbeestext.innerHTML = "├";
  }
  if (p.settings.displayEverything || p.unlocks.hive) {
    d.hivewrapper.style.display = "";
    d.beehivestatwrapper.style.display = "";
  } else {
    d.hivewrapper.style.display = "none";
    d.beehivestatwrapper.style.display = "none";
  }

  if (p.settings.displayEverything || p.unlocks.foragerBees) {
    d.pollenwrapper.style.visibility = "visible";
    d.nectarwrapper.style.visibility = "visible";
    d.honeybeeswrapper.style.display = "";
    d.foragerstatwrapper.style.display = "";
  } else {
    d.pollenwrapper.style.visibility = "hidden";
    d.nectarwrapper.style.visibility = "hidden";
    d.honeybeeswrapper.style.display = "none";
    d.foragerstatwrapper.style.display = "none";
  }

  if (p.settings.displayEverything || p.unlocks.honeyBees) {
    d.honeywrapper.style.visibility = "visible";
    d.honeybeestatwrapper.style.display = "";
  } else {
    d.honeybeestatwrapper.style.display = "none";
    d.honeywrapper.style.visibility = "hidden";
  }

  if (n_tributes.tmp.totalTributes == 0) d.recomendedFlowers.style.display = "";
  else d.recomendedFlowers.style.display = "none";

  if (p.settings.displayEverything || p.fge) {
    d.moneywrapper.style.visibility = "visible";
    d.flowerfieldwrapper.style.display = "";
    d.quickBuyFlowerField.style.display = "";
    d.honeystatwrapper.style.display = "";
  } else {
    d.moneywrapper.style.visibility = "hidden";
    d.flowerfieldwrapper.style.display = "none";
    d.quickBuyFlowerField.style.display = "none";
    d.honeystatwrapper.style.display = "none";
  }
  if (p.settings.displayEverything || p.unlocks.sacrificing) {
    d.sacrificeWrapper.style.display = "";
  } else {
    d.sacrificeWrapper.style.display = "none";
  }
  if (p.settings.displayEverything || p.pge || p.highestpollen >= smallTributeBase) d.pollengodwrapper.style.display = "";
  else d.pollengodwrapper.style.display = "none";
  if (p.settings.displayEverything || p.nge || p.highestnectar >= smallTributeBase) d.nectargodwrapper.style.display = "";
  else d.nectargodwrapper.style.display = "none";
  if (p.settings.displayEverything || p.hge || p.highesthoney >= smallTributeBase) d.honeygodwrapper.style.display = "";
  else d.honeygodwrapper.style.display = "none";
  if (p.settings.displayEverything || p.fge || p.highestflowers >= smallTributeBase2) d.flowergodwrapper.style.display = "";
  else d.flowergodwrapper.style.display = "none";
  if (p.settings.displayEverything || p.cge || p.highestmoney >= smallTributeBase) d.capitalistgodwrapper.style.display = "";
  else d.capitalistgodwrapper.style.display = "none";

  if (p.settings.displayEverything || p.unlocks.tributes) {
    d.tributeswrapper.style.display = "";
    d.pernamentTributeEffects.style.display = "";
    d.pernamentTributeEffectsLabel.style.display = "";
  } else {
    d.tributeswrapper.style.display = "none";
    d.pernamentTributeEffects.style.display = "none";
    d.pernamentTributeEffectsLabel.style.display = "none";
  }

  if (p.settings.displayEverything || p.unlocks.jelly) {
    d.jellyTabButton.style.display = "";
    d.RJWrapper3.style.display = "";
  } else {
    d.jellyTabButton.style.display = "none";
    d.RJWrapper3.style.display = "none";
  }
  if (p.settings.displayEverything || p.unlocks.jelly2) {
    d.RJWrapper.style.display = "";
    d.RJWrapper2.style.display = "";
    // d.RJWrapper4.style.visibility = "visible";
  } else {
    d.RJWrapper.style.display = "none";
    d.RJWrapper2.style.display = "none";
    // d.RJWrapper4.style.visibility = "hidden";
  }
};

const getNectarProduction = (foragerBees = p.foragerBees) => {
  let prod = foragerBees / 8;
  prod *= 1.01 ** Math.max(0, p.bees - 1 + n_tributes.tmp.me[3]);
  prod *= 1.01 ** (p.RJbees * 2);
  prod *= 1.03 ** (p.nectarGodTributes * n_tributes.tmp.me[5] + p.nectarGodRJTributes);
  prod *= n_tributes.tmp.me[6];
  prod *= tmp.gameSpeedFormTicks;
  prod *= n_jelly.tmp.RJBonus;
  return prod;
};
namespace n_resources {
  export let tmp = {
    flowerProd: 0, //  flowers
    pollenProd: 0, //  ├ pollen
    nectarProd: 0, //  └ nectar
    honeyProd: 0, //     └ honey
    moneyProd: 0, //       └ money

    flowerCons: 0, // foragers bees
    nectarCons: 0, // honey bees
    honeyCons: 0, //  selling honey

    flowerEff: 0,
    nectarEff: 0,
  };
  export const calc = (diff: number) => {
    // flowers
    tmp.flowerProd = getFlowerProduction() ?? 0;
    tmp.flowerCons = p.foragerBees * getForagerBeeConsumption() ?? 0;

    tmp.flowerEff = 0;
    if (p.flowers + tmp.flowerProd != 0 && tmp.flowerCons != 0) tmp.flowerEff = Math.min(1, (p.flowers + tmp.flowerProd) / tmp.flowerCons);

    p.flowers += (tmp.flowerProd - tmp.flowerCons * tmp.flowerEff) * diff;

    // pollen
    tmp.pollenProd = getPollenProduction() ?? 0;
    p.pollen += tmp.pollenProd * tmp.flowerEff * diff;

    // nectar
    tmp.nectarProd = getNectarProduction() * tmp.flowerEff ?? 0;
    tmp.nectarCons = getHoneyProduction() ?? 0;

    tmp.nectarEff = 0;
    if (p.nectar + tmp.nectarProd != 0 && tmp.nectarCons != 0) tmp.nectarEff = Math.min(1, (p.nectar + tmp.nectarProd) / tmp.nectarCons);
    tmp.honeyProd *= tmp.nectarEff;

    p.nectar += (tmp.nectarProd - tmp.nectarCons * tmp.nectarEff) * diff;

    // honey
    tmp.honeyProd = getHoneyProduction() ?? 0;
    p.honey += (tmp.honeyProd * tmp.nectarEff - tmp.honeyCons) * diff;
    tmp.honeyCons = (p.sellingHoney ? getHoneyToSell() : 0) ?? 0;

    // money
    tmp.moneyProd = getHoneyToSell() * getHoneyWorth() ?? 0;
    if (p.sellingHoney) {
      p.honey -= tmp.honeyCons * diff;
      p.money += tmp.moneyProd * diff;
    }

    // .
    if (p.flowers < 0.0005 || p.flowers == NaN) {
      p.flowers = 0;
    }
    if (p.pollen < 0.0005 || p.pollen == NaN) {
      p.pollen = 0;
    }
    if (p.nectar < 0.0005 || p.nectar == NaN) {
      p.nectar = 0;
    }
    if (p.honey < 0.0005 || p.honey == NaN) {
      p.honey = 0;
    }
    if (p.money < 0.0005 || p.money == NaN) {
      p.money = 0;
    }

    //
    // highest for sacrifice
    p.highestflowers = Math.max(p.flowers, p.highestflowers ?? 0);
    p.highestpollen = Math.max(p.pollen, p.highestpollen ?? 0);
    p.highestnectar = Math.max(p.nectar, p.highestnectar ?? 0);
    p.highesthoney = Math.max(p.honey, p.highesthoney ?? 0);
    p.highestmoney = Math.max(p.money, p.highestmoney ?? 0);

    // total for royal jelly
    p.totalflowers += tmp.flowerProd * diff;
    p.totalpollen += tmp.pollenProd * diff;
    p.totalnectar += tmp.nectarProd * diff;
    p.totalhoney += tmp.honeyProd * diff;
    if (p.sellingHoney) p.totalmoney += +tmp.moneyProd * diff;
  };
  export const text = () => {
    // current
    d.flowers.innerHTML = ` ${format(p.flowers)}`;
    d.pollen.innerHTML = ` ${format(p.pollen)}`;
    d.nectar.innerHTML = ` ${format(p.nectar)}`;
    d.honey.innerHTML = ` ${format(Math.round(p.honey * 1e5) / 1e5)}`; //todo remove?
    d.money.innerHTML = ` ${format(p.money)}`;

    // per second
    d.flowersPS.innerHTML = `(${format(rt5(tmp.flowerProd - tmp.flowerCons * tmp.flowerEff))}/s)`;
    d.pollenPS.innerHTML = `(${format(rt5(tmp.pollenProd * tmp.flowerEff))}/s)`;
    d.nectarPS.innerHTML = `(${format(rt5(tmp.nectarProd - tmp.nectarCons * tmp.nectarEff))}/s)`;
    d.honeyPS.innerHTML = `(${format(rt5(tmp.honeyProd * tmp.nectarEff - tmp.honeyCons))}/s)`;
    d.moneyPS.innerHTML = `(${format(rt5(tmp.moneyProd))}/s)`;

    // until 0
    //TODO:
  };
}

// v and n_bees
namespace n_structures {
  export let tmp = {
    maxForagerBees: 0,
    maxHoneyBees: 0,

    flowerFieldPrice: 1,
    beePrice: 1,
    hivePrice: 1,

    flowerFieldsToBuy: 0,
    flowerFieldsPrice: 1 / 0,
    beesToBuy: 0,
    beesPrice: 1 / 0,
    hivesToBuy: 0,
    hivesPrice: 1 / 0,
  };
  export const text = () => {
    // flower fields
    d.flowerFieldPrice.innerHTML = format(tmp.flowerFieldPrice);
    d.flowerFields.innerHTML = p.flowerFields.toFixed(0);
    if (p.flowerGodTributes > 0)
      if (n_tributes.tmp.me[5] == 1) d.flowerFields.innerHTML += " + " + p.flowerGodTributes.toFixed(0);
      else d.flowerFields.innerHTML += " + " + format(p.flowerGodTributes);
    if (p.RJflowerFields > 0) d.flowerFields.innerHTML += ` + <span class='rjtext'> ${p.RJflowerFields.toFixed(0)}</span>`;

    // bees
    d.beePrice.innerHTML = format(tmp.beePrice);
    d.bees.innerHTML = p.bees.toFixed(0);
    if (n_tributes.tmp.totalTributes >= tributes[3].unlockAt) d.bees.innerHTML += " + " + format(n_tributes.tmp.me[3]);
    if (p.RJbees > 0) d.bees.innerHTML += ` + <span class='rjtext'> ${p.RJbees.toFixed(0)}</span>`;

    if (p.honeyGodTributes + p.honeyGodRJTributes == 0 && p.capitalistGodTributes + p.capitalistGodRJTributes == 0) {
      d.freeBees.innerHTML = "" + rt5(p.freeBees).toFixed(0) + "/" + totalBees().toFixed(0);
      d.foragerBees.innerHTML = "" + p.foragerBees.toFixed(0) + "/" + tmp.maxForagerBees.toFixed(0);
      d.honeyBees.innerHTML = "" + p.honeyBees.toFixed(0) + "/" + tmp.maxHoneyBees.toFixed(0);
    } else {
      d.freeBees.innerHTML = "" + format(rt5(p.freeBees)) + "/" + format(totalBees());
      d.foragerBees.innerHTML = "" + format(p.foragerBees) + "/" + format(tmp.maxForagerBees);
      d.honeyBees.innerHTML = "" + format(p.honeyBees) + "/" + format(tmp.maxHoneyBees);
    }

    // hives
    d.hivePrice.innerHTML = format(tmp.hivePrice);
    d.hives.innerHTML = p.hives.toFixed(0);
    if (p.RJhives > 0) d.hives.innerHTML += ` + <span class='rjtext'> ${p.RJhives.toFixed(0)}</span>`;

    // boost from bought
    let totalbees = p.bees + n_tributes.tmp.me[3] + p.RJbees - 1;
    let totalHives = p.hives + p.RJhives - 1;
    let totalFlowerFields = p.flowerFields + p.flowerGodTributes + p.RJflowerFields + p.flowerGodRJTributes - 1;

    d.buyHive.title = `1.01 ^ ${totalHives.toFixed(0)} = ${format(1.01 ** totalHives)}`;
    if (n_tributes.tmp.me[5] == 1) d.buyFlowerField.title = `1.01 ^ ${totalFlowerFields.toFixed(0)} = ${format(1.01 ** totalFlowerFields)}`;
    else d.buyFlowerField.title = `1.01 ^ ${format(totalFlowerFields)} = ${format(1.01 ** totalFlowerFields)}`;
    if (n_tributes.tmp.me[5] == 1 && n_tributes.tmp.me[3] == 1)
      d.buyBee.title = `1.01 ^ ${totalbees.toFixed(0)} = ${format(1.01 ** totalbees)}`;
    else d.buyBee.title = `1.01 ^ ${format(totalbees)} = ${format(1.01 ** totalbees)}`;

    // buy max
    if (tmp.flowerFieldsToBuy == 0) d.buyMaxFlowerField.disabled = true;
    else d.buyMaxFlowerField.disabled = false;
    if (tmp.beesToBuy == 0) d.buyMaxBee.disabled = true;
    else d.buyMaxBee.disabled = false;
    if (tmp.hivesToBuy == 0) d.buyMaxHive.disabled = true;
    else d.buyMaxHive.disabled = false;

    d.buyMaxFlowerFieldAmount.innerHTML = format(tmp.flowerFieldsToBuy, -3);
    d.buyMaxBeeAmount.innerHTML = format(tmp.beesToBuy, -3);
    d.buyMaxHiveAmount.innerHTML = format(tmp.hivesToBuy, -3);

    d.buyMaxFlowerFieldPrice.innerHTML = format(tmp.flowerFieldsPrice);
    d.buyMaxBeePrice.innerHTML = format(tmp.beesPrice);
    d.buyMaxHivePrice.innerHTML = format(tmp.hivesPrice);

    d.buyMaxFlowerFieldS.innerHTML = tmp.flowerFieldsToBuy == 1 ? "" : "s";
    d.buyMaxBeeS.innerHTML = tmp.beesToBuy == 1 ? "" : "s";
    d.buyMaxHiveS.innerHTML = tmp.hivesToBuy == 1 ? "" : "s";
  };
  export const display = () => {
    // 50% bees
    if (!p.hge) {
      d.equalResources.style.display = "none";
      d.maxForagerProduction.style.display = "none";
      d.maxHoneyProduction.style.display = "none";
    } else {
      d.equalResources.style.display = "";
      d.maxForagerProduction.style.display = "";
      d.maxHoneyProduction.style.display = "";
    }

    // 0/-/+/max bee
    if (!p.foragerBees) d.set0ForagerBees.disabled = true;
    else d.set0ForagerBees.disabled = false;
    if (p.foragerBees == tmp.maxForagerBees || (p.honeyBees == 0 && p.freeBees == 0)) d.maxForagerBees.disabled = true;
    else d.maxForagerBees.disabled = false;
    if (p.foragerBees == tmp.maxForagerBees || (p.honeyBees < 1 && p.freeBees < 1) || p.foragerBees + 1 > tmp.maxForagerBees)
      d.plusForagerBees.disabled = true;
    else d.plusForagerBees.disabled = false;
    if (p.foragerBees == 0 || p.foragerBees - 1 < 0) d.minusForagerBees.disabled = true;
    else d.minusForagerBees.disabled = false;

    if (!p.honeyBees) d.set0HoneyBees.disabled = true;
    else d.set0HoneyBees.disabled = false;
    if (p.honeyBees == tmp.maxHoneyBees || (p.foragerBees == 0 && p.freeBees == 0)) d.maxHoneyBees.disabled = true;
    else d.maxHoneyBees.disabled = false;
    if (p.honeyBees == tmp.maxHoneyBees || (p.foragerBees < 1 && p.freeBees < 1) || p.honeyBees + 1 > tmp.maxHoneyBees)
      d.plusHoneyBees.disabled = true;
    else d.plusHoneyBees.disabled = false;
    if (p.honeyBees == 0 || p.honeyBees - 1 < 0) d.minusHoneyBees.disabled = true;
    else d.minusHoneyBees.disabled = false;

    // auto assign
    d.foragerbeestextunderline.style.textDecorationLine = "none";
    d.honeybeestextunderline.style.textDecorationLine = "none";
    if (p.hge) {
      if (p.autoAsignBeesTo[0] == "forager") d.foragerbeestextunderline.style.textDecorationLine = "underline";
      if (p.autoAsignBeesTo[0] == "honey") d.honeybeestextunderline.style.textDecorationLine = "underline";
      if (p.autoAsignBeesTo[1] == "forager") d.foragerbeestextunderline.style.textDecorationLine = "underline";
      if (p.autoAsignBeesTo[1] == "honey") d.honeybeestextunderline.style.textDecorationLine = "underline";
      if (p.autoAsignBeesTo[0] == "forager") d.foragerbeestextunderline.style.textDecorationStyle = "solid";
      if (p.autoAsignBeesTo[0] == "honey") d.honeybeestextunderline.style.textDecorationStyle = "solid";
      if (p.autoAsignBeesTo[1] == "forager") d.foragerbeestextunderline.style.textDecorationStyle = "dashed";
      if (p.autoAsignBeesTo[1] == "honey") d.honeybeestextunderline.style.textDecorationStyle = "dashed";
    } else {
      p.autoAsignBeesTo = [];
    }
  };
  export const calc = () => {
    // max bees
    tmp.maxForagerBees = getMaxForagerBees();
    tmp.maxHoneyBees = getMaxHoneyBees();

    // buy
    tmp.flowerFieldPrice = getFlowerFieldPrice();
    tmp.beePrice = getBeePrice();
    tmp.hivePrice = getHivePrice();

    // buy max
    [tmp.flowerFieldsToBuy, tmp.flowerFieldsPrice] = flowerFieldCost.maxFunction(p.money);
    [tmp.beesToBuy, tmp.beesPrice] = beeCost.maxFunction(p.honey);
    [tmp.hivesToBuy, tmp.hivesPrice] = hiveCost.maxFunction(p.pollen);
  };
  export const autobuy = () => {
    let a = p.autobuy.structures;

    if (a.flower || a.bee || a.hive) {
      d.autoStructures.style.display = "";
      d.structuresBuyAt.style.display = "";
    } else {
      d.autoStructures.style.display = "none";
      d.structuresBuyAt.style.display = "none";
    }

    if (a.flower) {
      d.autoflowerWrapper.style.display = "";
      d.autoflowerWrapper2.style.display = "";
      d.quickautoflowerBuy.style.display = "";
      d.autoflowerBuy.style.display = "";
      d.autoflowerButtonWrapper.style.display = "none";
    } else {
      d.autoflowerWrapper.style.display = "none";
      d.autoflowerWrapper2.style.display = "none";
      d.quickautoflowerBuy.style.display = "none";
      d.autoflowerBuy.style.display = "none";
      d.autoflowerButtonWrapper.style.display = "";
      d.quickautoflowerBuy.checked = false;
      d.autoflowerBuy.checked = false;
    }

    if (a.bee) {
      d.autobeeWrapper.style.display = "";
      d.autobeeWrapper2.style.display = "";
      d.quickautobeeBuy.style.display = "";
      d.autobeeBuy.style.display = "";
      d.autobeeButtonWrapper.style.display = "none";
    } else {
      d.autobeeWrapper.style.display = "none";
      d.autobeeWrapper2.style.display = "none";
      d.quickautobeeBuy.style.display = "none";
      d.autobeeBuy.style.display = "none";
      d.autobeeButtonWrapper.style.display = "";
      d.quickautobeeBuy.checked = false;
      d.autobeeBuy.checked = false;
    }

    if (a.hive) {
      d.autohiveWrapper.style.display = "";
      d.autohiveWrapper2.style.display = "";
      d.quickautohiveBuy.style.display = "";
      d.autohiveBuy.style.display = "";
      d.autohiveButtonWrapper.style.display = "none";
    } else {
      d.autohiveWrapper.style.display = "none";
      d.autohiveWrapper2.style.display = "none";
      d.quickautohiveBuy.style.display = "none";
      d.autohiveBuy.style.display = "none";
      d.autohiveButtonWrapper.style.display = "";
      d.quickautohiveBuy.checked = false;
      d.autohiveBuy.checked = false;
    }

    beeCost.level = p.bees;
    beeCost.offset = getBeePriceMult();

    hiveCost.level = p.hives;
    hiveCost.offset = getHivePriceMult();

    flowerFieldCost.level = p.flowerFields;
    flowerFieldCost.offset = getFlowerFieldPriceMult();

    let [ftb, fp] = flowerFieldCost.maxFunction((p.money / 100) * a.flowerBuyPercent);
    let [btb, bp] = beeCost.maxFunction((p.honey / 100) * a.beeBuyPercent);
    let [htb, hp] = hiveCost.maxFunction((p.pollen / 100) * a.hiveBuyPercent);

    // console.log(flowerFieldsToBuy, beesToBuy, hivesToBuy);

    if (a.on) {
      if (a.flower && a.flowerBuy) {
        p.money -= fp;
        p.flowerFields += ftb;
      }
      if (a.bee && a.beeBuy) {
        p.honey -= bp;
        p.bees += btb;
        if (btb > 0) {
          let beesLeft = btb * n_sacrifices.tmp.honeyGodEffect;
          if (p.autoAsignBeesTo[0] != undefined) beesLeft = assignBeesTo(p.autoAsignBeesTo[0], beesLeft);
          if (p.autoAsignBeesTo[1] != undefined) beesLeft = assignBeesTo(p.autoAsignBeesTo[1], beesLeft);
          assignBeesTo("free", beesLeft);
        }
      }
      if (a.hive && a.hiveBuy) {
        p.pollen -= hp;
        p.hives += htb;
      }
    }
  };
}

const getSGTBees = (tributes: number) => {
  return stepwise2(3, tributes) / n_tributes.tmp.me[2];
};

const getNSGTBees = (bees: number) => {
  return reversedstepwise2(3, bees * n_tributes.tmp.me[2]);
};

namespace n_sacrifices {
  export let tmp = {
    pollenGodEffect: 1,
    nectarGodEffect: 1,
    honeyGodEffect: 1,
    flowerGodEffect: 1,
    capitalistGodEffect: 1,

    pollenGodTributesToGet: 0,
    nectarGodTributesToGet: 0,
    honeyGodTributesToGet: 0,
    flowerGodTributesToGet: 0,
    capitalistGodTributesToGet: 0,

    pollenForNext: 0,
    nectarForNext: 0,
    honeyForNext: 0,
    flowersForNext: 0,
    moneyForNext: 0,

    pollenBeesForNext: 0,
    nectarBeesForNext: 0,
    honeyBeesForNext: 0,
    flowersBeesForNext: 0,
    moneyBeesForNext: 0,
  };
  export const text = () => {
    // first sacrifice reset highlight
    if (p.totalSacrifices > 0) d.sacrificeResets.classList.add("lighttext");
    else d.sacrificeResets.classList.remove("lighttext");

    // title / boost
    let pp = (p.pollenGodTributes + p.pollenGodRJTributes) * n_tributes.tmp.me[5];
    let np = (p.nectarGodTributes + p.nectarGodRJTributes) * n_tributes.tmp.me[5];
    let hp = (p.honeyGodTributes + p.honeyGodRJTributes) * n_tributes.tmp.me[5];
    let fp = (p.flowerGodTributes + p.flowerGodRJTributes) * n_tributes.tmp.me[5];
    let cp = (p.capitalistGodTributes + p.capitalistGodRJTributes) * n_tributes.tmp.me[5];

    d.sacrificeToPollenGod.title = `1.03 ^ ${format(pp, 1)} = ${format(tmp.pollenGodEffect)}`;
    d.sacrificeToNectarGod.title = `1.03 ^ ${format(np, 1)} = ${format(tmp.nectarGodEffect)}`;
    d.sacrificeToHoneyGod.title = `1.03 ^ ${format(hp, 1)} = ${format(tmp.honeyGodEffect)}`;
    d.sacrificeToFlowerGod.title = `1.03 ^ ${format(fp, 1)} = ${format(tmp.flowerGodEffect)}`;
    d.sacrificeToCapitalistGod.title = `1.03 ^ ${format(cp, 1)} = ${format(tmp.capitalistGodEffect)}`;

    // required resource
    if (n_gods.tmp.pollenGodMaxTributes <= p.pollenGodTributes) d.nextPollenGodTribute.innerHTML = "???";
    else d.nextPollenGodTribute.innerHTML = format(tmp.pollenForNext);
    if (n_gods.tmp.nectarGodMaxTributes <= p.nectarGodTributes) d.nextNectarGodTribute.innerHTML = "???";
    else d.nextNectarGodTribute.innerHTML = format(tmp.nectarForNext);
    if (n_gods.tmp.honeyGodMaxTributes <= p.honeyGodTributes) d.nextHoneyGodTribute.innerHTML = "???";
    else d.nextHoneyGodTribute.innerHTML = format(tmp.honeyForNext);
    if (n_gods.tmp.flowerGodMaxTributes <= p.flowerGodTributes) d.nextFlowerGodTribute.innerHTML = "???";
    else d.nextFlowerGodTribute.innerHTML = format(tmp.flowersForNext);
    if (n_gods.tmp.capitalistGodMaxTributes <= p.capitalistGodTributes) d.nextCapitalistGodTribute.innerHTML = "???";
    else d.nextCapitalistGodTribute.innerHTML = format(tmp.moneyForNext);

    // required bees
    if (n_tributes.tmp.me[2] == 1) {
      d.nextPollenGodTributeBees.innerHTML = "" + tmp.pollenBeesForNext + " bee" + (tmp.pollenBeesForNext == 1 ? "" : "s");
      d.nextNectarGodTributeBees.innerHTML = "" + tmp.nectarBeesForNext + " bee" + (tmp.nectarBeesForNext == 1 ? "" : "s");
      d.nextHoneyGodTributeBees.innerHTML = "" + tmp.honeyBeesForNext + " bee" + (tmp.honeyBeesForNext == 1 ? "" : "s");
      d.nextFlowerGodTributeBees.innerHTML = "" + tmp.flowersBeesForNext + " bee" + (tmp.flowersBeesForNext == 1 ? "" : "s");
      d.nextCapitalistGodTributeBees.innerHTML = "" + tmp.moneyBeesForNext + " bee" + (tmp.moneyBeesForNext == 1 ? "" : "s");
    } else {
      d.nextPollenGodTributeBees.innerHTML = "" + format(tmp.pollenBeesForNext) + " bees";
      d.nextNectarGodTributeBees.innerHTML = "" + format(tmp.nectarBeesForNext) + " bees";
      d.nextHoneyGodTributeBees.innerHTML = "" + format(tmp.honeyBeesForNext) + " bees";
      d.nextFlowerGodTributeBees.innerHTML = "" + format(tmp.flowersBeesForNext) + " bees";
      d.nextCapitalistGodTributeBees.innerHTML = "" + format(tmp.moneyBeesForNext) + " bees";
    }

    if (n_gods.tmp.pollenGodMaxTributes <= p.pollenGodTributes) d.nextPollenGodTributeBees.innerHTML = "??? bees";
    if (n_gods.tmp.nectarGodMaxTributes <= p.nectarGodTributes) d.nextNectarGodTributeBees.innerHTML = "??? bees";
    if (n_gods.tmp.honeyGodMaxTributes <= p.honeyGodTributes) d.nextHoneyGodTributeBees.innerHTML = "??? bees";
    if (n_gods.tmp.flowerGodMaxTributes <= p.flowerGodTributes) d.nextFlowerGodTributeBees.innerHTML = "??? bees";
    if (n_gods.tmp.capitalistGodMaxTributes <= p.capitalistGodTributes) d.nextCapitalistGodTributeBees.innerHTML = "??? bees";

    // tributes to get
    /*prettier-ignore*/ d.pollenGodTributesToGet.innerHTML = "" + tmp.pollenGodTributesToGet + " tribute"+(tmp.pollenGodTributesToGet==1?'':'s');
    /*prettier-ignore*/ d.nectarGodTributesToGet.innerHTML = "" + tmp.nectarGodTributesToGet + " tribute"+(tmp.nectarGodTributesToGet==1?'':'s');
    /*prettier-ignore*/ d.honeyGodTributesToGet.innerHTML = "" + tmp.honeyGodTributesToGet + " tribute"+(tmp.honeyGodTributesToGet==1?'':'s');
    /*prettier-ignore*/ d.flowerGodTributesToGet.innerHTML = "" + tmp.flowerGodTributesToGet + " tribute"+(tmp.flowerGodTributesToGet==1?'':'s');
    /*prettier-ignore*/ d.capitalistGodTributesToGet.innerHTML = "" + tmp.capitalistGodTributesToGet + " tribute"+(tmp.capitalistGodTributesToGet==1?'':'s');

    // current tributes -> tributes after sacrifice
    /*prettier-ignore*/ d.pollenGodTributesAfterSacrifice.innerHTML = "" + `${p.pollenGodTributes} -> ${p.pollenGodTributes+tmp.pollenGodTributesToGet}`
    /*prettier-ignore*/ d.nectarGodTributesAfterSacrifice.innerHTML = "" + `${p.nectarGodTributes} -> ${p.nectarGodTributes+tmp.nectarGodTributesToGet}`
    /*prettier-ignore*/ d.honeyGodTributesAfterSacrifice.innerHTML = "" + `${p.honeyGodTributes} -> ${p.honeyGodTributes+tmp.honeyGodTributesToGet}`
    /*prettier-ignore*/ d.flowerGodTributesAfterSacrifice.innerHTML = "" + `${p.flowerGodTributes} -> ${p.flowerGodTributes+tmp.flowerGodTributesToGet}`
    /*prettier-ignore*/ d.capitalistGodTributesAfterSacrifice.innerHTML = "" + `${p.capitalistGodTributes} -> ${p.capitalistGodTributes + tmp.capitalistGodTributesToGet}`

    // + rj tributes
    /*prettier-ignore*/ if(p.pollenGodRJTributes) d.pollenGodTributesAfterSacrifice.innerHTML += " + <span class='rjtext'>" + p.pollenGodRJTributes + "</span>";
    /*prettier-ignore*/ if(p.nectarGodRJTributes) d.nectarGodTributesAfterSacrifice.innerHTML += " + <span class='rjtext'>" + p.nectarGodRJTributes + "</span>";
    /*prettier-ignore*/ if(p.honeyGodRJTributes) d.honeyGodTributesAfterSacrifice.innerHTML += " + <span class='rjtext'>" + p.honeyGodRJTributes + "</span>";
    /*prettier-ignore*/ if(p.flowerGodRJTributes) d.flowerGodTributesAfterSacrifice.innerHTML += " + <span class='rjtext'>" + p.flowerGodRJTributes + "</span>";
    /*prettier-ignore*/ if(p.capitalistGodRJTributes) d.capitalistGodTributesAfterSacrifice.innerHTML += " + <span class='rjtext'>" + p.capitalistGodRJTributes + "</span>";
  };
  export const calc = () => {
    // god tributes effect
    tmp.pollenGodEffect = 1.03 ** (p.pollenGodTributes + p.pollenGodRJTributes);
    tmp.nectarGodEffect = 1.03 ** (p.nectarGodTributes + p.nectarGodRJTributes);
    tmp.honeyGodEffect = 1.03 ** (p.honeyGodTributes + p.honeyGodRJTributes);
    tmp.flowerGodEffect = 1.03 ** (p.flowerGodTributes + p.flowerGodRJTributes);
    tmp.capitalistGodEffect = 1.03 ** (p.capitalistGodTributes + p.capitalistGodRJTributes);

    // tributes to get from resources
    let frompollen = getSmallGodTribute(p.highestpollen);
    let fromnectar = getSmallGodTribute(p.highestnectar);
    let fromhoney = getSmallGodTribute(p.highesthoney);
    let fromflowers = getSmallGodTribute2(p.highestflowers);
    let frommoney = getSmallGodTribute(p.highestmoney);

    //? v ? ? ? idk
    // const getRequiredBees = (tributes: number): number => {
    //   return stepwise2(3, tributes * n_tributes.tmp.me[2]);
    // };

    // tributes to get from bees
    // TODO:!!!!!!!!!!!!!!!!!!!!
    // from resource bees

    let frombees = getNSGTBees(totalBees());
    let fpb = Math.floor(Math.min(frombees, frompollen));
    let fnb = Math.floor(Math.min(frombees, fromnectar));
    let fhb = Math.floor(Math.min(frombees, fromhoney));
    let ffb = Math.floor(Math.min(frombees, fromflowers));
    let fmb = Math.floor(Math.min(frombees, frommoney));
    // console.log(fromhoneyBees);

    //TODO put sacrifices to god in corrent positions

    // todo:
    /// eyJmbG93ZXJzIjoxMzA5Ljc5OTc2NzQ0MDAwMTIsInBvbGxlbiI6MTIxLjE4MDg2ODI4MzQyMjUzLCJuZWN0YXIiOjQ4LjE0NTI4MDAzMDc5MDA5LCJob25leSI6MC4xNDcwNTYwMTM2NjY3MzEyLCJtb25leSI6MjQuMjg5MDAyNDI4NDc5NjAyLCJoaWdoZXN0Zmxvd2VycyI6MTMwOS43OTk3Njc0NDAwMDEyLCJoaWdoZXN0cG9sbGVuIjoxMjEuMTgwODY4MjgzNDIyNTMsImhpZ2hlc3RuZWN0YXIiOjEwNiwiaGlnaGVzdGhvbmV5Ijo0NC40MTA3MDE5OTM5NjEyOSwiaGlnaGVzdG1vbmV5IjoyNC4yODkwMDI0Mjg0Nzk2MDIsInRvdGFsZmxvd2VycyI6MTA3NzAuNzQ3NjgxNzgyMDI0LCJ0b3RhbHBvbGxlbiI6MTY2My45MjAzOTYyMjQ5NTUzLCJ0b3RhbG5lY3RhciI6MTY3MS44MzAzNzM1MjE5MDIsInRvdGFsaG9uZXkiOjcyOC4xNjQxMzkyMjYyODEyLCJ0b3RhbG1vbmV5IjoyNTEyLjY1MzY0MTUzMTI5NCwiYmVlcyI6NCwiZnJlZUJlZXMiOjkuMzQ3MDQxMzc3MjI5MDEzLCJmb3JhZ2VyQmVlcyI6MCwiaG9uZXlCZWVzIjowLCJmbG93ZXJGaWVsZHMiOjEsImhpdmVzIjoxLCJ0b3RhbFNhY3JpZmljZXMiOjAsInBvbGxlbkdvZFRyaWJ1dGVzIjo0LCJuZWN0YXJHb2RUcmlidXRlcyI6MiwiaG9uZXlHb2RUcmlidXRlcyI6NywiZmxvd2VyR29kVHJpYnV0ZXMiOjEsImNhcGl0YWxpc3RHb2RUcmlidXRlcyI6NCwiYXV0b0FzaWduQmVlc1RvIjpbImZvcmFnZXIiLCJob25leSJdLCJwZ2UiOnRydWUsIm5nZSI6dHJ1ZSwiaGdlIjp0cnVlLCJmZ2UiOnRydWUsImNnZSI6dHJ1ZSwic2VsbGluZ0hvbmV5Ijp0cnVlLCJhdXRvc2F2ZXMiOmZhbHNlLCJ1bmxvY2tzIjp7ImJlZXMiOnRydWUsImZvcmFnZXJCZWVzIjp0cnVlLCJoaXZlIjp0cnVlLCJob25leUJlZXMiOnRydWUsInNhY3JpZmljaW5nIjp0cnVlLCJ0cmlidXRlcyI6dHJ1ZSwiamVsbHkiOmZhbHNlLCJqZWxseTIiOmZhbHNlfSwibGFzdFVwZGF0ZSI6MTY2NjkwNzkzNDE0MSwib2ZmbGluZVRpbWUiOjg4Ny40MzE5OTk5OTk5NDY4LCJSSiI6MCwiaGlnaGVzdFJKIjowLCJ0b3RhbFJKIjowLCJSSmJlZXMiOjAsIlJKZmxvd2VyRmllbGRzIjowLCJSSmhpdmVzIjowLCJSSlRyaWJ1dGVzIjowLCJ1bnVzZWRSSlRyaWJ1dGVzIjowLCJwb2xsZW5Hb2RSSlRyaWJ1dGVzIjowLCJuZWN0YXJHb2RSSlRyaWJ1dGVzIjowLCJob25leUdvZFJKVHJpYnV0ZXMiOjAsImZsb3dlckdvZFJKVHJpYnV0ZXMiOjAsImNhcGl0YWxpc3RHb2RSSlRyaWJ1dGVzIjowLCJ0YWIiOiJzZXR0aW5ncyIsImRhcmttb2RlIjp0cnVlLCJiaWdCdXR0b25zIjpmYWxzZSwiZGlzcGxheUV2ZXJ5dGhpbmciOmZhbHNlLCJleGNoYW5nZUNvbmZpcm1hdGlvbiI6dHJ1ZSwiaWNvbk1vdmUiOmZhbHNlfQ ==
    // 3(9) 9 6(9) 6(8) 9 eyJmbG93ZXJzIjo1MTA4Ljc5MzI3OTIzMzE2NSwicG9sbGVuIjoxNjg1LjY1NTY0NjAxMjU0LCJuZWN0YXIiOjE5MS41ODM0MTU0ODYwMDUxMiwiaG9uZXkiOjc2Ny4yNzY2OTQzMjc3NDc4LCJtb25leSI6MjQuOTYzMDM2Mjg0OTgwNTE4LCJoaWdoZXN0Zmxvd2VycyI6NTEwOC43OTMyNzkyMzMxNjUsImhpZ2hlc3Rwb2xsZW4iOjE2ODUuNjU1NjQ2MDEyNTQsImhpZ2hlc3RuZWN0YXIiOjE5MS41ODM0MTU0ODYwMDUxMiwiaGlnaGVzdGhvbmV5Ijo3NjcuMjc2Njk0MzI3NzQ3OCwiaGlnaGVzdG1vbmV5IjoxNDguODM2Nzg1MTQ0NjYwMTgsInRvdGFsZmxvd2VycyI6NTI2MzYuMTc0MTc0MzM5ODgsInRvdGFscG9sbGVuIjo0Nzc0LjMzODk1ODkzODY1LCJ0b3RhbG5lY3RhciI6Nzg3Mi4yNTkzMzYxODU4NDQsInRvdGFsaG9uZXkiOjUyNjEuODAxMTczMjIzODU3LCJ0b3RhbG1vbmV5Ijo5NzcuMTg0OTIxMjEwODQ1NywiYmVlcyI6MzAsImZyZWVCZWVzIjowLCJmb3JhZ2VyQmVlcyI6MjAuMzcsImhvbmV5QmVlcyI6MjMuNDM0NDE3ODcxNzAwMDIsImZsb3dlckZpZWxkcyI6MTMsImhpdmVzIjoxOSwidG90YWxTYWNyaWZpY2VzIjowLCJwb2xsZW5Hb2RUcmlidXRlcyI6MywibmVjdGFyR29kVHJpYnV0ZXMiOjksImhvbmV5R29kVHJpYnV0ZXMiOjYsImZsb3dlckdvZFRyaWJ1dGVzIjo2LCJjYXBpdGFsaXN0R29kVHJpYnV0ZXMiOjksImF1dG9Bc2lnbkJlZXNUbyI6WyJmb3JhZ2VyIiwiaG9uZXkiXSwicGdlIjp0cnVlLCJuZ2UiOnRydWUsImhnZSI6dHJ1ZSwiZmdlIjp0cnVlLCJjZ2UiOnRydWUsInNlbGxpbmdIb25leSI6ZmFsc2UsImF1dG9zYXZlcyI6dHJ1ZSwidW5sb2NrcyI6eyJiZWVzIjp0cnVlLCJmb3JhZ2VyQmVlcyI6dHJ1ZSwiaGl2ZSI6dHJ1ZSwiaG9uZXlCZWVzIjp0cnVlLCJzYWNyaWZpY2luZyI6dHJ1ZSwidHJpYnV0ZXMiOnRydWUsImplbGx5IjpmYWxzZSwiamVsbHkyIjpmYWxzZX0sImxhc3RVcGRhdGUiOjE2NjcxNDE0Njc0MjksIm9mZmxpbmVUaW1lIjo5OTIzOS44NTMwMDAwMjk3OSwiUkoiOjAsImhpZ2hlc3RSSiI6MCwidG90YWxSSiI6MCwiUkpiZWVzIjowLCJSSmZsb3dlckZpZWxkcyI6MCwiUkpoaXZlcyI6MCwiUkpUcmlidXRlcyI6MCwidW51c2VkUkpUcmlidXRlcyI6MCwicG9sbGVuR29kUkpUcmlidXRlcyI6MCwibmVjdGFyR29kUkpUcmlidXRlcyI6MCwiaG9uZXlHb2RSSlRyaWJ1dGVzIjowLCJmbG93ZXJHb2RSSlRyaWJ1dGVzIjowLCJjYXBpdGFsaXN0R29kUkpUcmlidXRlcyI6MCwidGFiIjoic2V0dGluZ3MiLCJkYXJrbW9kZSI6dHJ1ZSwiYmlnQnV0dG9ucyI6ZmFsc2UsImRpc3BsYXlFdmVyeXRoaW5nIjp0cnVlLCJleGNoYW5nZUNvbmZpcm1hdGlvbiI6dHJ1ZSwiaWNvbk1vdmUiOmZhbHNlLCJsYXN0Ukpmcm9tZmxvd2VycyI6MCwibGFzdFJKZnJvbXBvbGxlbiI6MCwibGFzdFJKZnJvbW5lY3RhciI6MCwibGFzdFJKZnJvbWhvbmV5IjowLCJsYXN0Ukpmcm9tbW9uZXkiOjB9
    //// eyJmbG93ZXJzIjo1MDg2LjU0NzQ1NDI4ODI4OSwicG9sbGVuIjo3MTMuNzg3MzI2MzkyMDQyOCwibmVjdGFyIjo4OTAuMDMxMzY0MTI0Mzk1NCwiaG9uZXkiOjE1My42NjM0ODgwNzQ0NTI5LCJtb25leSI6OTQuMDMwMDYyNTgzMDcxMTYsImhpZ2hlc3RmbG93ZXJzIjo1MDg2LjU0NzQ1NDI4ODI4OSwiaGlnaGVzdHBvbGxlbiI6NzEzLjc4NzMyNjM5MjA0MjgsImhpZ2hlc3RuZWN0YXIiOjg5MC4wMzEzNjQxMjQzOTU0LCJoaWdoZXN0aG9uZXkiOjE1My42NjM0ODgwNzQ0NTI5LCJoaWdoZXN0bW9uZXkiOjk0LjAzMDA2MjU4MzA3MTE2LCJ0b3RhbGZsb3dlcnMiOjM1NDYwMi42NDU1ODc1OTc0LCJ0b3RhbHBvbGxlbiI6MTUzMDIuMTkzNDE0ODk3MzQ3LCJ0b3RhbG5lY3RhciI6MjM2ODAuNjM1MDk0NjU3NjMsInRvdGFsaG9uZXkiOjE4MzAyLjY3MTU3MDE4NTczLCJ0b3RhbG1vbmV5Ijo0MjA2LjI4NzQ4NTM0MzY1MSwiYmVlcyI6MTUsImZyZWVCZWVzIjowLCJmb3JhZ2VyQmVlcyI6MjguNzUsImhvbmV5QmVlcyI6OS41ODcxODcyNjAxNjIxNzMsImZsb3dlckZpZWxkcyI6MSwiaGl2ZXMiOjE1LCJ0b3RhbFNhY3JpZmljZXMiOjAsInBvbGxlbkdvZFRyaWJ1dGVzIjoxMSwibmVjdGFyR29kVHJpYnV0ZXMiOjksImhvbmV5R29kVHJpYnV0ZXMiOjExLCJmbG93ZXJHb2RUcmlidXRlcyI6MTUsImNhcGl0YWxpc3RHb2RUcmlidXRlcyI6OSwiYXV0b0FzaWduQmVlc1RvIjpbImZvcmFnZXIiLCJob25leSJdLCJwZ2UiOnRydWUsIm5nZSI6dHJ1ZSwiaGdlIjp0cnVlLCJmZ2UiOnRydWUsImNnZSI6dHJ1ZSwic2VsbGluZ0hvbmV5Ijp0cnVlLCJhdXRvc2F2ZXMiOnRydWUsInVubG9ja3MiOnsiYmVlcyI6dHJ1ZSwiZm9yYWdlckJlZXMiOnRydWUsImhpdmUiOnRydWUsImhvbmV5QmVlcyI6dHJ1ZSwic2FjcmlmaWNpbmciOnRydWUsInRyaWJ1dGVzIjp0cnVlLCJqZWxseSI6ZmFsc2UsImplbGx5MiI6ZmFsc2V9LCJsYXN0VXBkYXRlIjoxNjY3MTQyMjE2MDEwLCJvZmZsaW5lVGltZSI6OTY4NDIuNzc5MDAwMDI0NzUsIlJKIjowLCJoaWdoZXN0UkoiOjAsInRvdGFsUkoiOjAsIlJKYmVlcyI6MCwiUkpmbG93ZXJGaWVsZHMiOjAsIlJKaGl2ZXMiOjAsIlJKVHJpYnV0ZXMiOjAsInVudXNlZFJKVHJpYnV0ZXMiOjAsInBvbGxlbkdvZFJKVHJpYnV0ZXMiOjAsIm5lY3RhckdvZFJKVHJpYnV0ZXMiOjAsImhvbmV5R29kUkpUcmlidXRlcyI6MCwiZmxvd2VyR29kUkpUcmlidXRlcyI6MCwiY2FwaXRhbGlzdEdvZFJKVHJpYnV0ZXMiOjAsInRhYiI6InNldHRpbmdzIiwiZGFya21vZGUiOnRydWUsImJpZ0J1dHRvbnMiOmZhbHNlLCJkaXNwbGF5RXZlcnl0aGluZyI6dHJ1ZSwiZXhjaGFuZ2VDb25maXJtYXRpb24iOnRydWUsImljb25Nb3ZlIjpmYWxzZSwibGFzdFJKZnJvbWZsb3dlcnMiOjAsImxhc3RSSmZyb21wb2xsZW4iOjAsImxhc3RSSmZyb21uZWN0YXIiOjAsImxhc3RSSmZyb21ob25leSI6MCwibGFzdFJKZnJvbW1vbmV5IjowfQ==
    ///// eyJmbG93ZXJzIjo1MzA1MzguNzY4MjM3MjE3MiwicG9sbGVuIjoxMTc0MTEuMzczOTk0Njk1NzQsIm5lY3RhciI6MTMzOTguODQwODQ4ODQ5OTcyLCJob25leSI6MTU0MDM5Ljc5OTU5MTkyNDg1LCJtb25leSI6MTA4NjA0Ljk1OTIyNTgzODA0LCJoaWdoZXN0Zmxvd2VycyI6NTMwNTM4Ljc2ODIzNzIxNzIsImhpZ2hlc3Rwb2xsZW4iOjExNzU5MC43NDA4ODkwNjcwNSwiaGlnaGVzdG5lY3RhciI6MTMzOTguODQwODQ4ODQ5OTcyLCJoaWdoZXN0aG9uZXkiOjE1NTg0MC4zMzE3NTM5MDUwOCwiaGlnaGVzdG1vbmV5IjoxMDg2MTAuNTgzOTU1NDMwMTgsInRvdGFsZmxvd2VycyI6MTc0MjM0Ny45OTYxODE1ODkzLCJ0b3RhbHBvbGxlbiI6MTQ2MjY2Ljc4NTE0Njk1OTcsInRvdGFsbmVjdGFyIjozNTExNDIuMzI1MTg3NDE3NzQsInRvdGFsaG9uZXkiOjMyMjkyOC4zNzk5MTIyNzE2MywidG90YWxtb25leSI6MTEzMTkxLjQyMTkxOTczMDY1LCJiZWVzIjo0MCwiZnJlZUJlZXMiOjAsImZvcmFnZXJCZWVzIjo0NS4wMzU0MjE2NjE2NDUwNiwiaG9uZXlCZWVzIjozMC4zODI2NTY2ODc2MTMyOCwiZmxvd2VyRmllbGRzIjo0LCJoaXZlcyI6MzAsInRvdGFsU2FjcmlmaWNlcyI6MCwicG9sbGVuR29kVHJpYnV0ZXMiOjExLCJuZWN0YXJHb2RUcmlidXRlcyI6MTUsImhvbmV5R29kVHJpYnV0ZXMiOjExLCJmbG93ZXJHb2RUcmlidXRlcyI6MTUsImNhcGl0YWxpc3RHb2RUcmlidXRlcyI6OSwiYXV0b0FzaWduQmVlc1RvIjpbImhvbmV5IiwiZm9yYWdlciJdLCJwZ2UiOnRydWUsIm5nZSI6dHJ1ZSwiaGdlIjp0cnVlLCJmZ2UiOnRydWUsImNnZSI6dHJ1ZSwic2VsbGluZ0hvbmV5IjpmYWxzZSwidW5sb2NrcyI6eyJiZWVzIjp0cnVlLCJmb3JhZ2VyQmVlcyI6dHJ1ZSwiaGl2ZSI6dHJ1ZSwiaG9uZXlCZWVzIjp0cnVlLCJzYWNyaWZpY2luZyI6dHJ1ZSwidHJpYnV0ZXMiOnRydWUsImplbGx5IjpmYWxzZSwiamVsbHkyIjpmYWxzZX0sImxhc3RVcGRhdGUiOjE2NjcxNjQ4NDg3OTYsIm9mZmxpbmVUaW1lIjoxMDM3NDguMDY5MDAwMDQyNTEsIlJKIjowLCJoaWdoZXN0UkoiOjAsInRvdGFsUkoiOjAsIlJKYmVlcyI6MCwiUkpmbG93ZXJGaWVsZHMiOjAsIlJKaGl2ZXMiOjAsIlJKVHJpYnV0ZXMiOjAsInVudXNlZFJKVHJpYnV0ZXMiOjAsInBvbGxlbkdvZFJKVHJpYnV0ZXMiOjAsIm5lY3RhckdvZFJKVHJpYnV0ZXMiOjAsImhvbmV5R29kUkpUcmlidXRlcyI6MCwiZmxvd2VyR29kUkpUcmlidXRlcyI6MCwiY2FwaXRhbGlzdEdvZFJKVHJpYnV0ZXMiOjAsInRhYiI6InNldHRpbmdzIiwibGFzdFJKZnJvbWZsb3dlcnMiOjAsImxhc3RSSmZyb21wb2xsZW4iOjAsImxhc3RSSmZyb21uZWN0YXIiOjAsImxhc3RSSmZyb21ob25leSI6MCwibGFzdFJKZnJvbW1vbmV5IjowLCJ2ZXJzaW9uIjowLjMsInNldHRpbmdzIjp7ImRhcmttb2RlIjp0cnVlLCJiaWdCdXR0b25zIjpmYWxzZSwiZGlzcGxheUV2ZXJ5dGhpbmciOnRydWUsImljb25Nb3ZlIjpmYWxzZSwic2FjcmlmaWNlQ29uZmlybWF0aW9uIjp0cnVlLCJleGNoYW5nZUNvbmZpcm1hdGlvbiI6dHJ1ZSwidG9nZ2xlSG9uZXlPZmZsaW5lVGltZSI6ZmFsc2UsInRvZ2dsZVNhY3JpZmljZU9mZmxpbmVUaW1lIjpmYWxzZSwidG9nZ2xlUkpPZmZsaW5lVGltZSI6dHJ1ZSwiYXV0b3NhdmVzIjp0cnVlfX0=
    ////// 20 20 20 20 20 before RJ   eyJmbG93ZXJzIjoyNTAsInBvbGxlbiI6MCwibmVjdGFyIjowLCJob25leSI6MSwibW9uZXkiOjAsImhpZ2hlc3RmbG93ZXJzIjowLCJoaWdoZXN0cG9sbGVuIjowLCJoaWdoZXN0bmVjdGFyIjowLCJoaWdoZXN0aG9uZXkiOjEsImhpZ2hlc3Rtb25leSI6MCwidG90YWxmbG93ZXJzIjo2NDgxOTA0LjU1ODYyMTA5OCwidG90YWxwb2xsZW4iOjM2NjYxOS40MDI1NTA1NDA0NiwidG90YWxuZWN0YXIiOjkyNDg4OC40NjEyNTk5ODQ5LCJ0b3RhbGhvbmV5Ijo2Nzk3NTYuNDA1MzYyODA5NywidG90YWxtb25leSI6ODEwNzM2LjM4Mjc2NjM4MTgsImJlZXMiOjAsImZyZWVCZWVzIjo1NS40MTg1MjU2NTg4MzkzMiwiZm9yYWdlckJlZXMiOjAsImhvbmV5QmVlcyI6MCwiZmxvd2VyRmllbGRzIjoxLCJoaXZlcyI6MSwidG90YWxTYWNyaWZpY2VzIjowLCJwb2xsZW5Hb2RUcmlidXRlcyI6MjAsIm5lY3RhckdvZFRyaWJ1dGVzIjoyMCwiaG9uZXlHb2RUcmlidXRlcyI6MjAsImZsb3dlckdvZFRyaWJ1dGVzIjoyMCwiY2FwaXRhbGlzdEdvZFRyaWJ1dGVzIjoyMCwiYXV0b0FzaWduQmVlc1RvIjpbImhvbmV5IiwiZm9yYWdlciJdLCJwZ2UiOnRydWUsIm5nZSI6dHJ1ZSwiaGdlIjp0cnVlLCJmZ2UiOnRydWUsImNnZSI6dHJ1ZSwic2VsbGluZ0hvbmV5IjpmYWxzZSwidW5sb2NrcyI6eyJiZWVzIjp0cnVlLCJmb3JhZ2VyQmVlcyI6dHJ1ZSwiaGl2ZSI6dHJ1ZSwiaG9uZXlCZWVzIjp0cnVlLCJzYWNyaWZpY2luZyI6dHJ1ZSwidHJpYnV0ZXMiOnRydWUsImplbGx5Ijp0cnVlLCJqZWxseTIiOmZhbHNlfSwibGFzdFVwZGF0ZSI6MTY2NzIxNjIxMjg0MCwib2ZmbGluZVRpbWUiOjE0OTk3NS44OTQwMDAwNDQyLCJSSiI6MCwiaGlnaGVzdFJKIjowLCJ0b3RhbFJKIjowLCJSSmJlZXMiOjAsIlJKZmxvd2VyRmllbGRzIjowLCJSSmhpdmVzIjowLCJSSlRyaWJ1dGVzIjowLCJ1bnVzZWRSSlRyaWJ1dGVzIjowLCJwb2xsZW5Hb2RSSlRyaWJ1dGVzIjowLCJuZWN0YXJHb2RSSlRyaWJ1dGVzIjowLCJob25leUdvZFJKVHJpYnV0ZXMiOjAsImZsb3dlckdvZFJKVHJpYnV0ZXMiOjAsImNhcGl0YWxpc3RHb2RSSlRyaWJ1dGVzIjowLCJ0YWIiOiJzZXR0aW5ncyIsImxhc3RSSmZyb21mbG93ZXJzIjowLCJsYXN0Ukpmcm9tcG9sbGVuIjowLCJsYXN0Ukpmcm9tbmVjdGFyIjowLCJsYXN0Ukpmcm9taG9uZXkiOjAsImxhc3RSSmZyb21tb25leSI6MCwidmVyc2lvbiI6MC4zLCJzZXR0aW5ncyI6eyJkYXJrbW9kZSI6dHJ1ZSwiYmlnQnV0dG9ucyI6ZmFsc2UsImRpc3BsYXlFdmVyeXRoaW5nIjpmYWxzZSwiaWNvbk1vdmUiOmZhbHNlLCJzYWNyaWZpY2VDb25maXJtYXRpb24iOmZhbHNlLCJleGNoYW5nZUNvbmZpcm1hdGlvbiI6ZmFsc2UsInRvZ2dsZUhvbmV5T2ZmbGluZVRpbWUiOnRydWUsInRvZ2dsZVNhY3JpZmljZU9mZmxpbmVUaW1lIjp0cnVlLCJ0b2dnbGVSSk9mZmxpbmVUaW1lIjp0cnVlLCJhdXRvc2F2ZXMiOnRydWV9fQ==
    tmp.pollenGodTributesToGet = Math.max(0, Math.min(frompollen, fpb) - p.pollenGodTributes);
    tmp.nectarGodTributesToGet = Math.max(0, Math.min(fromnectar, fnb) - p.nectarGodTributes);
    tmp.honeyGodTributesToGet = Math.max(0, Math.min(fromhoney, fhb) - p.honeyGodTributes);
    tmp.flowerGodTributesToGet = Math.max(0, Math.min(fromflowers, ffb) - p.flowerGodTributes);
    tmp.capitalistGodTributesToGet = Math.max(0, Math.min(frommoney, fmb) - p.capitalistGodTributes);

    let nextpt = Math.min(n_gods.tmp.pollenGodMaxTributes, p.pollenGodTributes + tmp.pollenGodTributesToGet + 1);
    let nextnt = Math.min(n_gods.tmp.nectarGodMaxTributes, p.nectarGodTributes + tmp.nectarGodTributesToGet + 1);
    let nextht = Math.min(n_gods.tmp.honeyGodMaxTributes, p.honeyGodTributes + tmp.honeyGodTributesToGet + 1);
    let nextft = Math.min(n_gods.tmp.flowerGodMaxTributes, p.flowerGodTributes + tmp.flowerGodTributesToGet + 1);
    let nextmt = Math.min(n_gods.tmp.capitalistGodMaxTributes, p.capitalistGodTributes + tmp.capitalistGodTributesToGet + 1);

    tmp.pollenGodTributesToGet =
      Math.min(n_gods.tmp.pollenGodMaxTributes, p.pollenGodTributes + tmp.pollenGodTributesToGet) - p.pollenGodTributes;
    tmp.nectarGodTributesToGet =
      Math.min(n_gods.tmp.nectarGodMaxTributes, p.nectarGodTributes + tmp.nectarGodTributesToGet) - p.nectarGodTributes;
    tmp.honeyGodTributesToGet =
      Math.min(n_gods.tmp.honeyGodMaxTributes, p.honeyGodTributes + tmp.honeyGodTributesToGet) - p.honeyGodTributes;
    tmp.flowerGodTributesToGet =
      Math.min(n_gods.tmp.flowerGodMaxTributes, p.flowerGodTributes + tmp.flowerGodTributesToGet) - p.flowerGodTributes;
    tmp.capitalistGodTributesToGet =
      Math.min(n_gods.tmp.capitalistGodMaxTributes, p.capitalistGodTributes + tmp.capitalistGodTributesToGet) - p.capitalistGodTributes;

    // console.log(
    //   " from resources:\n",
    //   `${Math.min(frompollen)} -> ${getNextsmallGodTribute(frompollen)} [${pt} -> ${getNextsmallGodTribute(pt)}]\n`,
    //   `${Math.min(fromnectar)} -> ${getNextsmallGodTribute(fromnectar)} [${nt} -> ${getNextsmallGodTribute(nt)}]\n`,
    //   `${Math.min(fromhoney)} -> ${getNextsmallGodTribute(fromhoney)} [${ht} -> ${getNextsmallGodTribute(ht)}]\n`,
    //   `${Math.min(fromflowers)} -> ${getNextsmallGodTribute2(fromflowers)} [${ft} -> ${getNextsmallGodTribute2(ft)}]\n`,
    //   `${Math.min(frommoney)} -> ${getNextsmallGodTribute(frommoney)} [${mt} -> ${getNextsmallGodTribute(mt)}]\n\n`,
    //   "from bees\n",
    //   fpb + " -> " + stepwise2(3, fpb) + " [" + pt + " -> " + stepwise2(3, pt) + "]" + "\n",
    //   fnb + " -> " + stepwise2(3, fnb) + " [" + nt + " -> " + stepwise2(3, nt) + "]" + "\n",
    //   fhb + " -> " + stepwise2(3, fhb) + " [" + ht + " -> " + stepwise2(3, ht) + "]" + "\n",
    //   ffb + " -> " + stepwise2(3, ffb) + " [" + ft + " -> " + stepwise2(3, ft) + "]" + "\n",
    //   fmb + " -> " + stepwise2(3, fmb) + " [" + mt + " -> " + stepwise2(3, mt) + "]"
    // );

    // actual tributes to get
    // console.log(fromnectar, fromnectarBees, p.nectarGodTributes);

    // next from resource / bees
    tmp.pollenForNext = getNextsmallGodTribute(Math.max(nextpt));
    tmp.nectarForNext = getNextsmallGodTribute(Math.max(nextnt));
    tmp.honeyForNext = getNextsmallGodTribute(Math.max(nextht));
    tmp.flowersForNext = getNextsmallGodTribute2(Math.max(nextft));
    tmp.moneyForNext = getNextsmallGodTribute(Math.max(nextmt));

    tmp.pollenBeesForNext = getSGTBees(nextpt);
    tmp.nectarBeesForNext = getSGTBees(nextnt);
    tmp.honeyBeesForNext = getSGTBees(nextht);
    tmp.flowersBeesForNext = getSGTBees(nextft);
    tmp.moneyBeesForNext = getSGTBees(nextmt);

    // disable buttons
    if (tmp.pollenGodTributesToGet > 0) d.sacrificeToPollenGod.disabled = false;
    else d.sacrificeToPollenGod.disabled = true;
    if (tmp.nectarGodTributesToGet > 0) d.sacrificeToNectarGod.disabled = false;
    else d.sacrificeToNectarGod.disabled = true;
    if (tmp.honeyGodTributesToGet > 0) d.sacrificeToHoneyGod.disabled = false;
    else d.sacrificeToHoneyGod.disabled = true;
    if (tmp.flowerGodTributesToGet > 0) d.sacrificeToFlowerGod.disabled = false;
    else d.sacrificeToFlowerGod.disabled = true;
    if (tmp.capitalistGodTributesToGet > 0) d.sacrificeToCapitalistGod.disabled = false;
    else d.sacrificeToCapitalistGod.disabled = true;
  };
}
namespace n_tributes {
  /*prettier-ignore*/
  export let def:TupleOf< number, 15>=[
    1, 1, 1, 0, 1,
    1, 1, 1, 1, 0,
    0, 0, 0, 0, 0,
  ]

  export let formula: TupleOf<(x?: number) => number, 15> = [
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** (x / 2), // 0 flowers mult
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** (x / 2), // 1 bees price
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** (x / 2), // 2 tribute div
    (x = tmp.totalTributes * tmp.me[5]) => x / 5, // 3 +bees
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** x, // 4 honey prod
    (x = tmp.totalTributes * tmp.me[5]) => Math.min(2, 1.02 ** (x / 10)), // 5 tribute eff capped at 9
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** (x / 2), // 6 nectar prod
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** (x / 3), // 7 honey price
    (x = tmp.totalTributes * tmp.me[5]) => 1.02 ** (x / 5), // 8 time speed
    () => 1, // 9 rj
    () => 1, // 10 combine
    () => 1, // 11 combine
    () => 1, // 12 combine
    () => 1, // 13 combine
    () => 1, // 14 challenges
  ];
  export let getText: TupleOf<() => string, 15> = [
    () => `${format(tmp.me[0])}x`, // 0 flowers mult
    () => `${format(tmp.me[1])}x`, // 1 bees price
    () => `${format(tmp.me[2])}x`, // 2 tribute div
    () => `+${format(tmp.me[3])}`, // 3 +bees
    () => `${format(tmp.me[4])}x`, // 4 honey prod
    () => (tmp.me[5] == 2 ? "2.00x (capped)" : `${format(tmp.me[5])}x`), // 5 tribute eff
    () => `${format(tmp.me[6])}x`, // 6 nectar prod
    () => `${format(tmp.me[7])}x`, // 7 honey price
    () => `${format(tmp.me[8])}x`, // 8 time speed
    () => "unlocked", // 9 rj
    () => "unlocked", // 10 combine
    () => "unlocked", // 11 combine
    () => "unlocked", // 12 combine
    () => "unlocked", // 13 combine
    () => "unlocked", // 14 challenges
  ];
  export let tmp: {
    sacrificeTributes: number;
    RJTributes: number;
    totalTributes: number;
    me: TupleOf<number, 15>;
  } = {
    sacrificeTributes: 0,
    RJTributes: 0,
    totalTributes: 0,
    me: def,
  };
  export const text = () => {
    // total tributes
    d.totalTributes.innerHTML = `${tmp.sacrificeTributes}`;
    if (tmp.me[5] > 1)
      d.totalTributes.innerHTML += ` + <span class="lighttext">${ft2(
        (tmp.totalTributes - tmp.RJTributes) * tmp.me[5] - (tmp.totalTributes - tmp.RJTributes)
      )}</span>`;
    if (p.RJTributes > 0) d.totalTributes.innerHTML += ` + <span class="rjtext">${p.RJTributes}</span>`;

    // tributes unlock
    for (let i = 0; i < tributes.length; i++)
      if (tmp.totalTributes < tributes[i]!.unlockAt) d[`m${i}e`].innerHTML = "";
      else d[`m${i}e`].innerHTML = getText[i]!();

    // cool tree
    for (let i = 0; i < tributes.length; i++) {
      if (tributes[i]!.unlockAt < tmp.totalTributes && i != tributes.length) {
        d.m[i].innerHTML = "├";
      } else {
        d.m[i].innerHTML = " ";
      }
      if (i != 0 && tributes[i]?.unlockAt! > tmp.totalTributes && tributes[i - 1]?.unlockAt! <= tmp.totalTributes)
        d.m[i - 1].innerHTML = "└";
    }
    if (tributes[tributes.length - 1]!.displayAt <= tmp.totalTributes) d.m[tributes.length - 1].innerHTML = "└";
  };
  export const calc = () => {
    tmp.sacrificeTributes = getTotalSacrificeTributes();
    tmp.RJTributes = getTotalRJTributes();
    tmp.totalTributes = tmp.sacrificeTributes + tmp.RJTributes;

    let tr = tmp.totalTributes * tmp.me[5];

    for (let i = 0; i < 15; i++) {
      if (tmp.totalTributes < tributes[i]!.unlockAt) tmp.me[i] = n_tributes.def[i]!;
      else tmp.me[i] = formula[i]!(tr);
    }
  };
}

namespace n_jelly {
  export const tmp = {
    RJBonus: 1, //      log2 current
    totalRJBonus: 1, // log3 total

    tmpunusedRJTributes: 0,
    tmpRJpollenGodTributes: 0,
    tmpRJnectarGodTributes: 0,
    tmpRJhoneyGodTributes: 0,
    tmpRJflowerGodTributes: 0,
    tmpRJcapitalistGodTributes: 0,

    RJflowerFieldsCost: 0,
    RJbeesCost: 0,
    RJhivesCost: 0,

    maxtributesToBuy: 0,
    maxtributesPrice: 0,
    tributeCos: 0,

    RJToGet: 0,
  };
  export const display = () => {
    if (p.unusedRJTributes > 0 || tmp.tmpunusedRJTributes > 0) d.addpollenGodTribute.disabled = false;
    else d.addpollenGodTribute.disabled = true;
    if (p.unusedRJTributes > 0 || tmp.tmpunusedRJTributes > 0) d.addnectarGodTribute.disabled = false;
    else d.addnectarGodTribute.disabled = true;
    if (p.unusedRJTributes > 0 || tmp.tmpunusedRJTributes > 0) d.addhoneyGodTribute.disabled = false;
    else d.addhoneyGodTribute.disabled = true;
    if (p.unusedRJTributes > 0 || tmp.tmpunusedRJTributes > 0) d.addflowerGodTribute.disabled = false;
    else d.addflowerGodTribute.disabled = true;
    if (p.unusedRJTributes > 0 || tmp.tmpunusedRJTributes > 0) d.addcapitalistGodTribute.disabled = false;
    else d.addcapitalistGodTribute.disabled = true;

    if (p.pollenGodRJTributes > 0 || tmp.tmpRJpollenGodTributes > 0) d.removepollenGodTribute.disabled = false;
    else d.removepollenGodTribute.disabled = true;
    if (p.nectarGodRJTributes > 0 || tmp.tmpRJnectarGodTributes > 0) d.removenectarGodTribute.disabled = false;
    else d.removenectarGodTribute.disabled = true;
    if (p.honeyGodRJTributes > 0 || tmp.tmpRJhoneyGodTributes > 0) d.removehoneyGodTribute.disabled = false;
    else d.removehoneyGodTribute.disabled = true;
    if (p.flowerGodRJTributes > 0 || tmp.tmpRJflowerGodTributes > 0) d.removeflowerGodTribute.disabled = false;
    else d.removeflowerGodTribute.disabled = true;
    if (p.capitalistGodRJTributes > 0 || tmp.tmpRJcapitalistGodTributes > 0) d.removecapitalistGodTribute.disabled = false;
    else d.removecapitalistGodTribute.disabled = true;
  };
  export const text = () => {
    // rj to get
    d.RJToGet.innerHTML = format(tmp.RJToGet, 1);

    // first rj reset highlight
    if (p.totalExchanges > 0) d.RJExchangeResets.classList.add("lighttext");
    else d.RJExchangeResets.classList.remove("lighttext");

    // total resoruces
    d.totalpollen.innerHTML = format(p.totalpollen);
    d.totalnectar.innerHTML = format(p.totalnectar);
    d.totalhoney.innerHTML = format(p.totalhoney);
    d.totalflowers.innerHTML = format(p.totalflowers);
    d.totalmoney.innerHTML = format(p.totalmoney);

    // RJ / boosts
    d.RJ.innerHTML = format(p.RJ);
    d.RJtotal.innerHTML = format(p.totalRJ);
    d.RJBoost.innerHTML = "x" + format(n_jelly.tmp.RJBonus);
    d.RJtotalBoost.innerHTML = "x" + format(n_jelly.tmp.totalRJBonus);

    d.RJpollenGodTributes.innerHTML = "" + p.pollenGodRJTributes;
    d.RJnectarGodTributes.innerHTML = "" + p.nectarGodRJTributes;
    d.RJhoneyGodTributes.innerHTML = "" + p.honeyGodRJTributes;
    d.RJflowerGodTributes.innerHTML = "" + p.flowerGodRJTributes;
    d.RJcapitalistGodTributes.innerHTML = "" + p.capitalistGodRJTributes;

    // autobuyers
    if (p.autobuy.structures.on) {
      d.autoflowerBuy.disabled = false;
      d.autobeeBuy.disabled = false;
      d.autohiveBuy.disabled = false;
      d.quickautoflowerBuy.disabled = false;
      d.quickautobeeBuy.disabled = false;
      d.quickautohiveBuy.disabled = false;
    } else {
      d.autoflowerBuy.disabled = true;
      d.autobeeBuy.disabled = true;
      d.autohiveBuy.disabled = true;
      d.quickautoflowerBuy.disabled = true;
      d.quickautobeeBuy.disabled = true;
      d.quickautohiveBuy.disabled = true;
    }

    d.quickautoflowerBuy.checked = p.autobuy.structures.flowerBuy;
    d.autoflowerBuy.checked = p.autobuy.structures.flowerBuy;

    d.quickautobeeBuy.checked = p.autobuy.structures.beeBuy;
    d.autobeeBuy.checked = p.autobuy.structures.beeBuy;

    d.quickautohiveBuy.checked = p.autobuy.structures.hiveBuy;
    d.autohiveBuy.checked = p.autobuy.structures.hiveBuy;

    // rj structures

    if (p.RJTributes >= 30) {
      d.buyTribute.disabled = true;
      d.buyMaxTribute.disabled = true;
      d.buyMaxTributeAmount.innerHTML = "?";
      d.buyMaxTributeS.innerHTML = "s";
      d.buyMaxTributePrice.innerHTML = "?";
      d.tributePrice.innerHTML = "?";
    } else {
      d.buyTribute.disabled = false;
      d.buyMaxTribute.disabled = false;
      d.buyMaxTributeAmount.innerHTML = format(tmp.maxtributesToBuy, -3);
      d.buyMaxTributeS.innerHTML = tmp.maxtributesToBuy == 1 ? "" : "s";
      d.buyMaxTributePrice.innerHTML = format(tmp.maxtributesPrice);
      d.tributePrice.innerHTML = format(tmp.tributeCos);
    }

    d.RJflowerFields.innerHTML = "" + format(p.RJflowerFields, -3);
    d.RJbees.innerHTML = "" + format(p.RJbees, -3);
    d.RJhives.innerHTML = "" + format(p.RJhives, -3);

    // tributes
    d.RJTributes.innerHTML = "" + p.unusedRJTributes;
    //prettier-ignore
    if (tmp.tmpunusedRJTributes ==tmp.tmpRJpollenGodTributes +tmp.tmpRJnectarGodTributes +tmp.tmpRJhoneyGodTributes +tmp.tmpRJflowerGodTributes +tmp.tmpRJcapitalistGodTributes
      ) {
        d.exchangeToApplyChanges.style.display = "none";
      } else {
        d.exchangeToApplyChanges.style.display = "";
      }
    d.totalRJTributes.innerHTML = "" + p.RJTributes;

    // assigning rj tributes
    d.tmpunusedRJTributes.innerHTML = " -> " + tmp.tmpunusedRJTributes + "/30";
    if (tmp.tmpunusedRJTributes == 0) d.tmpunusedRJTributes.style.display = "none";
    else d.tmpunusedRJTributes.style.display = "";
    if (tmp.tmpRJpollenGodTributes == 0) d.tmpRJpollenGodTributes.innerHTML = "";
    else d.tmpRJpollenGodTributes.innerHTML = " -> " + (p.pollenGodRJTributes + tmp.tmpRJpollenGodTributes);
    if (tmp.tmpRJnectarGodTributes == 0) d.tmpRJnectarGodTributes.innerHTML = "";
    else d.tmpRJnectarGodTributes.innerHTML = " -> " + (p.nectarGodRJTributes + tmp.tmpRJnectarGodTributes);
    if (tmp.tmpRJhoneyGodTributes == 0) d.tmpRJhoneyGodTributes.innerHTML = "";
    else d.tmpRJhoneyGodTributes.innerHTML = " -> " + (p.honeyGodRJTributes + tmp.tmpRJhoneyGodTributes);
    if (tmp.tmpRJflowerGodTributes == 0) d.tmpRJflowerGodTributes.innerHTML = "";
    else d.tmpRJflowerGodTributes.innerHTML = " -> " + (p.flowerGodRJTributes + tmp.tmpRJflowerGodTributes);
    if (tmp.tmpRJcapitalistGodTributes == 0) d.tmpRJcapitalistGodTributes.innerHTML = "";
    else d.tmpRJcapitalistGodTributes.innerHTML = " -> " + (p.capitalistGodRJTributes + tmp.tmpRJcapitalistGodTributes);

    if (p.RJ < tmp.RJflowerFieldsCost) d.RJbuyflowerFields.disabled = true;
    else d.RJbuyflowerFields.disabled = false;
    if (p.RJ < tmp.RJbeesCost) d.RJbuybees.disabled = true;
    else d.RJbuybees.disabled = false;
    if (p.RJ < tmp.RJhivesCost) d.RJbuyhives.disabled = true;
    else d.RJbuyhives.disabled = false;

    d.RJfrombuyflowerFields.innerHTML = format(tmp.RJflowerFieldsCost);
    d.RJfrombuyhives.innerHTML = format(tmp.RJhivesCost);
    d.RJfrombuybees.innerHTML = format(tmp.RJbeesCost);
  };
  export const calc = () => {
    tmp.RJToGet = RJToGet();

    tmp.RJBonus = getRJBonus(p.RJ);
    tmp.totalRJBonus = getTotalRJBonus(p.totalRJ);

    p.highestRJ = Math.max(p.RJ, p.highestRJ);

    RJTributeCost.level = p.RJTributes;
    tmp.RJflowerFieldsCost = structurePrice(p.RJflowerFields);
    tmp.RJbeesCost = structurePrice(p.RJbees);
    tmp.RJhivesCost = structurePrice(p.RJhives);

    [tmp.maxtributesToBuy, tmp.maxtributesPrice] = RJTributeCost.maxFunction(p.RJ);
    tmp.tributeCos = RJTributeCost.costFunction();
  };
}

namespace n_stats {
  export let tmp = {
    RJFromtotalflowers: 0,
    RJFromtotalpollen: 0,
    RJFromtotalnectar: 0,
    RJFromtotalhoney: 0,
    RJFromtotalmoney: 0,
  };
  export const text = () => {
    tmp.RJFromtotalflowers = Math.log10(Math.max(1, p.totalflowers));
    tmp.RJFromtotalpollen = Math.log10(Math.max(1, p.totalpollen));
    tmp.RJFromtotalnectar = Math.log10(Math.max(1, p.totalnectar));
    tmp.RJFromtotalhoney = Math.log10(Math.max(1, p.totalhoney));
    tmp.RJFromtotalmoney = Math.log10(Math.max(1, p.totalmoney));

    d.RJfromflowers.innerHTML = format(tmp.RJFromtotalflowers, 1) + " RJ";
    d.RJfrompollen.innerHTML = format(tmp.RJFromtotalpollen, 1) + " RJ";
    d.RJfromnectar.innerHTML = format(tmp.RJFromtotalnectar, 1) + " RJ";
    d.RJfromhoney.innerHTML = format(tmp.RJFromtotalhoney, 1) + " RJ";
    d.RJfrommoney.innerHTML = format(tmp.RJFromtotalmoney, 1) + " RJ";

    if (p.lastRJfromflowers + p.lastRJfrompollen + p.lastRJfromnectar + p.lastRJfromhoney + p.lastRJfrommoney) {
      d.RJlastReset.style.display = "";
      d.lastRJfromflowers.innerHTML = "" + format(p.lastRJfromflowers, 1) + " RJ";
      d.lastRJfrompollen.innerHTML = "" + format(p.lastRJfrompollen, 1) + " RJ";
      d.lastRJfromnectar.innerHTML = "" + format(p.lastRJfromnectar, 1) + " RJ";
      d.lastRJfromhoney.innerHTML = "" + format(p.lastRJfromhoney, 1) + " RJ";
      d.lastRJfrommoney.innerHTML = "" + format(p.lastRJfrommoney, 1) + " RJ";
    } else {
      d.RJlastReset.style.display = "none";
      d.lastRJfromflowers.innerHTML = "";
      d.lastRJfrompollen.innerHTML = "";
      d.lastRJfromnectar.innerHTML = "";
      d.lastRJfromhoney.innerHTML = "";
      d.lastRJfrommoney.innerHTML = "";
    }

    d.flowerConsumptionStat.innerHTML = getPSWithS("flower", getForagerBeeConsumption());
    d.nectarConsumptionStat.innerHTML = getPS("nectar", getHoneyProduction(1) / (p.nge ? 2 : 1));
    d.honeyWorthStat.innerHTML = format(getHoneyWorth());
    d.flowerPSStat.innerHTML = getPSWithS("flower", getFlowerProduction(1));
    d.pollenPSStat.innerHTML = getPS("pollen", getPollenProduction(1));
    d.nectarPSStat.innerHTML = getPS("nectar", getNectarProduction(1));
    d.honeyPSStat.innerHTML = getPS("honey", getHoneyProduction(1));
    d.beehiveSpaceEffectStat.innerHTML = `${format(0.2 * 1.03 ** (p.capitalistGodTributes * n_tributes.tmp.me[5]))}`;
    d.beeSpaceEffectStat.innerHTML = `${format(1 * 1.03 ** (p.capitalistGodTributes * n_tributes.tmp.me[5]))}`;
    d.beehiveSpaceEffectStatS.innerHTML = `${format(0.2 * 1.03 ** (p.capitalistGodTributes * n_tributes.tmp.me[5])) == "1.00" ? "" : "s"}`;
    d.beeSpaceEffectStatS.innerHTML = `${format(1 * 1.03 ** (p.capitalistGodTributes * n_tributes.tmp.me[5])) == "1.00" ? "" : "s"}`;

    d.pernamentTributeEffects.innerHTML = `${p.pge ? "✓" : "✗"} pollen: 2x pollen production<br>
    ${p.nge ? "✓" : "✗"} nectar: 2x honey production<br>
    ${p.hge ? "✓" : "✗"} honey: bees amount isn't rounded down & more ways to assign bees<br>
    ${p.fge ? "✓" : "✗"} flowers: lets you sell honey (requires at least 0.1 honey)<br>
    ${p.cge ? "✓" : "✗"} capitalist: worker spaces aren't rounded down`;
  };
}

const getConnectedTo = (god: t_gods): t_gods[] => {
  return [god];
};
namespace n_gods {
  export let tmp = {
    pollenGodMaxTributes: 20,
    nectarGodMaxTributes: 20,
    honeyGodMaxTributes: 20,
    flowerGodMaxTributes: 20,
    capitalistGodMaxTributes: 20,
  };
  export const calc = () => {};
}

const GameLoop = () => {
  let now = Date.now();
  let diff = ((now - p.lastUpdate) / 1000) * gameSpeed;

  updateTmp();
  //prettier-ignore
  // eyJmbG93ZXJzIjo1NTcuNTMwMjcyMTU3NTAxNCwicG9sbGVuIjoxMy4xMzg1Nzg1MzIyMzcyLCJuZWN0YXIiOjIuNzM0MzU2OTI3ODQ0MTQwNiwiaG9uZXkiOjIuOTMyMTEyNDkxODQ1ODgxLCJtb25leSI6MC43MzI4NTg5NTczMzIwNTUyLCJoaWdoZXN0Zmxvd2VycyI6NTU4Ljk3MjQ1Nzk5MTEyNTEsImhpZ2hlc3Rwb2xsZW4iOjEzLjEzODU3ODUzMjIzNzIsImhpZ2hlc3RuZWN0YXIiOjIuNzM0MzU2OTI3ODQ0MTQwNiwiaGlnaGVzdGhvbmV5IjozLjYwOTAxMTMzNDU0NjYxNCwiaGlnaGVzdG1vbmV5IjowLjczMjg1ODk1NzMzMjA1NTIsInRvdGFsZmxvd2VycyI6OTY3OS41MTAwNDIzNTQ4MzcsInRvdGFscG9sbGVuIjoxNTU1Ljg3ODEwNjQ3MzgxOTYsInRvdGFsbmVjdGFyIjoxNTgyLjEwMDM1MDg3MDUyNywidG90YWxob25leSI6NjgzLjg0NTAzOTY3Nzc5MTgsInRvdGFsbW9uZXkiOjI0ODkuMDk3NDk4MDYwMTU4LCJiZWVzIjo0LCJmcmVlQmVlcyI6MCwiZm9yYWdlckJlZXMiOjUuMDc3MDQxMzc3MjI5MDE0LCJob25leUJlZXMiOjQuMjcsImZsb3dlckZpZWxkcyI6MSwiaGl2ZXMiOjEsInRvdGFsU2FjcmlmaWNlcyI6MCwicG9sbGVuR29kVHJpYnV0ZXMiOjQsIm5lY3RhckdvZFRyaWJ1dGVzIjoyLCJob25leUdvZFRyaWJ1dGVzIjo3LCJmbG93ZXJHb2RUcmlidXRlcyI6MSwiY2FwaXRhbGlzdEdvZFRyaWJ1dGVzIjo0LCJhdXRvQXNpZ25CZWVzVG8iOlsiZm9yYWdlciIsImhvbmV5Il0sInBnZSI6dHJ1ZSwibmdlIjp0cnVlLCJoZ2UiOnRydWUsImZnZSI6dHJ1ZSwiY2dlIjp0cnVlLCJzZWxsaW5nSG9uZXkiOmZhbHNlLCJhdXRvc2F2ZXMiOmZhbHNlLCJ1bmxvY2tzIjp7ImJlZXMiOnRydWUsImZvcmFnZXJCZWVzIjp0cnVlLCJoaXZlIjp0cnVlLCJob25leUJlZXMiOnRydWUsInNhY3JpZmljaW5nIjp0cnVlLCJ0cmlidXRlcyI6dHJ1ZSwiamVsbHkiOmZhbHNlLCJqZWxseTIiOmZhbHNlfSwibGFzdFVwZGF0ZSI6MTY2NjkwNjc0Mzk1MSwib2ZmbGluZVRpbWUiOjEwOC4zNjU5OTk5OTk5NDY4NywiUkoiOjAsImhpZ2hlc3RSSiI6MCwidG90YWxSSiI6MCwiUkpiZWVzIjowLCJSSmZsb3dlckZpZWxkcyI6MCwiUkpoaXZlcyI6MCwiUkpUcmlidXRlcyI6MCwidW51c2VkUkpUcmlidXRlcyI6MCwicG9sbGVuR29kUkpUcmlidXRlcyI6MCwibmVjdGFyR29kUkpUcmlidXRlcyI6MCwiaG9uZXlHb2RSSlRyaWJ1dGVzIjowLCJmbG93ZXJHb2RSSlRyaWJ1dGVzIjowLCJjYXBpdGFsaXN0R29kUkpUcmlidXRlcyI6MCwidGFiIjoic2V0dGluZ3MiLCJkYXJrbW9kZSI6dHJ1ZSwiYmlnQnV0dG9ucyI6ZmFsc2UsImRpc3BsYXlFdmVyeXRoaW5nIjpmYWxzZSwiZXhjaGFuZ2VDb25maXJtYXRpb24iOnRydWUsImljb25Nb3ZlIjpmYWxzZX0=
  // use it and add x or + to me
  // TODO: add pentagram like - connection for connected god
  // pentagram and u can chose which gods u want to connect
  // can be in form of buttons for now // idk about all this

  d.godsTabButton.style.display = "none"

  beeCost.level = p.bees;
  beeCost.offset = getBeePriceMult();

  hiveCost.level = p.hives;
  hiveCost.offset = getHivePriceMult();

  flowerFieldCost.level = p.flowerFields;
  flowerFieldCost.offset = getFlowerFieldPriceMult();

  diff = updateOfflineTicks(diff) ?? 0;

  n_jelly.calc();
  n_jelly.text();

  n_tributes.calc();
  n_tributes.text();

  n_sacrifices.calc();
  n_sacrifices.text();

  n_structures.calc();
  n_structures.display();
  n_structures.text();
  n_structures.autobuy();

  n_resources.calc(diff);
  n_resources.text();

  n_stats.text();

  updateUnlocks();
  updateDisplay();

  p.lastUpdate = now;
};
