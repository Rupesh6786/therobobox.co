
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Wrench, GraduationCap, HelpCircle } from "lucide-react";

export type SearchableItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'kit' | 'workshop' | 'faq';
  icon: React.ComponentType<any>;
};

const products = [
  {
    id: "robobox",
    image: PlaceHolderImages.find((img) => img.id === "product-1"),
    title: "Starter Bot Kit",
    description: "The perfect introduction to robotics. Build your first autonomous robot with our easy-to-follow guide.",
  },
  {
    id: "mechatronics",
    image: PlaceHolderImages.find((img) => img.id === "product-2"),
    title: "Advanced Sensor Pack",
    description: "Expand your robot's capabilities with a range of advanced sensors for navigation and interaction.",
  },
  {
    id: "blix",
    image: PlaceHolderImages.find((img) => img.id === "product-3"),
    title: "AI Vision Module",
    description: "Give your creation the power of sight. Integrates seamlessly with our core platform for object recognition.",
  },
   {
    id: "drone",
    image: PlaceHolderImages.find((img) => img.id === "hero-1"), // Using a placeholder
    title: "DIY Drone Kit",
    description: "Build and fly your own drone with this comprehensive kit, including a high-res camera.",
  },
];

const workshops = [
  {
    id: "robotics-insight",
    title: "Insight to Robotics",
    description: "A beginner-friendly workshop covering the fundamentals of robotics, from basic electronics to simple programming.",
  },
  {
    id: "all-in-one",
    title: "All in one Masterclass",
    description: "A comprehensive masterclass for enthusiasts looking to dive deep into mechatronics, AI, and autonomous systems.",
  },
  {
    id: "scratch-to-pro",
    title: "Master class (Scratch to Pro)",
    description: "Take your skills from zero to hero. This intensive course covers everything from Scratch block-based coding to advanced Python for robotics.",
  },
];

const commonQuestions = [
    {
        question: "What products does RoboBox Reimagined offer?",
        answer: "RoboBox Reimagined offers a variety of robotics kits and educational resources, including the Starter Bot Kit, Advanced Sensor Pack, and an AI Vision Module. Our ecosystem also provides curriculum support and teacher training."
    },
    {
        question: "How can schools register for RoboBox Reimagined?",
        answer: "Schools can register by filling out the school registration form on our website. Just navigate to the 'For Schools' section and submit your inquiry to partner with us."
    },
    {
        question: "Is there a discount available?",
        answer: "Yes! We have an interactive discount generator on our homepage. Scratch the card to reveal a unique discount code for your purchase."
    }
];

export const searchableData: SearchableItem[] = [
    ...products.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        href: `/kits/${p.id}`,
        type: 'kit' as const,
        icon: Wrench
    })),
    ...workshops.map(w => ({
        id: w.id,
        title: w.title,
        description: w.description,
        href: `/workshops/${w.id}`,
        type: 'workshop' as const,
        icon: GraduationCap
    })),
    ...commonQuestions.map((q, i) => ({
        id: `faq-${i}`,
        title: q.question,
        description: q.answer,
        href: '/#faq',
        type: 'faq' as const,
        icon: HelpCircle
    }))
];
