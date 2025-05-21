import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, User, createUser } from "@/api/user";
import { getTemplates, Template, createTemplate } from "@/api/template"; // Import Template and createTemplate
import { getSubscriptions, getTransactions } from "@/api/subscriptions";
import { getAllResumes } from "@/api/resumes";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileTextIcon, DollarSign, FileText, Loader2, Edit, PlusCircle, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox


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

// Define form schema for creating a user
const createUserFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password2: z.string(),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ["password2"],
});

// Define form schema for creating a template
const createTemplateFormSchema = z.object({
  name: z.string().min(1, "Template Name is required"),
  description: z.string().optional(),
  category: z.number().optional().nullable(), // Assuming category is a number ID
  html_structure: z.string().min(1, "HTML Structure is required"),
  css_styles: z.string().optional(),
  is_premium: z.boolean().default(false),
  is_active: z.boolean().default(true),
});


export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false); // State for template modal
  const [showPassword, setShowPassword] = useState(false);

  // Fetch data for admin dashboard
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getUsers,
  });

  const { data: templates, isLoading: isLoadingTemplates, error: templatesError } = useQuery({
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

  // Form for creating a new user
  const createUserForm = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      phone_number: "",
      password: "",
      password2: "",
    },
  });

  // Mutation to create a new user
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "A new user account has been created.",
      });
      setIsCreateUserModalOpen(false);
      createUserForm.reset();
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Create User",
        description: error.message || "An error occurred while creating the user.",
      });
    },
  });

  const handleCreateUserSubmit = (values: z.infer<typeof createUserFormSchema>) => {
    createUserMutation.mutate(values);
  };

  // Form for creating a new template
  const createTemplateForm = useForm<z.infer<typeof createTemplateFormSchema>>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: null,
      html_structure: "",
      css_styles: "",
      is_premium: false,
      is_active: true,
    },
  });

  // Mutation to create a new template
  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      toast({
        title: "Template Created",
        description: "A new template has been added.",
      });
      setIsCreateTemplateModalOpen(false); // Close the modal
      createTemplateForm.reset(); // Reset the form
      queryClient.invalidateQueries({ queryKey: ['adminTemplates'] }); // Invalidate templates query to refetch
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Create Template",
        description: error.message || "An error occurred while creating the template.",
      });
    },
  });

  const handleCreateTemplateSubmit = (values: z.infer<typeof createTemplateFormSchema>) => {
    createTemplateMutation.mutate(values);
  };


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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">User Management</CardTitle>
           <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" /> Create New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <Form {...createUserForm}>
                <form onSubmit={createUserForm.handleSubmit(handleCreateUserSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={createUserForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createUserForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createUserForm.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createUserForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createUserForm.control}
                    name="password2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <DialogFooter>
                    <Button type="submit" disabled={createUserMutation.isPending}>
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
                        <Link to={`/admin/users/${user.id}`}>
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
       <Card className="shadow-lg mb-12">
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

       {/* Template Management Section */}
       <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Template Management</CardTitle>
           <Dialog open={isCreateTemplateModalOpen} onOpenChange={setIsCreateTemplateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" /> Create New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <Form {...createTemplateForm}>
                <form onSubmit={createTemplateForm.handleSubmit(handleCreateTemplateSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={createTemplateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter template name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createTemplateForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {/* TODO: Add Category Select Input */}
                   {/* <FormField
                      control={createTemplateForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category (Optional)</FormLabel>
                          <FormControl>
                             <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : null)} value={field.value?.toString() || ""}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                 TODO: Map over fetched categories
                                <SelectItem value="1">Category 1</SelectItem>
                                <SelectItem value="2">Category 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                   <FormField
                    control={createTemplateForm.control}
                    name="html_structure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HTML Structure</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter HTML structure" rows={8} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={createTemplateForm.control}
                    name="css_styles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CSS Styles (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter CSS styles" rows={8} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={createTemplateForm.control}
                      name="is_premium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Premium Template
                            </FormLabel>
                             <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={createTemplateForm.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Active Template
                            </FormLabel>
                             <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                   <DialogFooter>
                    <Button type="submit" disabled={createTemplateMutation.isPending}>
                      {createTemplateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        "Create Template"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingTemplates ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : templatesError ? (
            <div className="text-center text-destructive">
              <p>Error loading templates: {templatesError.message}</p>
            </div>
          ) : templates?.results && templates.results.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.results.map((template: Template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.category?.name || 'N/A'}</TableCell>
                      <TableCell>{template.is_premium ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{template.is_active ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{new Date(template.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {/* TODO: Add action buttons (e.g., View Details, Edit, Delete) */}
                         <Link to={`/admin/templates/${template.id}/edit`}>
                           <Button variant="outline" size="sm" className="gap-1">
                             <Edit className="h-3 w-3" /> Edit
                           </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No templates found.</p>
            </div>
          )}
        </CardContent>
      </Card>


      </div>
    </DashboardLayout>
  );
}