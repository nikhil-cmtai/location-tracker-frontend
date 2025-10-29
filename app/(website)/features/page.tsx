import Features from "./features";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Location Track",
  description: "Explore the features of LocationTrack",
};

export default function FeaturesPage() {
  return <Features />;
}
  