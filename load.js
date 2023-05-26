(async function () {
  for (let i = 0; i < 10000; i++) {
    await fetch('http://localhost:3000/1?test=1&test=2', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
  }
})();
