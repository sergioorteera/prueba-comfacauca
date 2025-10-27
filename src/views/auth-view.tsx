import { useState, useEffect, useRef } from "react";

import { OtpVerificationView } from "./otp-verification-view";
import { PageLoader } from "@/components/ui/page-loader";
import { useSupabase } from "@/hooks/use-supabase";
import { GoogleLogo } from "@/assets/google-logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

/**
 * Authentication view component
 * @returns {JSX.Element} Authentication view component
 */
export const AuthView: React.FC = () => {
  const {
    supabase,
    user,
    loading,
    otpSent,
    otpEmail,
    sendOtpToEmail,
    verifyOtpCode,
    resetOtpState,
  } = useSupabase();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "error"
  );
  const [otpLoading, setOtpLoading] = useState(false);
  const [initialCooldown, setInitialCooldown] = useState(0);
  const otpSendAttempted = useRef(false);
  const navigate = useNavigate();

  // Send OTP automatically after the user logs in with Google
  // It is always requested in each login
  useEffect(() => {
    const handlePostLogin = async () => {
      // Only execute if there is a user, OTP has not been sent and we have not attempted to send it
      if (user && !otpSent && !otpSendAttempted.current && user.email) {
        otpSendAttempted.current = true;

        // Send OTP always in each login
        const result = await sendOtpToEmail(user.email);
        if (!result.success) {
          // Extract the seconds from the error message if it is a rate limit
          const errorMessage = result.error || "Error al enviar código OTP";
          const secondsMatch = errorMessage.match(/(\d+)\s+seconds?/i);

          if (secondsMatch) {
            const seconds = secondsMatch[1];
            setMessage("Se ha aplicado un tiempo de espera por seguridad.");
            setMessageType("info");
            setInitialCooldown(parseInt(seconds));
          } else {
            setMessage(errorMessage);
            setMessageType("error");
            setInitialCooldown(result.cooldownSeconds || 60);
          }
        }
      }
    };

    handlePostLogin();
  }, [user, otpSent, sendOtpToEmail]);

  // Handle Google sign in with Supabase
  const handleGoogleSignIn = async () => {
    setMessage("");
    setMessageType("error");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      // The OTP will be sent after the user completes the OAuth
      // The verification will be handled in the OAuth callback
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión con Google"
      );
    }
  };

  // Handle sign out with Supabase
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
    }
    resetOtpState();
    otpSendAttempted.current = false;
    setInitialCooldown(0);
  };

  // Handle OTP verification
  const handleOtpVerify = async (code: string) => {
    const emailToUse = otpEmail || user?.email;
    if (!emailToUse) return;

    setOtpLoading(true);
    setMessage("");
    setMessageType("error");

    try {
      const result = await verifyOtpCode(emailToUse, code);
      if (result.success) {
        // Clean the sessionStorage state because the OTP was verified
        sessionStorage.removeItem(`otp_sent_for_user_${emailToUse}`);
        // Redirect to the dashboard after successful verification
        window.location.href = "/dashboard";
      } else {
        setMessage(result.error || "Código OTP inválido");
        setMessageType("error");
      }
    } catch {
      setMessage("Error al verificar el código OTP");
      setMessageType("error");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP resend
  const handleOtpResend = async () => {
    const emailToUse = otpEmail || user?.email;
    if (!emailToUse) return { cooldownSeconds: 0 };

    setMessage("");
    setMessageType("error");

    // Clean the sessionStorage state to allow resend
    sessionStorage.removeItem(`otp_sent_for_user_${emailToUse}`);
    otpSendAttempted.current = false;

    const result = await sendOtpToEmail(emailToUse);
    if (!result.success) {
      // Extract the seconds from the error message if it is a rate limit
      const errorMessage = result.error || "Error al reenviar código OTP";
      const secondsMatch = errorMessage.match(/(\d+)\s+seconds?/i);

      if (secondsMatch) {
        const seconds = secondsMatch[1];
        setMessage("Se ha aplicado un tiempo de espera por seguridad.");
        setMessageType("info");
        return { cooldownSeconds: parseInt(seconds) };
      } else {
        setMessage(errorMessage);
        setMessageType("error");
        return { cooldownSeconds: 60 }; // Fallback of 60 seconds
      }
    } else {
      setMessage("Código OTP reenviado exitosamente");
      setMessageType("success");
      return { cooldownSeconds: 0 };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-slate-400/20 blur-3xl" />
        </div>
        <PageLoader />
      </div>
    );
  }

  // If there is an authenticated user, always show the OTP verification
  if (user && user.email) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-6">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-slate-400/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md space-y-4">
          <OtpVerificationView
            email={otpEmail || user.email}
            onVerify={handleOtpVerify}
            onResend={handleOtpResend}
            loading={otpLoading}
            error={message}
            messageType={messageType}
            initialCooldown={initialCooldown}
          />

          <div className="text-center">
            <Button onClick={handleSignOut} variant="outline">
              Cancelar y Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-slate-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div>
              <img
                src="https://www.comfacauca.com/wp-content/uploads/media-1.svg"
                alt="Logo Comfacauca"
                className="h-16 w-auto"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sistema de Gestión de Visitas
          </h1>
        </div>

        {/* Login Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
          {/* Header with gradient */}
          <div className="relative overflow-hidden bg-linear-to-r from-slate-900 to-slate-700 px-8 py-6">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-1">
                Iniciar Sesión
              </h2>
              <p className="text-slate-300 text-sm">
                Accede con tu cuenta de Google
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full h-12 bg-white border-2 border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400 shadow-md flex items-center justify-center gap-3"
            >
              <GoogleLogo />
              <span className="font-semibold">Continuar con Google</span>
            </Button>

            {message && (
              <div
                className={`p-4 rounded-lg border-2 text-sm font-medium ${
                  messageType === "error"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : messageType === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <p className="text-center text-xs text-slate-500 leading-relaxed">
                Al continuar, aceptas nuestros{" "}
                <span className="text-slate-800 font-medium">
                  términos de servicio
                </span>{" "}
                y{" "}
                <span className="text-slate-800 font-medium">
                  política de privacidad
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-center">
          <p
            onClick={() => navigate("/")}
            className="text-sm text-slate-900 font-medium cursor-pointer hover:underline"
          >
            Regresar al home
          </p>
        </div>
      </div>
    </div>
  );
};
