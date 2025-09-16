export function int(n: number, del = ' ') {
  let output = '';

  do {
    var now = (n % 1000 | 0).toString();
    n = n / 1000 | 0;
    if (n) now = now.padStart(3, '0');
    output = now + output;
    if (n) output = del + output;
  } while (n);

  return output;
}