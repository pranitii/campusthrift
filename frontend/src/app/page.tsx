'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"
import { SiteHeader } from "@/src/components/site-header"
import { SiteFooter } from "@/src/components/site-footer"
import { Package, Moon, Shield, Zap, Users, BookOpen, Laptop, Home, Shirt, Utensils, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { name: "Books & Notes", icon: BookOpen, count: "240+" },
    { name: "Electronics", icon: Laptop, count: "180+" },
    { name: "Furniture", icon: Home, count: "120+" },
    { name: "Clothing", icon: Shirt, count: "310+" },
    { name: "Food & Snacks", icon: Utensils, count: "95+" },
    { name: "Other Items", icon: Package, count: "450+" },
  ]

  const features = [
    {
      icon: Shield,
      title: "College-Only Access",
      description: "Verified student community ensures safe and trusted transactions",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Post items in seconds. Buy or rent with just a few taps",
    },
    {
      icon: Users,
      title: "Within Campus",
      description: "Meet nearby, pick up in minutes. No shipping hassles",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CS Sophomore",
      text: "Found a scientific calculator to rent for just 2 days. Saved me ₹2000!",
    },
    {
      name: "Arjun Patel",
      role: "ECE Junior",
      text: "Sold my old textbooks in minutes. The night market feature is genius.",
    },
    {
      name: "Ananya Singh",
      role: "MBA Freshman",
      text: "Got Maggi at 2 AM from someone in the next hostel. Life saver!",
    },
  ]

  const faqs = [
    {
      question: "How do I verify my college email?",
      answer:
        "Sign up with your official college email address. You'll receive a verification link to confirm your account.",
    },
    {
      question: "Is it safe to buy/sell on CampusThrift?",
      answer:
        "Yes! All users are verified students. We recommend meeting in public campus areas and checking items before payment.",
    },
    {
      question: "How does the Night Market work?",
      answer:
        "Students post food items, snacks, or essentials they're selling late at night. Browse and message sellers to pick up items within hostels.",
    },
    {
      question: "What can I rent or borrow?",
      answer:
        "Anything from calculators, lab coats, sports equipment, to formal wear. Create a request with your duration and budget, and wait for responses.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="container py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
            Trusted by 10,000+ students
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Buy · Sell · Rent · Night Market
          </h1>
          <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl">
            Your campus marketplace, re-imagined.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/marketplace">
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-transparent">
              <Link href="/night-market">
                <Moon className="h-4 w-4" />
                Night Market
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sell">Post Item</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="text-muted-foreground">Find exactly what you need</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">Why CampusThrift?</h2>
            <p className="text-muted-foreground">Built for students, by students</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">What Students Say</h2>
            <p className="text-muted-foreground">Real experiences from our community</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-card">
                <CardContent className="p-6">
                  <p className="mb-4 text-pretty leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance">
              Ready to join your campus community?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground text-pretty">
              Start buying, selling, and trading with verified students today
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
