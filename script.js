'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0

  // slice() makes a copy of an array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (account) {
  // Display movements
  displayMovements(account.movements);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

// Evenet handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  // here ? means that currentAccount will read only if it is exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // loose focus

    // UpdateUI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // without it if we click, it will reload the page
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // UpdateUI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Udate UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount?.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    // .indexOf

    // Delete account
    accounts.splice(index, 1);

    //  Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
// SLICE doesn't change original array
console.log(arr.slice(2)); // ['c', 'd', 'e']
console.log(arr.slice(2, 4)); // ['c', 'd']
console.log(arr.slice(-2)); // ['d', 'e']
console.log(arr.slice(-1)); // ['e'] // Always just a last element in the array
console.log(arr.slice(1, -2)); // ['b', 'c'] // extracts from the 1 and then averething except -2
console.log(arr.slice()); // create a shallow copy of the array
// the same as this:
console.log([...arr]); // it is a spread operator

// SPLICE
// SLPICE actually changes orriginal array
// console.log(arr.splice(2)); // ['c', 'd', 'e'] // and splice method removes those methods from original array
arr.splice(-1); // removes the last element from original array
console.log(arr);
arr.splice(1, 2); // we wont remove begin at position 1 and delete 2 elements
console.log(arr);

// REVERSE
// REVERSE actually mutate original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); // ['f', 'g', 'h', 'i', 'j']
console.log(arr2); // ['f', 'g', 'h', 'i', 'j']

// CONCAT
// CONCAT doesnt not mutate any of the envolved arrays
const letters = arr.concat(arr2);
console.log(letters);
// the same as:
console.log([...arr, ...arr2]); // it is a spread operator

// JOIN
console.log(letters.join(' - ')); // returns a string a - b - c - d - e - f - g - h - i - j


// AT method
const arr = [23, 11, 64];
console.log(arr[0]); //23
// the same as:
console.log(arr.at(0)); //23

// getting lst array element
console.log(arr[arr.length - 1]); // the last element in the array
console.log(arr.slice(-1)); // [64]
console.log(arr.slice(-1)[0]); // 64
console.log(arr.at(-1)); // 64

// at method also works at srings
console.log('jonas'.at(0)); // j
console.log('jonas'.at(-1)); // s


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
// the same as:
console.log('---- FOREACH ----');
// first parameter is a current element
// second parameter is the current index
// third parameter is entire array that we looping over
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
});
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

//
// MAP
//
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// first argument is currenat value
// second argument is key
// third argument is entyre map
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//
// SET
// in sets value and key are the same
const currenciesUnique = new Set([`USD`, 'GBR', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
//USD: USD
//GBR: GBR
//EUR: EUR

//
////
//////--- CHALLENGE ---
////
//
// console.log('--- CHALLENGE ---');
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   let dogsJuliaCopy = dogsJulia.slice();

//   dogsJuliaCopy.splice(0, 1);
//   dogsJuliaCopy.splice(-2);
//   // the same as this:
//   //  dogsJuliaCopy = dogsJuliaCopy.slice(1, 3);

//   const combinedArrs = dogsJuliaCopy.concat(dogsKate);
//   combinedArrs.forEach(function (dogsAge, index) {
//     if (dogsAge >= 3) {
//       console.log(
//         `Dog number ${index + 1} is an adult, and is ${dogsAge} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//     }
//   });
// };

// checkDogs(dogsJulia, dogsKate);

//
//// MAP METHOD
// it returns new array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;
const movementsUSD = movements.map(function (mov) {
  return mov * euroToUsd;
});
// the same with arrow function:
const movementsUSDarrow = movements.map(mov => mov * euroToUsd);

console.log(movements);
console.log(movementsUSD);
console.log(movementsUSDarrow);

// the same as:
const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * euroToUsd);
}
console.log(movementsUSDfor);

const movementDescriptions = movements.map(
  (movement, i) =>
    `Movement ${i + 1}: You ${
      movement > 0 ? 'deposited' : 'withdew'
    } ${Math.abs(movement)}`
);
console.log(movementDescriptions);

//
//// Filter method
// create a new array

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


//
//// REDUCE method
// it returns single value
// first parameter is accumulator
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

//  Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
console.log(max);


//
//// CHALLENGE
//

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  const average = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );
  return average;
};

console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
//44
//47.333


//
//// Chaining methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  // .map((mov, i, arr) => {
  //   console.log(arr);
  //   return mov * eurToUsd;
  // })
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);


//
//// CHALLENGE
//

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));


//
//// FIND METHOD
// it returns first element in the array, not an array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);


//
//// SOME and EVERY
//
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// EQUALITY
console.log(movements.includes(-130)); // true

// SOME: CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0); // true
console.log(anyDeposits);

