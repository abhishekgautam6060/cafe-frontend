// hooks/useProfile.ts
import { useEffect, useState } from "react";
import API from "@/services/api";

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    const res = await API.get("/auth/me");
    setProfile(res.data);
  };

  const updateProfile = async (data: any) => {
    const res = await API.put("/auth/me", data);
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, updateProfile };
}
