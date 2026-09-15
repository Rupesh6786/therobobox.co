import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    image: PlaceHolderImages.find((img) => img.id === "product-1"),
    title: "Starter Bot Kit",
    description: "The perfect introduction to robotics. Build your first autonomous robot with our easy-to-follow guide.",
  },
  {
    image: PlaceHolderImages.find((img) => img.id === "product-2"),
    title: "Advanced Sensor Pack",
    description: "Expand your robot's capabilities with a range of advanced sensors for navigation and interaction.",
  },
  {
    image: PlaceHolderImages.find((img) => img.id === "product-3"),
    title: "AI Vision Module",
    description: "Give your creation the power of sight. Integrates seamlessly with our core platform for object recognition.",
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="bg-background">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Our Core Products
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Kits and modules designed to be powerful, accessible, and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              {product.image && (
                <div className="relative h-56 w-full">
                  <Image
                    src={product.image.imageUrl}
                    alt={product.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={product.image.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline">{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="#">
                    Learn More <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
