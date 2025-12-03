"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext"
import { SiteHeader } from "@/src/components/site-header"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import Link from "next/link"
import api from "@/src/lib/api"
import { useToast } from "@/src/hooks/use-toast"

export default function RentRequestPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    reason: '',
    budgetRange: '',
    neededFor: '',
    location: '',
    whatsapp: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/rent-request');
    }
  }, [user, isLoading, router]);

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

  if (!user) {
    return null; // Will redirect
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.post('/borrow', {
        itemName: formData.itemName,
        reason: formData.reason,
        budgetRange: formData.budgetRange,
        neededFor: formData.neededFor,
      })

      toast({
        title: "Success!",
        description: "Your rent request has been created successfully.",
      })

      router.push('/marketplace')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Marketplace
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Rent/Borrow Request</CardTitle>
              <CardDescription>Need something temporarily? Let others know!</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">What do you need?</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Scientific Calculator" 
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    required 
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Why do you need it? Any specific requirements..."
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: "Need for upcoming physics exam. Must have trigonometric functions."
                  </p>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <Label>Duration Needed</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="from" className="text-sm text-muted-foreground">
                        From
                      </Label>
                      <Input id="from" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to" className="text-sm text-muted-foreground">
                        To
                      </Label>
                      <Input id="to" type="date" required />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Input 
                    id="budget" 
                    type="text" 
                    placeholder="e.g., ₹50-100" 
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">How much you're willing to pay for the rental period</p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Your Hostel / Pickup Location</Label>
                  <Select required>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Boys Hostels */}
                      <SelectItem value="hostel-a">Hostel A</SelectItem>
                      <SelectItem value="hostel-b">Hostel B</SelectItem>
                      <SelectItem value="hostel-c">Hostel C</SelectItem>
                      <SelectItem value="hostel-d">Hostel D</SelectItem>
                      <SelectItem value="hostel-h">Hostel H</SelectItem>
                      <SelectItem value="hostel-j">Hostel J</SelectItem>
                      <SelectItem value="hostel-k">Hostel K</SelectItem>
                      <SelectItem value="hostel-o">Hostel O</SelectItem>
                      <SelectItem value="hostel-m">Hostel M</SelectItem>
                      <SelectItem value="hostel-pg">Hostel P.G.</SelectItem>
                      {/* Girls Hostels */}
                      <SelectItem value="hostel-q">Hostel Q</SelectItem>
                      <SelectItem value="hostel-n">Hostel N</SelectItem>
                      <SelectItem value="hostel-i">Hostel I</SelectItem>
                      <SelectItem value="hostel-e">Hostel E</SelectItem>
                      <SelectItem value="hostel-frf">Hostel FRF</SelectItem>
                      <SelectItem value="hostel-frg">Hostel FRG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" type="tel" placeholder="+91 98765 43210" required />
                  <p className="text-xs text-muted-foreground">Lenders will contact you on WhatsApp</p>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Request"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" asChild>
                    <Link href="/marketplace">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
