
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Lightbulb, Users, Heart } from "lucide-react";
import AnimateOnScroll from "@/components/animate-on-scroll";

const teamMembers = [
  {
    name: "Dr. Eva Rostova",
    role: "Founder & CEO",
    bio: "A lifelong educator and robotics pioneer, Dr. Rostova founded RoboBox to make STEM accessible to all.",
    avatar: "https://i.pravatar.cc/150?img=1",
    initials: "ER"
  },
  {
    name: "Kenji Tanaka",
    role: "Chief Technology Officer",
    bio: "Kenji leads our engineering team, turning bold ideas into tangible, impactful technology.",
    avatar: "https://i.pravatar.cc/150?img=2",
    initials: "KT"
  },
  {
    name: "Maria Garcia",
    role: "Head of Curriculum",
    bio: "With a passion for pedagogy, Maria designs the engaging learning experiences that define our kits.",
    avatar: "https://i.pravatar.cc/150?img=3",
    initials: "MG"
  },
    {
    name: "Alex Doe",
    role: "Community Manager",
    bio: "Alex fosters our vibrant community, connecting builders, educators, and enthusiasts worldwide.",
    avatar: "https://i.pravatar.cc/150?img=4",
    initials: "AD"
  },
];

const values = [
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "We are driven by curiosity and a relentless pursuit of what's next, pushing the boundaries of educational technology."
    },
    {
        icon: Users,
        title: "Accessibility",
        description: "We believe that everyone, regardless of background or location, deserves access to high-quality STEM education."
    },
    {
        icon: Heart,
        title: "Community",
        description: "We are committed to building a supportive, collaborative ecosystem where builders and educators can thrive together."
    }
]

export default function AboutPage() {
  const missionImage = PlaceHolderImages.find((img) => img.id === "info-2");
  const teamImage = PlaceHolderImages.find((img) => img.id === "info-1");

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 bg-secondary/30 text-center">
            <div className="absolute inset-0 z-0 opacity-10">
                {teamImage && (
                    <Image
                    src={teamImage.imageUrl}
                    alt={teamImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={teamImage.imageHint}
                    />
                )}
            </div>
            <div className="container mx-auto relative z-10">
                <Bot className="mx-auto h-16 w-16 text-primary animate-pulse" />
                <h1 className="mt-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    About RoboBox
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
                    We're on a mission to democratize robotics education and inspire the next generation of innovators, creators, and problem-solvers.
                </p>
            </div>
        </section>

        {/* Mission Section */}
        <AnimateOnScroll>
        <section className="py-12 md:py-24">
          <div className="container mx-auto">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                  Our Mission: To Inspire & Empower
                </h2>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  RoboBox was born from a simple yet powerful idea: learning should be as exciting as discovery itself. We believe that the future is built by those who can dream, design, and create. Our goal is to put the tools of creation into the hands of every aspiring engineer, artist, and scientist.
                </p>
                <p className="mt-4 text-muted-foreground md:text-xl">
                    We are dedicated to creating a world where complex technologies like robotics and AI are not intimidating, but are instead intuitive and fun playgrounds for curiosity.
                </p>
              </div>
              {missionImage && (
                <div className="relative h-80 md:h-full w-full rounded-lg shadow-xl overflow-hidden">
                  <Image
                    src={missionImage.imageUrl}
                    alt={missionImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={missionImage.imageHint}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
        </AnimateOnScroll>

        {/* Values Section */}
        <AnimateOnScroll>
        <section className="py-12 md:py-24 bg-secondary/30">
            <div className="container mx-auto">
                 <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                        Our Core Values
                    </h2>
                    <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                        The principles that guide everything we do.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {values.map((value) => {
                       const Icon = value.icon;
                       return (
                        <Card key={value.title} className="text-center p-6">
                            <Icon className="h-12 w-12 text-primary mx-auto mb-4"/>
                            <h3 className="text-xl font-bold font-headline mb-2">{value.title}</h3>
                            <p className="text-muted-foreground">{value.description}</p>
                        </Card>
                       )
                   })}
                </div>
            </div>
        </section>
        </AnimateOnScroll>


        {/* Team Section */}
        <AnimateOnScroll>
        <section className="py-12 md:py-24">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                Meet the Team
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                The passionate minds behind the mission.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <Card key={member.name} className="overflow-hidden text-center">
                  <CardContent className="p-6">
                    <Avatar className="mx-auto h-24 w-24 mb-4 border-4 border-primary">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold font-headline">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
