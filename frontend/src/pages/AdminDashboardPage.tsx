import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getUsers, User } from "@/api/user";
import { getTemplates } from "@/api/template";
import { getSubscriptions, getTransactions } from "@/api/subscriptions";
import { getAllResumes } from "@/api/resumes";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileTextIcon, DollarSign, FileText, Loader2, Edit } from "lucide-react"; // Import Edit icon
import { Link } from "react-router-dom";

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


export function AdminDashboardPage() {
  // Fetch data for admin dashboard
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
  });

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['adminTemplates'],
    queryFn: getTemplates,
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions, error: subscriptionsError } = useQuery({
    queryKey: ['adminSubscriptions'],
    queryFn: getSubscriptions,
  });

   const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: getTransactions,
  });

  const { data: resumes, isLoading: isLoadingResumes } = useQuery({
    queryKey: ['adminResumes'],
    queryFn: getAllResumes,
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-8">
          Admin Dashboard Overview
        </h1>

        {/* Statistics Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalUsers}</div>}
               <p className="text-xs text-muted-foreground mt-1">
                Total registered users
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Conversion Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoadingSubscriptions ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{premiumConversionRate}</div>}
              <p className="text-xs text-muted-foreground mt-1">
                Based on active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoadingTemplates ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalTemplates}</div>}
              <p className="text-xs text-muted-foreground mt-1">
                Available templates
              </p>
            </CardContent>
          </Card>

           <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoadingTransactions ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">${totalRevenue}</div>}
              <p className="text-xs text-muted-foreground mt-1">
                From all transactions
              </p>
            </CardContent>
          </Card>
        </div>

       {/* Resumes Created Card */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingResumes ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalResumes}</div>}
            <p className="text-xs text-muted-foreground mt-1">
              Resumes created by users
            </p>
          </CardContent>
        </Card>
       </div>


      {/* User Management Section */}
      <Card className="shadow-lg mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : usersError ? (
            <div className="text-center text-destructive">
              <p>Error loading users: {usersError.message}</p>
            </div>
          ) : users?.results && users.results.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.results.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.is_verified ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/users/${user.id}`}> {/* Link to user detail page */}
                           <Button variant="outline" size="sm" className="gap-1">
                             <Edit className="h-3 w-3" /> Edit
                           </Button>
                        </Link>
                        {/* TODO: Add Delete User functionality */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No users found.</p>
            </div>
          )}
        </CardContent>
      </Card>

       {/* Subscription Management Section */}
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Subscription Management</CardTitle>
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