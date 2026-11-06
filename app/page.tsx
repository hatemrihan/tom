import First from "./sections/First";
import Nav from "./sections/Nav";
import Explore from "./sections/Exolore";
import Footer from "./sections/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "TOM — Hatem Rihan, Software Engineer" },
  description:
    "Hatem Rihan (TOM) — software engineer building full-stack products, scalable systems and open-source React components.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
    <Nav />
    <First />
   <Explore />
   <Footer />
    </>
  );
}
