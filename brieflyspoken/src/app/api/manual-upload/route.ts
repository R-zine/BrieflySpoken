import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { headers } from "next/headers";


export async function POST(req: any) {
  
  
  const headersList = headers()

  const key = headersList.get("key")
  
  if (key !== process.env.API_KEY) return new Response("Unauthorized", {status: 401})

  const data = await req.formData()

  const rawFile = data.get("recording")
  const fileName = rawFile.name;
  const fileType = rawFile.type;

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
    Key: fileName,
    Body: fileBinary,
    ContentType: 'audio/mpeg',
  })

  const fileUploadAction = await client.send(uploadCommand)

  console.log(fileUploadAction)

  return new Response('Success!', {
    status: 200,
  })
  }