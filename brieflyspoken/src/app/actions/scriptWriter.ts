import OpenAi from 'openai';
import { prisma } from "@/db";

const SYSTEM_PROMPT = 'Create a podcast-style script from briefings, structured as a JSON object with "intro", "outro", and "sections" properties, where a talk-show host introduces and concludes, and news-reporter personas deliver the content in designated sections. Number of sections should range between 2 and 6 (depending on how the briefing can be divided into topics), delivered as array of strings. The script should be engaging and informative, with a conversational tone. It\'s important to stick to details provided in the briefing and the reading time of the inital briefing should be roughly the same as reading time of the script.';

// TODO add different system prompts for different types of scripts

export const writeScript = async (briefingText: string, id: number): Promise<IPodcastScript> => {
    "use server";

    const openai = new OpenAi({
        apiKey: process.env.OPENAI_API_KEY
    });
    const completion = await openai.chat.completions.create({
        // Cheaper the gpt-4, won't stay like that in the future
        model: 'gpt-4-turbo-2024-04-09',
        response_format: {
            type: "json_object"
        },
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: briefingText
            }
        ]
    });

    await prisma.briefing.update({
        where: {
            id
        },
        data: {
            content: completion.choices[0].message.content
        }
    })

    console.log(completion.choices[0]);

    return JSON.parse(completion.choices[0].message.content as string);
};