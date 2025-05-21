import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserDetails, updateUser, User } from "@/api/user"; // Assuming getUserDetails and updateUser exist
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Define form schema for validation
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')), // Email can be optional or empty
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  role: z.enum(["admin", "user"]), // Assuming roles are 'admin' and 'user'
  is_verified: z.boolean(),
});


export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user details
  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery<User>({
    queryKey: ['userDetails', userId],
    queryFn: () => getUserDetails(userId!), // Implement this function
    enabled: userId !== null,
  });

  // Initialize form with user data when available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: user ? {
      username: user.username,
      email: user.email || '',
      full_name: user.full_name || '',
      phone_number: user.phone_number || '',
      role: user.role,
      is_verified: user.is_verified,
    } : undefined,
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email || '',
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        role: user.role,
        is_verified: user.is_verified,
      });
    }
  }, [user, form]);


  // Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => updateUser(userId!, data), // Implement this function
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "The user details have been updated.",
      });
      setIsEditing(false); // Switch back to view mode
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] }); // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); // Invalidate admin list query
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Update User",
        description: error.message || "An error occurred while updating the user.",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserMutation.mutate(values);
  };


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
            User Details
          </h1>
        </div>


        {isLoadingUser ? (
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
        ) : userError ? (
          <Card className="shadow-lg border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading User</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Error loading user details: {userError.message}
              </p>
            </CardContent>
          </Card>
        ) : user ? (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-semibold">User: {user.username}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="is_verified"
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
                              Email Verified
                            </FormLabel>
                             <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />


                    <Button type="submit" disabled={updateUserMutation.isPending}>
                      {updateUserMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID:</p>
                    <p className="text-lg">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username:</p>
                    <p className="text-lg">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email:</p>
                    <p className="text-lg">{user.email || 'N/A'}</p>
                  </div>
                   <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name:</p>
                    <p className="text-lg">{user.full_name || 'N/A'}</p>
                  </div>
                   <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number:</p>
                    <p className="text-lg">{user.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Role:</p>
                    <p className="text-lg">{user.role}</p>
                  </div>
                   <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Verified:</p>
                    <p className="text-lg">{user.is_verified ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At:</p>
                    <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
           <Card className="shadow-lg">
             <CardHeader>
               <CardTitle>User Not Found</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">
                 The user with ID {userId} could not be found.
               </p>
             </CardContent>
           </Card>
        )}
      </div>
    </DashboardLayout>
  );
}