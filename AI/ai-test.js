
import 'dotenv/config';
import OpenAI from "openai";
import readline from "readline";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let messages = [
  { role: "system", content: "Sen bilgili, kibar ve yardımcı bir asistansın." },
];

async function chat() {
  rl.question("Sen: ", async (input) => {
    messages.push({ role: "user", content: input });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    const reply = completion.choices[0].message.content;
    console.log("AI:", reply);
    messages.push({ role: "assistant", content: reply });
    chat();
  });
}

console.log("AI Chat'e hoş geldiniz! Çıkmak için Ctrl+C kullanın.");
chat();
