import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/LanguageContext";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {t, toggleLang, lang} = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError("Unable to sign in. Check your credentials and administrator access."); return; }
    navigate("/admin/dashboard");
  };

  return (
    <div className="page-shell">
          <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 font-body">
            <ArrowLeft className="h-4 w-4" /> {t("BacktoHome")}
          </Link>
          </div>
          </div>
          
    <div className="flex md:items-center justify-center">
      <div className="form-panel w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-card-foreground mb-6">Admin Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">Email</label>
            <Input id="email" type="email" autoComplete="username" placeholder="admin@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-1">Password</label>
            <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
    </div>
  );
}

