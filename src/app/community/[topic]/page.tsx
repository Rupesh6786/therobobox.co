
import { Bot, Gamepad2, GraduationCap, Wrench } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const communityTopics = [
  {
    id: "games",
    title: "Robotics Games & Challenges",
    description: "Compete with fellow builders in our monthly challenges. Test your robot's speed, agility, and intelligence.",
    icon: Gamepad2,
    image: PlaceHolderImages.find(img => img.id === 'hero-3'),
  },
  {
    id: "scholarship",
    title: "RoboBox Scholarship Program",
    description: "We believe in fostering future talent. Learn more about our scholarship opportunities for aspiring engineers and programmers.",
    icon: GraduationCap,
    image: PlaceHolderImages.find(img => img.id === 'hero-2'),
  },
  {
    id: "make-your-bot",
    title: "Make Your Bot Showcase",
    description: "Share your creations with the community! Get feedback, find collaborators, and see what others are building with RoboBox kits.",
    icon: Wrench,
    image: PlaceHolderImages.find(img => img.id === 'product-1'),
  },
];


export default function CommunityTopicPage({ params }: { params: { topic: string } }) {
    const topic = communityTopics.find(t => t.id === params.topic);

    if (!topic) {
        notFound();
    }

    const Icon = topic.icon;

    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1">
                 <section className="relative py-24 md:py-32 lg:py-40">
                    {topic.image && (
                        <Image 
                            src={topic.image.imageUrl}
                            alt={topic.title}
                            fill
                            className="object-cover z-0 opacity-10"
                        />
                    )}
                    <div className="container mx-auto text-center relative z-10">
                        <Icon className="mx-auto h-16 w-16 text-primary" />
                        <h1 className="mt-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                          {topic.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
                          {topic.description}
                        </p>
                        <Button size="lg" className="mt-8">Join the Discussion</Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

// Generate static paths for all topics
export async function generateStaticParams() {
  return communityTopics.map((topic) => ({
    topic: topic.id,
  }));
}
