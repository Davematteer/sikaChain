import Groq from 'groq-sdk';

export async function getLLMReply(phone: string, message: string, txs: string, country:string): Promise<string> {
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });

  try {
    const response = await client.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful financial assistant that gives clear, concise, and friendly spending tips based on the user’s recent transactions.Also keep the response short since it is sent via SMS.'
        },
        {
          role: 'user',
          content: `Phone Number: ${phone}\nUser Country: ${country}\nUser Message: "${message}"\nTransaction History:\n${txs}`
        }
      ]
    });

    const reply = response.choices?.[0]?.message?.content?.trim();

    if (reply) {
      return reply;
    }

    return "I'm not sure how to respond right now. Try asking again!";
  } catch (err) {
    console.error("🛑 LLM Error:", err);
    if (message.toLowerCase().includes("tips")) {
      return "Here are some tips to help you spend wisely: set budgets, track your expenses, and avoid impulse purchases!";
    }
    return "Something went wrong. Try again later or ask for 'tips'.";
  }
}
