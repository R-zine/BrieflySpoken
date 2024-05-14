"use client";

export const ExamplesPage = ({ data }: any) => {

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {data.originalText && <div dangerouslySetInnerHTML={{ __html: data.originalText }} />}
                <div>{data.content}</div>
            </div>
            <audio src={`https://nnnvprbeyjkayamcbbxe.supabase.co/storage/v1/object/public/audio-storage/${data.audioId}`} controls />
        </div>
    )
}
