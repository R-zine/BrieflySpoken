"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import './ExamplesPage.css'

// Wouldn't work with Chrome unless I moved this function outside of the component
const speak = (text: string, setIsSpeaking: Function) => {
    if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;

        const speakText = function () {
            // Chrome has a 15-second audio cutoff either way...
            const utterance = new SpeechSynthesisUtterance(text.substring(0, 3600));

            utterance.lang = 'en-US';
            utterance.volume = 1; // 0 to 1
            utterance.rate = 1; // 0.1 to 10
            utterance.pitch = 1; // 0 to 2asd

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            synthesis.speak(utterance);
        };

        if (synthesis.getVoices().length !== 0) {
            window.speechSynthesis.cancel();
            speakText();
        } else {
            // Wait for voices to be loaded before speaking
            synthesis.onvoiceschanged = () => {
                window.speechSynthesis.cancel();
                speakText();
            };
        }
    } else {
        console.log('Speech synthesis is not supported in this browser.');
    }
}

export const ExamplesPage = ({ data }: any) => {
    const [isSpeaking, setIsSpeaking] = useState(false)

    const toggleGenericAudio = useCallback(() => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            speak(data.originalText, setIsSpeaking)
        }
    }, [data.originalText, isSpeaking])

    useEffect(() => {
        return () => window.speechSynthesis.cancel()
    }, [])

    return (
        <div className="examples-wrapper">
            {data.originalText && (
                <div>
                    <h2>Briefing Text</h2>
                    <article>
                        {data.originalText.split('\n').map((line: string, index: number) => (
                            <Fragment key={index}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                    </article>
                    <button onClick={() => toggleGenericAudio()}>{isSpeaking ? 'Stop' : 'Listen to'} Generic, Non-AI Audio</button>
                </div>
            )}
            <section>
                <h2>Audio Transcript</h2>
                <article>{data.content.split('\n').map((line: string, index: number) => (
                    <Fragment key={index}>
                        {line}
                        <br />
                    </Fragment>
                ))}</article>
                <audio src={`https://nnnvprbeyjkayamcbbxe.supabase.co/storage/v1/object/public/audio-storage/${data.audioId}`} controls />
            </section>
        </div>
    )
}
