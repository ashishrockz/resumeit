import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/user"; // Assuming you'll add this
import { getTemplates } from "@/api/template"; // Already exists, might need admin specific
import { getSubscriptions } from "@/api/subscriptions"; // Assuming you'll create this
import { getTransactions } from "@/api/subscriptions"; // Assuming you'll create this
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardPage() {
  // Fetch data for admin dashboard
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers, // Implement this to fetch all users (admin view)
  });

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['adminTemplates'],
    queryFn: getTemplates, // Reuse or create admin specific template fetch
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions } => useQuery({
    queryKey: ['adminSubscriptions'],
    queryFn: getSubscriptions, // Implement this to fetch all subscriptions
  });

   const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: getTransactions, // Implement this to fetch all transactions
  });


  // Placeholder calculations (replace with actual data processing)
  const totalUsers = users?.count || 0;
  const premiumConversionRate = "N/A"; // Calculate from subscriptions data
  const totalTemplates = templates?.count || 0;
  const totalRevenue = "N/A"; // Calculate from transactions data

  return (
    <DashboardLayout isAdmin={true}>
      <h1 className="text-3xl font-bold gradient-heading mb-8">
        Admin Dashboard Overview
      </h1>

      {/* Statistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalUsers}</div>}
             <p className="text-xs text-muted-foreground">
              {/* Add active/inactive breakdown if available */}
              Total registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Conversion Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingSubscriptions ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{premiumConversionRate}</div>}
            <p className="text-xs text-muted-foreground">
              Based on subscription data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingTemplates ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalTemplates}</div>}
            <p className="text-xs text-muted-foreground">
              Available templates
            </p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingTransactions ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalRevenue}</div>}
            <p className="text-xs text-muted-foreground">
              From all transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add more sections for User Management, Template Management, Subscription Management, ATS Analytics */}

    </DashboardLayout>
  );
}