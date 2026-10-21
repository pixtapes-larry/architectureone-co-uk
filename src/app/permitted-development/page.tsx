import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { permittedDevelopmentConfig } from "@/lib/category-pages";

export default function PermittedDevelopmentPage() {
  return <CategoryPageTemplate config={permittedDevelopmentConfig} />;
}
