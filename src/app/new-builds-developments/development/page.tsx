import SubTypePageTemplate from "@/components/subtype/SubTypePageTemplate";
import { developmentConfig } from "@/lib/sub-type-pages";

export default function DevelopmentPage() {
  return <SubTypePageTemplate config={developmentConfig} />;
}
