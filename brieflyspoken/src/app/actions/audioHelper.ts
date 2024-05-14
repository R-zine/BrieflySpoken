"use server";

import fs from 'fs';
import path from 'path';
import stream from 'stream';
import ffmpegInstallerPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import audioConcat from 'audioconcat';
import OpenAi from 'openai';

import { prisma } from "@/db";

ffmpeg.setFfmpegPath(ffmpegInstallerPath.path);

const getMergedAudioDestination = (id: number) => path.resolve(__dirname, `../audio/briefing-${id}.mp3`);
const getAudioChunks = (): string[] => fs.readdirSync(path.resolve(__dirname, '../audio/chunks')).map(file => path.resolve(__dirname, `../audio/chunks/${file}`));

export const saveMergedAudioToFile = async (id: number): Promise<void> => {
    const audioChunks = getAudioChunks();
    const mergedAudioDestination = getMergedAudioDestination(id);

    await audioConcat(audioChunks)
        .concat(mergedAudioDestination)
        .on('error', (err: Error, stdout: WritableStream, stderr: WritableStream) => {
            console.error('Error:', err);
            console.error('ffmpeg stderr:', stderr);
        })
        .on('end', async () => {
            console.log('Merged audio created successfully!');

            await prisma.audio.create({
                data: {
                    briefingId: id,
                    isUserAdded: true,
                    url: mergedAudioDestination
                }
            });

            // Delete chunks
            audioChunks.forEach(file => fs.unlink(file, (err) => {
                if (err) throw err;
                console.log(file + ' was deleted');
            }));

        });
}


/**
 * 
 * @param voice 
 * @param text 
 * @param path 
 * 
 * Saves an audio chunk to the specified path. Example usage:
 * [intro, ...sections, outro].map(async (text, i, arr) => {
    const selectedVoice = i == 0 || i === arr.length - 1 ?
        "alloy" :
        SECTION_VOICES[i % SECTION_VOICES.length];

    const audioFilePath = path.resolve(__dirname, `<path-to-audio-folder>/chunks/${i}.mp3`);
    
    await generateAudioChunk(selectedVoice, text, audioFilePath);
 */

export const generateAudioChunk = async (
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
    text: string,
    path: string
) => {
    const openai = new OpenAi({
        apiKey: process.env.OPENAI_API_KEY
    });

    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice,
        input: text,
        speed: 1.25
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(path, buffer);
}

// Just in case...
export const getMergedAudioBuffer = (): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const audioChunks = getAudioChunks();
        const pass = new stream.PassThrough();

        let chunks: any[] = [];

        pass.on('data', chunk => chunks.push(chunk));
        pass.on('end', () => {
            // Delete chunks
            audioChunks.forEach(file => fs.unlink(file, (err) => {
                if (err) throw err;
                console.log(file + ' was deleted');
            }));

            resolve(Buffer.concat(chunks))
        });
        pass.on('error', reject);

        audioConcat(audioChunks)
            .stream()
            .on('error', (err: Error, stdout: WritableStream, stderr: WritableStream) => {
                console.error('Error:', err);
                console.error('ffmpeg stderr:', stderr);
                reject(err);
            })
            .pipe(pass);
    });
}