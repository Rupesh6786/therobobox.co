import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const cultureImage = PlaceHolderImages.find((img) => img.id === "info-1");
const offeringsImage = PlaceHolderImages.find((img) => img.id === "info-2");

export default function InfoSections() {
  return (
    <section id="about" className="bg-secondary/50">
      <div className="container mx-auto space-y-24">
        {/* Culture Section */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Inspired by Curiosity
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              We believe in the power of hands-on learning and the endless
              potential of young minds. Our culture is built on collaboration,
              innovation, and a shared passion for making technology accessible
              to everyone.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Fostering creativity through project-based learning.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Committed to open-source and community contributions.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Dedicated to building a diverse and inclusive tech future.
                </span>
              </li>
            </ul>
            <Button asChild className="mt-8" size="lg">
              <Link href="#">Our Mission</Link>
            </Button>
          </div>
          {cultureImage && (
            <div className="order-1 md:order-2">
              <Image
                src={cultureImage.imageUrl}
                alt={cultureImage.description}
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint={cultureImage.imageHint}
              />
            </div>
          )}
        </div>

        {/* Offerings Section */}
        <div className="grid items-center gap-12 md:grid-cols-2">
           {offeringsImage && (
            <div>
              <Image
                src={offeringsImage.imageUrl}
                alt={offeringsImage.description}
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint={offeringsImage.imageHint}
              />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              More Than Just a Box
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Our ecosystem provides everything schools and individuals need to succeed. From comprehensive curriculum to a thriving online community, we provide the support system for every step of the robotics journey.
            </p>
             <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Structured lesson plans aligned with STEM standards.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Ongoing teacher training and support.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  Access to global competitions and challenges.
                </span>
              </li>
            </ul>
            <Button asChild className="mt-8" size="lg">
              <Link href="#register">Register Your School</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