// EVERY
console.log(movements.every(mov => mov > 0)); // false
console.log(account4.movements.every(mov => mov > 0)); // true

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


//
//// FLAT and FLAT MAP
// flat() == flat(1) - it is a default
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat()); // [Array(2), 3, 4, Array(2), 7, 8]
console.log(arrDeep.flat(1)); // [Array(2), 3, 4, Array(2), 7, 8]
console.log(arrDeep.flat(2)); // [1, 2, 3, 4, 5, 6, 7, 8]

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

// the same we can do like this:

// flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// the same with flatMap method:
// flatMap
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);


//
////Sorting array
// sort() - mutates original array

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); // ['Adam', 'Jonas', 'Martha', 'Zach']
console.log(owners);

// Numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// return < 0, => A,B (keep order)
// return > 0, => B,A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements); // [-650, -400, -130, 70, 200, 450, 1300, 3000]

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements); // [3000, 1300, 450, 200, 70, -130, -400, -650]


//
//// Creating and filling arrays
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(arr); // [1, 2, 3, 4, 5, 6, 7]
console.log(new Array(1, 2, 3, 4, 5, 6, 7)); // [1, 2, 3, 4, 5, 6, 7]

// Empty arrays + fill method
const x = new Array(7); // [empty × 7] it is a new array with 7 empty elements in there
console.log(x);
// x.fill(1)
// console.log(x); // [1, 1, 1, 1, 1, 1, 1]

// x.fill(1, 3);
// console.log(x); // [empty × 3, 1, 1, 1, 1]

// x.fill(1, 3, 5);
// console.log(x); // [empty × 3, 1, 1, empty × 2]

// arr.fill(23, 2, 6);
// console.log(arr); // [1, 2, 23, 23, 23, 23, 7]

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y); // [1, 1, 1, 1, 1, 1, 1]

// here we use '_' because we do not use this variable
const z = Array.from({ length: 7 }, (_, i) => i + 1);

console.log(z); // [1, 2, 3, 4, 5, 6, 7]

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    element => Number(element.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  // also we can create array like this:
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});


// 1/
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 3.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

let a = 10;
console.log(a++); // 10
console.log(a); // 11

let b = 10;
console.log(++b); // 11
console.log(b); // 11

// 4.
// this is a nice title -> This Is a Nice Title
const converTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(converTitleCase('this is a nice title'));
console.log(converTitleCase('this is a LONG title but not too long'));
console.log(converTitleCase('and here is another title with an EXAMPLE'));

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, mov) => {
      // mov > 0 ? (sums.deposits += mov) : (sums.withdrawals += mov);
      sums[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);
*/
/*
//
//// CHALLEGE
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// dogs.map(dog => {
//   dog.recommendedFoodPortion = Math.round(dog.weight ** 0.75 * 28);
// });

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2.
// const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

// console.log(
//   `Sarah's dog eats too ${
//     sarahsDog.curFood > sarahsDog.recommendedFoodPortion ? 'much' : 'low'
//   }`
// );

console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  } `
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
// const ownersEatTooMuch = dogs.filter(
//   dog => dog.curFood > dog.recommendedFoodPortion
// );
console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs.filter(
//   dog => dog.curFood < dog.recommendedFoodPortion
// );
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
// const ownersNamesEatTooMuch = ownersEatTooMuch
//   .flatMap(dog => dog.owners)
//   .join(' and ');
// console.log(ownersNamesEatTooMuch + `'s dogs eat too much!`);

// const ownersNamesEatTooLittle = ownersEatTooLittle
//   .flatMap(dog => dog.owners)
//   .join(' and ');
// console.log(ownersNamesEatTooLittle + `'s dogs eat too little!`);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5. and 6.

const checkEatingOkay = dog =>
  (dog.curFood > dog.recFood * 0.9) & (dog.curFood < dog.recFood * 1.1);

console.log(dogs.some(dog => dog.curFood === dog.recFood));
console.log(dogs.some(checkEatingOkay));
// const conditionExactlyEating = dog =>
//   dog.curFood >= dog.recommendedFoodPortion * 0.9 &&
//   dog.curFood <= dog.recommendedFoodPortion * 1.1;

// const exactlyEating = dogs.some(conditionExactlyEating);
// console.log(exactlyEating);

// const dogsHealthyEating = dogs.filter(conditionExactlyEating);
// console.log(dogsHealthyEating);

// 7.
console.log(dogs.filter(checkEatingOkay));

// 8.
const dogSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogSorted);
// const dogsCopy = dogs
//   .slice()
//   .flatMap(dog => dog.recommendedFoodPortion)
//   .sort((a, b) => a - b);
// console.log(dogsCopy);
*/