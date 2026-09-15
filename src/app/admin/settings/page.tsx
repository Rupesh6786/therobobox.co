"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [settings, setSettings] = useState({
    siteName: "My E-Commerce Store",
    supportEmail: "support@example.com",
    orderNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate an API or Firestore update call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your changes have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
          <CardDescription>
            Manage your store configurations, notifications, and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  placeholder="Enter site name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  placeholder="Enter support email"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferences / Toggles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">System Preferences</h3>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications when a new order or kit is purchased.
                </p>
              </div>
              <Switch
                checked={settings.orderNotifications}
                onCheckedChange={(checked) =>
                  handleChange("orderNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the storefront for maintenance updates.
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  handleChange("maintenanceMode", checked)
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}