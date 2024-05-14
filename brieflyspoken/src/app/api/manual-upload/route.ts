import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { headers } from "next/headers";
import { prisma } from '@/db';


export async function POST(req: any) {
  
  const headersList = headers()

  const key = headersList.get("key")
  
  if (key !== process.env.API_KEY) return new Response("Unauthorized", {status: 401})

  const data = await req.formData()

  const content = data.get("script")
  const isTwo = Boolean(data.get("isTwo"))
  const isCustomVoice = Boolean(data.get("isCustomVoice"))

  const briefing = await prisma.briefing.create({
    data: {
      content,
      isTwo,
      isCustomVoice
    }
  })

  const audioEntry = await prisma.audio.create({
    data: {
      briefingId: briefing.id,
      isUserAdded: true,
      url: ""
    }
  })

  const rawFile = data.get("recording")
  const fileName = rawFile.name;

  const fileReader = rawFile.stream().getReader();

  const fileDataU8 = []

  while (true){

    const {done,value} = await fileReader.read();
    if (done) break;

    fileDataU8.push(...value);

  }

  // @ts-ignore
  const fileBinary = Buffer.from(fileDataU8,'binary');

  
  const client = new S3Client({
    forcePathStyle: true,
    region: 'us-west-1',
    endpoint: 'https://nnnvprbeyjkayamcbbxe.supabase.co/storage/v1/s3',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_KEY || "",
    }
  })

  const uploadCommand = new PutObjectCommand({
    Bucket: 'audio-storage',
    Key: String(audioEntry.id),
    Body: fileBinary,
    ContentType: 'audio/mpeg',
  })

 await client.send(uploadCommand)



  return new Response('Success!', {
    status: 200,
  })
  }