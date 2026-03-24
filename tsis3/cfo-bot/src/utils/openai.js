const SYSTEM_PROMPT = `You are CFO Bot, a friendly and professional cloud cost estimation assistant.
You help users understand their cloud costs and make smart infrastructure decisions.
Keep responses concise (2-3 sentences max). Be helpful and conversational.
If asked about specific pricing, remind users to use the calculator feature.
You can answer questions about cloud computing, pricing strategies, AWS, Azure, GCP, and Kazakhstani cloud providers (PS Cloud, QazCloud by Kaztelecom).
Always respond in the same language the user writes in (Russian, English, Kazakh, etc).`;

export async function chatWithAI(userMessage, conversationHistory = []) {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return "OpenAI API key not configured. Set VITE_OPENAI_API_KEY in .env file.";
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "Sorry, I couldn't process that. Try again!";
  }
}
