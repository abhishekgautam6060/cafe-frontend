import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginUser, signupUser } from "@/services/authService";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        if (!email || !password) {
          toast.error("Email and Password are required ❌");
          setLoading(false);
          return;
        }
        const res = await loginUser({
          email: email,
          password: password,
        });
        // ✅ Save JWT token
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("name", JSON.stringify(res.name));
        localStorage.setItem("email", JSON.stringify(res.email));

        toast.success("Login successful 🚀");

        // redirect
        window.location.href = "/";
      } else {
        // ✅ VALIDATION
        if (!fullName || !email || !phone || !password) {
          toast.error("All fields are required ❌");
          setLoading(false);
          return;
        }

        await signupUser({
          fullName: fullName,
          email: email,
          phone: phone,
          password: password,
        });

        toast.success("Account created successfully ✅");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.log("LOGIN ERROR:", err); // debug (important)

      let message = "Something went wrong ❌";

      if (err.response) {
        // Backend responded with error
        message =
          err.response.data?.message || // { message: "Invalid credentials" }
          err.response.data || // plain string
          "Invalid email or password ❌";
      } else if (err.request) {
        // No response from server
        message = "Server not responding 🚨";
      } else {
        // Other errors
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(25_60%_35%/0.6),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(16_65%_50%/0.3),transparent_50%)]" />
        <div className="relative z-10 text-center px-12 space-y-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
            <Coffee className="w-12 h-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-5xl font-display font-bold text-primary-foreground mb-4">
              Café Manager
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-md mx-auto leading-relaxed">
              Streamline your café operations with elegant table management,
              real-time orders & instant billing.
            </p>
          </div>
          <div className="flex gap-8 justify-center text-primary-foreground/60 text-sm">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary-foreground">
                12
              </p>
              <p>Tables</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary-foreground">
                18
              </p>
              <p>Menu Items</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary-foreground">
                3
              </p>
              <p>Pay Modes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <Coffee className="w-8 h-8 text-primary" />
              <span className="text-2xl font-display font-bold text-foreground">
                Café Manager
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">
              {isLogin ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Sign in to manage your café"
                : "Create your account to begin"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cafe Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your Wonder Cafe Name 😉"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 bg-card border-border/60 text-base"
                />
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter you number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 bg-card border-border/60 text-base"
                />
              </div>
            )}
            <div className="space-y-2">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg animate-in fade-in">
                  <span className="text-red-500 font-bold">👀 Oops</span>
                  <span>{error}</span>
                </div>
              )}
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@cafe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-card border-border/60 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 bg-card border-border/60 text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-primary font-semibold">
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
