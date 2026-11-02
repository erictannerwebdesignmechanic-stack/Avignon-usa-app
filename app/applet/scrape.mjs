import https from 'node:https';

async function fetchUrl(url) {
  const res = await fetch(url);
  return await res.text();
}

async function run() {
  const shopHtml = await fetchUrl('https://avignonusa.com/shop/');
  const re = /https:\/\/avignonusa\.com\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[^"'\s\)]+\.(?:webp|jpg|png|jpeg)/gi;
  const matches = [...new Set(shopHtml.match(re) || [])];
  console.log('SHOP IMAGES COUNT:', matches.length);
  console.log(JSON.stringify(matches, null, 2));

  const homeHtml = await fetchUrl('https://avignonusa.com/');
  const homeMatches = [...new Set(homeHtml.match(re) || [])];
  console.log('HOME IMAGES COUNT:', homeMatches.length);
  console.log(JSON.stringify(homeMatches, null, 2));
}

run();
