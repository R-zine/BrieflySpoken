import Image from "next/image";
import styles from "./page.module.css";
import HomePage from "./components/HomePage";
import { prisma } from '@/db';

export default async function Home() {

  const entries = await prisma.briefing.findMany()

  return (
    <main className={styles.main}>
      <HomePage entries={entries} />
    </main>
  );
}
