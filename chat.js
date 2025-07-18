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
        model: 'gpt-4', // or 'gpt-3.5-turbo' if you don't have GPT-4 access
        messages: [{ role: 'user', content: body.message }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get raw error message
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'OpenAI API error', details: errorText }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || 'No reply.',
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
