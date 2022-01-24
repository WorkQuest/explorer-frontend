export default function (req, res, next) {
  const redirects = [
    { from: '/', to: '/home' },
    { from: 'home/blocks', to: '/blocks' },
    { from: 'home/transactions', to: '/transactions' },
  ];
  const redirect = redirects.find((r) => r.from === req.url);
  if (redirect) {
    res.writeHead(301, { Location: redirect.to });
    res.end();
  } else {
    next();
  }
}
