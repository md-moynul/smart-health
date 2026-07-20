async function testChat() {
  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }]
      })
    });
    console.log('Chat status:', res.status);
    const body = await res.text();
    console.log('Chat body snippet:', body.slice(0, 500));
  } catch (err) {
    console.error('Chat error:', err);
  }
}

testChat();
