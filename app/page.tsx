import First from "./sections/First";
import Nav from "./sections/Nav";
import Explore from "./sections/Exolore";
import Footer from "./sections/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TOM - Software Engineer Portfolio",
  description: "TOM is a Software Engineer specializing in full-stack development, robust system architectures, and scalable applications.",
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
