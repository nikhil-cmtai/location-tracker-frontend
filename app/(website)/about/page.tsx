import AboutPage from "./about";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - LocationTrack",
  description: "Learn more about LocationTrack, a leading provider of GPS tracking solutions for businesses of all sizes.",
};


export default function Page() {
  return <AboutPage />;
}