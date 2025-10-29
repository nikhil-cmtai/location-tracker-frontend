import TermsPage from "./terms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Location Track",
  description: "Please read our terms and conditions carefully before using our services. Your use of our site means you agree to these terms.",
};  

export default function Terms() {
  return <TermsPage />;
}