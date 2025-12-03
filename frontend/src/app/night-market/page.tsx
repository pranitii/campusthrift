'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { SiteHeader } from "@/src/components/site-header"
import { SiteFooter } from "@/src/components/site-footer"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Moon, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import api from "@/src/lib/api"
import { useToast } from "@/src/hooks/use-toast"

export default function NightMarketPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/night-market');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/night-market');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch night market posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Header Section */}
        <div className="border-b bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container py-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Moon className="h-8 w-8 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="mb-3">
                Live Now
              </Badge>
              <h1 className="mb-3 text-4xl font-bold tracking-tight">Night Market</h1>
              <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
                Late-night essentials from students in your hostel. Snacks, stationery, and more available for immediate
                pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="container py-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Available Now</h2>
              <p className="text-sm text-muted-foreground">Fresh listings from the last hour</p>
            </div>
            <Button asChild>
              <Link href="/sell">List Your Item</Link>
            </Button>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((item: any) => (
                <Card key={item.id} className="group overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight">{item.item}</h3>
                      <p className="text-lg font-bold text-nowrap">₹{item.price}</p>
                    </div>
                    <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.hostel}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Qty: {item.quantity}</span>
                      <Badge variant={item.isAvailable ? "default" : "secondary"}>
                        {item.isAvailable ? "Available" : "Sold Out"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" disabled={!item.isAvailable}>
                      {item.isAvailable ? "Contact Seller" : "Sold Out"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Moon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No items available right now</h3>
              <p className="mb-6 text-muted-foreground">Be the first to list something!</p>
              <Button asChild>
                <Link href="/sell">List Your Item</Link>
              </Button>
            </div>
          )}

          {/* Empty State removed as it's now conditional */}
          {false && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Moon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No items available right now</h3>
              <p className="mb-6 text-muted-foreground">Be the first to list something!</p>
              <Button asChild>
                <Link href="/sell">List Your Item</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
