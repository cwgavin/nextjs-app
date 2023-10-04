import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gavin's Lab</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image
          src="/Ice_bear.webp"
          alt="Ice Bear"
          width={260}
          height={170}
          priority
        />
        <h1 className={styles.title}>Gavin's Lab</h1>

        {/* <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        <div className={styles.grid}>
          {/* <Link href="/fruits" className={styles.card}>
            <h2>Fruits &rarr;</h2>
            <p>A filterable list of fruits fetched from a third-party API</p>
          </Link> */}

          <Link href="/image-classification" className={styles.card}>
            <h2>Image Classification &rarr;</h2>
            <p>Use AI to classify local and online images</p>
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        GitHub Repo:&nbsp;
        <Link target="_blank" href="https://github.com/cwgavin/nextjs-app">
          Front End (React)
        </Link>
        <Link target="_blank" href="https://github.com/cwgavin/flask-api">
          Back End (Python)
        </Link>
      </footer>
    </div>
  );
}
