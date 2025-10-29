import PrivacyPolicyPage from "./privacy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Location Track",
  description: "Read our privacy policy to understand how we handle your data and keep your information secure.",
};  

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}