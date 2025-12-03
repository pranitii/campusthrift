'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import { SiteHeader } from '@/src/components/site-header'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { MapPin, User, Phone, QrCode, Share2, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import api from '@/src/lib/api'
import { useToast } from '@/src/hooks/use-toast'

export default function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/listings/${resolvedParams.id}`)
    }
  }, [user, authLoading, router, resolvedParams.id])

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${resolvedParams.id}`)
        setListing(response.data)
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to load listing',
          variant: 'destructive',
        })
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }

    if (user && resolvedParams.id) {
      fetchListing()
    }
  }, [user, resolvedParams.id, router, toast])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !listing) {
    return null
  }

  const handleShare = async () => {
    try {
      const response = await api.get(`/share/generate-message/${listing.id}`)
      const message = response.data.message
      
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: message,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(message)
        toast({
          title: 'Copied!',
          description: 'Listing details copied to clipboard',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share listing',
        variant: 'destructive',
      })
    }
  }

  const handleContact = () => {
    if (listing.whatsapp) {
      window.open(`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`, '_blank')
    } else if (listing.seller?.phoneNumber) {
      window.open(`https://wa.me/${listing.seller.phoneNumber.replace(/\D/g, '')}`, '_blank')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.delete(`/listings/${listing.id}`)
      toast({
        title: 'Success',
        description: 'Listing deleted successfully',
      })
      router.push('/marketplace')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete listing',
        variant: 'destructive',
      })
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="container max-w-5xl">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                <img
                  src={listing.imageUrls?.[0] || '/placeholder.svg'}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {listing.imageUrls && listing.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.imageUrls.slice(1).map((url: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-md border bg-muted cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <img src={url} alt={`${listing.title} ${index + 2}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <p className="text-4xl font-bold text-primary">₹{listing.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{listing.condition}</Badge>
                <Badge variant="outline">{listing.category}</Badge>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {listing.seller?.name || 'Unknown'}
                      {listing.seller?.hostel && ` • ${listing.seller.hostel}`}
                    </span>
                  </div>
                  {(listing.whatsapp || listing.seller?.phoneNumber) && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.whatsapp || listing.seller.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button className="flex-1" size="lg" onClick={handleContact}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {user?.id === listing.sellerId && (
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Listing
                  </Button>
                )}
              </div>

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your listing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete} 
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {listing.qrUrl && (
                <Card>
                  <CardContent className="p-4 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Scan to share</p>
                      <img src={listing.qrUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
