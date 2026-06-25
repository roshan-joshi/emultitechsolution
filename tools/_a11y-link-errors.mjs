import { readFile, writeFile } from 'node:fs/promises';

// Per-page: input id → error span id it should be aria-describedby of
const PAGES = {
  'request_quote.html': {
    'rq-firstname': 'err-firstName',
    'rq-lastname':  'err-lastName',
    'rq-email':     'err-email',
    'rq-mobileno':  'err-mobileNo',
    'rq-country':   'err-country',
    'rq-projecttype-1': 'err-projectType',
    'rq-projecttype-2': 'err-projectType',
    'rq-projecttype-3': 'err-projectType',
    'rq-projecttype-4': 'err-projectType',
    'rq-projecttype-5': 'err-projectType',
    'rq-projecttype-6': 'err-projectType',
    'rq-budgetrange-1': 'err-budget',
    'rq-budgetrange-2': 'err-budget',
    'rq-budgetrange-3': 'err-budget',
    'rq-budgetrange-4': 'err-budget',
    'rq-budgetrange-5': 'err-budget',
    'rq-budgetrange-6': 'err-budget',
  },
};

let totalAdded = 0;
for (const [file, links] of Object.entries(PAGES)) {
  let html = await readFile(file, 'utf8');
  let added = 0;
  for (const [inputId, errId] of Object.entries(links)) {
    const re = new RegExp(
      `(<(?:input|select|textarea)\\b[^>]*\\bid=["']${inputId}["'][^>]*?)(\\s*/?>)`,
      'g',
    );
    html = html.replace(re, (m, head, tail) => {
      if (/aria-describedby/.test(head)) return m;
      added++;
      return `${head} aria-describedby="${errId}"${tail}`;
    });
  }
  await writeFile(file, html, 'utf8');
  console.log(`${file}: ${added} aria-describedby added`);
  totalAdded += added;
}
console.log(`Total: ${totalAdded}`);
