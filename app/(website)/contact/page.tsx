import ContactPage from "./contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Location Track",
  description: "Contact Location Track",
};

export default function Contact() {
  return <ContactPage />;
}
