"use client";

import { useState } from "react";
import { automatedFAQ, type AutomatedFAQOutput } from "@/ai/flows/automated-faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";

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
]

export default function FaqSection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AutomatedFAQOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const result = await automatedFAQ({ question });
      setAnswer(result);
    } catch (e) {
      setError("Sorry, I couldn't find an answer. Please try rephrasing your question.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="faq" className="bg-background">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Have questions? We've got answers. Ask our AI assistant or check out the common queries below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex w-full items-center space-x-2 mb-8">
            <Input
              type="text"
              placeholder="Ask about products, school programs, or anything else..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              disabled={isLoading}
            />
            <Button onClick={handleAskQuestion} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Ask"
              )}
            </Button>
          </div>

          {(answer || isLoading || error) && (
            <Card className="mb-8 bg-secondary/50">
              <CardContent className="p-6">
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {answer && (
                    <div>
                        <p className="font-bold font-headline text-primary flex items-center gap-2">
                           <Sparkles className="h-5 w-5"/> Answer
                        </p>
                        <p className="mt-2 text-foreground/90">{answer.answer}</p>
                    </div>
                )}
              </CardContent>
            </Card>
          )}

          <Accordion type="single" collapsible className="w-full">
            {commonQuestions.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
