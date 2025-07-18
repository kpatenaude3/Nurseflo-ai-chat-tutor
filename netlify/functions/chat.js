const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // safer default
        messages: [
          { role: 'user', content: body.message },
        ],
      }),
    });

    const data = await response.json();

    console.log('OpenAI response:', JSON.stringify(data)); // 👈 add this line

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || 'No reply.',
      }),
    };
  } catch (error) {
    console.error('Function error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: `Server error: ${error.message}`,
      }),
    };
  }
};
