import Contact from "@/components/Contact";
import Credentials from "@/components/Credentials";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import Nav from "@/components/Nav";
import Stack from "@/components/Stack";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Stack />
        <Lab />
        <Experience />
        <Credentials />
        <Contact />
      </main>
    </>
  );
}
