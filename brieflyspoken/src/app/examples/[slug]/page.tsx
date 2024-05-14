import { ExamplesPage } from "../../../app/components/ExamplesPage"
import { prisma } from '../../../db';

export default async function Page({ params }: { params: { slug: string } }) {

    const id = params.slug

    const dbData = await prisma.briefing.findUnique({
        where: {
            id: Number(id)
        }
    })

    const audioId = await prisma.audio.findUnique({
        where: {
            briefingId: dbData?.id
        }
    })

    return <div>
        <ExamplesPage data={{ ...dbData, audioId: audioId?.id }} />
    </div>
}