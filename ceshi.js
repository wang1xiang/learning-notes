const words = ['abc',
  'dasd',
  'tad',
  'bca']
const length = words.length;
const basicWord = words[length - 1];
const basicWordSplit = basicWord.split('');
const result = [];

for (let item of words.slice(0, -1)) {
  let count = 0;
  for (let i = 0; i < item.length; i++) {
    if (!basicWordSplit.includes(item[i])) {
      break;
    } else {
      count++;
    }
  }
  console.log(count)
  if (count === item.length) result.push(item);
}
console.log(result)