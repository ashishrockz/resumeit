import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "@/api/subscriptions"; // Import getSubscriptions
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Assuming a basic type for Subscription data based on Swagger
interface Subscription {
  id: number;
  user: { username: string }; // Assuming user object is nested
  plan: { name: string }; // Assuming plan object is nested
  status: string;
  start_date?: string;
  end_date?: string;
  is_auto_renew: boolean;
  created_at: string;
}

export function AdminSubscriptionsListPage() {
  // Fetch subscriptions data
  const { data: subscriptions, isLoading: isLoadingSubscriptions, error: subscriptionsError } = useQuery({
    queryKey: ['adminSubscriptionsList'], // Use a different query key to avoid conflict with dashboard overview
    queryFn: getSubscriptions,
  });

  return (
    <DashboardLayout isAdmin={true}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-8">
          Subscription Management
        </h1>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">All Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSubscriptions ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : subscriptionsError ? (
              <div className="text-center text-destructive">
                <p>Error loading subscriptions: {subscriptionsError.message}</p>
              </div>
            ) : subscriptions?.results && subscriptions.results.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Auto Renew</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.results.map((subscription: Subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.id}</TableCell>
                        <TableCell>{subscription.user?.username || 'N/A'}</TableCell>
                        <TableCell>{subscription.plan?.name || 'N/A'}</TableCell>
                        <TableCell>{subscription.status}</TableCell>
                        <TableCell>{subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{subscription.is_auto_renew ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{new Date(subscription.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/admin/subscriptions/${subscription.id}`}>
                             <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No subscriptions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}