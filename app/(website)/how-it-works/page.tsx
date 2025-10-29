import LocationTrackProcess from "./how-it-works";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Location Track",
  description: "Learn how Location Track works",
};

export default function HowItWorks() {
  return <LocationTrackProcess />;
}