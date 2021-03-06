const {
  AsyncArray,
  add,
  subtract,
  multiply,
  divide,
  mod,
  less,
  equal,
  lessOrEqual,
  sqrt
} = Homework;

const promisify = fn => (...args) =>
  new Promise(resolve => {
    args.push(result => resolve(result));
    fn(...args);
  });

const promisifyAsyncArrayObj = asyncArrayObj => {
  return Object.getOwnPropertyNames(asyncArrayObj).reduce((acc, methodName) => {
    acc[methodName] = promisify(asyncArrayObj[methodName]);
    return acc;
  }, {});
};

const modPromisify = promisify(mod);
const addPromisify = promisify(add);
const lessPromisify = promisify(less);
const equalPromisify = promisify(equal);

/**
 *
 * @param {*} arr AsyncArray
 * @param {*} cb Callback
 */
async function sumEvenIndexElements(arr, cb) {
  try {
    const arrPromisify = promisifyAsyncArrayObj(arr);
    const len = await arrPromisify.length();
    const evenValuesMap = new Map();

    let i = 0;

    while (await lessPromisify(i, len)) {
      const isEven = await equalPromisify(await modPromisify(i, 2), 0);

      if (isEven) {
        const value = arrPromisify.get(i);
        evenValuesMap.set(i, value);
      }

      i = await addPromisify(i, 1);
    }

    const evenValues = await Promise.all(evenValuesMap.values());

    const res = await evenValues.reduce(async (acc, val) => {
      return await addPromisify(await acc, val);
    }, Promise.resolve(0));

    cb(res);
  } catch (err) {
    console.error(err);
  }
}

// Use
console.log("----- Task 07 -----");
const arr = new AsyncArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
arr.print(arr);
sumEvenIndexElements(arr, console.log);
