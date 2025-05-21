import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionDetails } from "@/api/subscriptions"; // Assuming you'll create this function
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Assuming a detailed type for Subscription data based on Swagger
interface SubscriptionDetail {
  id: number;
  user: { id: number; username: string; email: string }; // More detailed user info
  plan: { id: number; name: string; price: string; duration_months: number }; // More detailed plan info
  status: string;
  start_date?: string;
  end_date?: string;
  is_auto_renew: boolean;
  created_at: string;
  updated_at: string;
  // Add other relevant fields like transactions, referral bonuses related to this subscription
}


export function AdminSubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const subscriptionId = id ? parseInt(id) : null;

  // Fetch subscription details
  const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery({
    queryKey: ['subscriptionDetails', subscriptionId],
    queryFn: () => getSubscriptionDetails(subscriptionId!), // Implement this function
    enabled: subscriptionId !== null, // Only run when subscriptionId is available
  });

  return (
    <DashboardLayout isAdmin={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
           <Link to="/admin/dashboard" className="mr-4">
             <Button variant="outline" size="icon">
               <ArrowLeft className="h-4 w-4" />
             </Button>
           </Link>
          <h1 className="text-3xl md:text-4xl font-bold gradient-heading">
            Subscription Details
          </h1>
        </div>


        {isLoadingSubscription ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle><Skeleton className="h-8 w-40" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        ) : subscriptionError ? (
          <Card className="shadow-lg border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Error loading subscription details: {subscriptionError.message}
              </p>
            </CardContent>
          </Card>
        ) : subscription ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Subscription ID: {subscription.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User:</p>
                <p className="text-lg">{subscription.user?.username || 'N/A'} ({subscription.user?.email || 'N/A'})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan:</p>
                <p className="text-lg">{subscription.plan?.name || 'N/A'} (${subscription.plan?.price || 'N/A'} / {subscription.plan?.duration_months || 'N/A'} months)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <p className="text-lg">{subscription.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date:</p>
                <p className="text-lg">{subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Date:</p>
                <p className="text-lg">{subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto Renew:</p>
                <p className="text-lg">{subscription.is_auto_renew ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At:</p>
                <p className="text-lg">{new Date(subscription.created_at).toLocaleDateString()}</p>
              </div>
               <div>
                <p className="text-sm font-medium text-muted-foreground">Updated At:</p>
                <p className="text-lg">{new Date(subscription.updated_at).toLocaleDateString()}</p>
              </div>

              {/* TODO: Add sections for associated transactions, referral bonuses, etc. */}

               {/* TODO: Add action buttons (e.g., Cancel Subscription, Extend Subscription) */}
               {/* <div className="mt-6 space-x-4">
                 <Button variant="destructive">Cancel Subscription</Button>
                 <Button>Extend Subscription</Button>
               </div> */}
            </CardContent>
          </Card>
        ) : (
           <Card className="shadow-lg">
             <CardHeader>
               <CardTitle>Subscription Not Found</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">
                 The subscription with ID {subscriptionId} could not be found.
               </p>
             </CardContent>
           </Card>
        )}
      </div>
    </DashboardLayout>
  );
}