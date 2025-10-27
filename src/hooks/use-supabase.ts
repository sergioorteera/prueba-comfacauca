import { useEffect, useState, useRef } from "react";

import type { User, Session } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

const OTP_SENT_KEY = "otp_sent_for_user"; // Key to store the OTP sent for the user in sessionStorage

/**
 * Hook to use the Supabase client
 * @returns {Object} Object with the Supabase client, user, session, loading, otpSent, otpEmail, sendOtpToEmail, verifyOtpCode, and resetOtpState
 */
export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const otpSentRef = useRef(false);

  // Get the session and user from the Supabase client
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Send OTP to email
  const sendOtpToEmail = async (email: string) => {
    // Set the email to show the OTP view
    setOtpEmail(email);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Only existing users can receive OTP
        },
      });

      if (error) throw error;

      setOtpSent(true);
      otpSentRef.current = true;
      sessionStorage.setItem(`${OTP_SENT_KEY}_${email}`, "true");
      return { success: true, cooldownSeconds: 0 };
    } catch (error) {
      // Set otpSent to true to show the OTP view even with error
      setOtpSent(true);

      // Extract cooldown time from the error message
      let cooldownSeconds = 60; // Default fallback
      if (error instanceof Error) {
        const errorMessage = error.message;
        const secondsMatch = errorMessage.match(/(\d+)\s+seconds?/i);
        if (secondsMatch) {
          cooldownSeconds = parseInt(secondsMatch[1]);
        }
      }

      // Save cooldown in sessionStorage if there is an error
      if (cooldownSeconds > 0) {
        const cooldownKey = `otp_cooldown_${email}`;
        const cooldownData = {
          expiresAt: Date.now() + cooldownSeconds * 1000,
          email: email,
        };
        sessionStorage.setItem(cooldownKey, JSON.stringify(cooldownData));
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al enviar código OTP",
        cooldownSeconds,
      };
    }
  };

  // Verify OTP code
  const verifyOtpCode = async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al verificar código OTP",
      };
    }
  };

  // Reset OTP state
  const resetOtpState = () => {
    setOtpSent(false);
    setOtpEmail(null);
    otpSentRef.current = false;

    // Clean sessionStorage
    if (otpEmail) {
      sessionStorage.removeItem(`${OTP_SENT_KEY}_${otpEmail}`);
      sessionStorage.removeItem(`otp_cooldown_${otpEmail}`);
    }
  };

  return {
    supabase,
    user,
    session,
    loading,
    otpSent,
    otpEmail,
    sendOtpToEmail,
    verifyOtpCode,
    resetOtpState,
  };
};
