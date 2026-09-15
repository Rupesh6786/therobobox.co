
import { Bot, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";

const jobOpenings = [
  {
    title: "Robotics Software Engineer",
    location: "San Francisco, CA (Hybrid)",
    description: "Develop the brains behind our bots. Strong experience in Python, C++, and ROS is required."
  },
  {
    title: "Curriculum Developer",
    location: "Remote",
    description: "Design engaging and effective educational content for our robotics kits for K-12 students."
  },
  {
    title: "Hardware Engineer",
    location: "San Francisco, CA",
    description: "Design, prototype, and test new robotics hardware and sensor modules."
  },
  {
    title: "Marketing Manager",
    location: "New York, NY",
    description: "Lead our marketing campaigns and help bring RoboBox to schools and homes worldwide."
  }
];

export default function CareerPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto text-center">
            <Bot className="mx-auto h-16 w-16 text-primary animate-bounce" />
            <h1 className="mt-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
              Join Our Mission
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
              We're a passionate team dedicated to making robotics education accessible to everyone. If you're excited by technology and education, come build the future with us.
            </p>
          </div>
        </section>

        <section className="py-12 bg-secondary/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">Current Openings</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {jobOpenings.map((job, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Briefcase /> {job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2"><MapPin size={16}/> {job.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{job.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="#">Apply Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
