import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Mail, Phone, Save, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const { updateProfile } = useProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile(form);
    alert("Profile updated ✅");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 rounded-full bg-primary/10">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold">Your Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" /> Full Name
          </label>
          <Input
            value={form.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" /> Email
          </label>
          <Input
            value={form.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" /> Phone
          </label>
          <Input
            value={form.phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className="rounded-xl"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={handleSignOut}
        className="w-full rounded-xl gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
}
