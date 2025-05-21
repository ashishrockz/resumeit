import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { getSubscriptionDetails, updateSubscription } from "@/api/subscriptions"; // Import updateSubscription
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, XCircle, Loader2 } from "lucide-react"; // Import icons
import { useState, useEffect } from "react"; // Import useEffect
import { useForm } from "react-hook-form"; // Import useForm
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import * as z from "zod"; // Import z
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import form components
import { Input } from "@/components/ui/input"; // Import Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { useToast } from "@/hooks/use-toast"; // Import useToast

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
  plan_id: number; // Add plan_id for the form
  // Add other relevant fields like transactions, referral bonuses related to this subscription
}

// Define form schema for validation
const formSchema = z.object({
  plan_id: z.number({ required_error: "Plan is required" }),
  status: z.string().min(1, "Status is required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_auto_renew: z.boolean(),
});


export function AdminSubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const subscriptionId = id ? parseInt(id) : null;
  const queryClient = useQueryClient(); // Initialize query client
  const { toast } = useToast(); // Initialize toast

  const [isEditing, setIsEditing] = useState(false);
  // TODO: Fetch subscription plans for the select input

  // Fetch subscription details
  const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery<SubscriptionDetail>({ // Specify type
    queryKey: ['subscriptionDetails', subscriptionId],
    queryFn: () => getSubscriptionDetails(subscriptionId!),
    enabled: subscriptionId !== null,
  });

  // Initialize form with subscription data when available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: subscription ? { // Use 'values' to populate form
      plan_id: subscription.plan?.id || 0, // Use plan.id
      status: subscription.status,
      start_date: subscription.start_date?.split('T')[0], // Format date for input
      end_date: subscription.end_date?.split('T')[0], // Format date for input
      is_auto_renew: subscription.is_auto_renew,
    } : undefined, // Set to undefined initially
  });

  // Reset form when subscription data changes
  useEffect(() => {
    if (subscription) {
      form.reset({
        plan_id: subscription.plan?.id || 0,
        status: subscription.status,
        start_date: subscription.start_date?.split('T')[0],
        end_date: subscription.end_date?.split('T')[0],
        is_auto_renew: subscription.is_auto_renew,
      });
    }
  }, [subscription, form]);


  // Mutation to update subscription
  const updateSubscriptionMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => updateSubscription(subscriptionId!, data), // Pass subscriptionId
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "The subscription details have been updated.",
      });
      setIsEditing(false); // Switch back to view mode
      queryClient.invalidateQueries({ queryKey: ['subscriptionDetails', subscriptionId] }); // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['adminSubscriptions'] }); // Invalidate admin list query
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Update Subscription",
        description: error.message || "An error occurred while updating the subscription.",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateSubscriptionMutation.mutate(values);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-semibold">Subscription ID: {subscription.id}</CardTitle>
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
                    {/* TODO: Add Plan Select Input */}
                     {/* <div>
                      <Label htmlFor="plan">Plan</Label>
                      <Select onValueChange={(value) => form.setValue("plan_id", parseInt(value))} value={form.watch("plan_id")?.toString() || ""}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                           TODO: Map over fetched plans
                          <SelectItem value="1">Basic</SelectItem>
                          <SelectItem value="2">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                       {form.formState.errors.plan_id && <p className="text-destructive text-sm mt-1">{form.formState.errors.plan_id.message}</p>}
                    </div> */}

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="is_auto_renew"
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
                              Auto Renew
                            </FormLabel>
                             <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />


                    <Button type="submit" disabled={updateSubscriptionMutation.isPending}>
                      {updateSubscriptionMutation.isPending ? (
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
                </div>
              )}
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