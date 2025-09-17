"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare } from "lucide-react";

const faqItems = [
    {
        question: "How does the AI Fasal Salahkaar (Crop Advisor) work?",
        answer: "The AI Crop Advisor uses your location, soil type, farm size, and budget to analyze climate data and market trends. It then recommends the most profitable and suitable crops for your specific conditions."
    },
    {
        question: "Is the Disease & Pest Identification accurate?",
        answer: "Our AI model is trained on thousands of images of plant diseases and pests to provide a highly accurate diagnosis. For best results, please upload a clear, well-lit image of the affected area of the plant."
    },
    {
        question: "How is the Smart Irrigation Schedule generated?",
        answer: "The schedule is created by combining your crop type's water requirements with real-time weather forecast data for your location. This ensures your crops get the right amount of water, saving you resources and improving yield."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take data privacy very seriously. All your farm data is encrypted and securely stored. We do not share your personal information with third parties without your consent."
    }
]

export default function SupportPage() {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support & Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to your questions or get in touch with us.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><HelpCircle /> Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare /> Contact Us</CardTitle>
                <CardDescription>If you can't find an answer, send us a message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your Name" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Your Email" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Describe your issue or question..." className="min-h-[120px]"/>
                </div>
                <Button className="w-full">Send Message</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
