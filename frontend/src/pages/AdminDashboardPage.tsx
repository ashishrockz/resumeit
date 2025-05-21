import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/user";
import { getTemplates } from "@/api/template";
import { getSubscriptions, getTransactions } from "@/api/subscriptions";
import { getAllResumes } from "@/api/resumes"; // Import the function to get all resumes
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileTextIcon, DollarSign, FileText } from "lucide-react"; // Import FileText

export function AdminDashboardPage() {
  // Fetch data for admin dashboard
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
  });

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['adminTemplates'],
    queryFn: getTemplates,
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['adminSubscriptions'],
    queryFn: getSubscriptions,
  });

   const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: getTransactions,
  });

  const { data: resumes, isLoading: isLoadingResumes } = useQuery({
    queryKey: ['adminResumes'],
    queryFn: getAllResumes, // Fetch all resumes
  });


  // Calculate statistics
  const totalUsers = users?.count || 0;
  const totalTemplates = templates?.count || 0;
  const totalSubscriptions = subscriptions?.count || 0;
  const totalTransactions = transactions?.count || 0;
  const totalResumes = resumes?.count || 0;

  // Placeholder calculations (replace with actual data processing)
  const premiumConversionRate = totalUsers > 0 ? `${((subscriptions?.results.filter((sub: any) => sub.status === 'active').length || 0) / totalUsers * 100).toFixed(2)}%` : "N/A";
  const totalRevenue = transactions?.results.reduce((sum: number, transaction: any) => sum + parseFloat(transaction.amount), 0).toFixed(2) || "0.00";


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
              Based on active subscriptions
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
             {isLoadingTransactions ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">${totalRevenue}</div>}
            <p className="text-xs text-muted-foreground">
              From all transactions
            </p>
          </CardContent>
        </Card>
      </div>

       {/* Resumes Created Card */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingResumes ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalResumes}</div>}
            <p className="text-xs text-muted-foreground">
              Resumes created by users
            </p>
          </CardContent>
        </Card>
       </div>


      {/* TODO: Add more sections for User Management, Template Management, Subscription Management, ATS Analytics */}

    </DashboardLayout>
  );
}