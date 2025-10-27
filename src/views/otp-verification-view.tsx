import { useState, useEffect, useRef } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface IOtpVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<{ cooldownSeconds?: number }>;
  loading?: boolean;
  error?: string;
  messageType?: "error" | "success" | "info";
  initialCooldown?: number;
}

/**
 * Authentication OTP verification view
 * @param {IOtpVerificationProps} props - Props for the authentication OTP verification view
 * @returns {React.FC} Authentication OTP verification view
 */
export const OtpVerificationView: React.FC<IOtpVerificationProps> = ({
  email,
  onVerify,
  onResend,
  loading = false,
  error,
  messageType = "error",
  initialCooldown = 0,
}: IOtpVerificationProps) => {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Check persistent cooldown when loading the component
  useEffect(() => {
    const cooldownKey = `otp_cooldown_${email}`;
    const savedCooldown = sessionStorage.getItem(cooldownKey);

    if (savedCooldown) {
      const cooldownData = JSON.parse(savedCooldown);
      const now = Date.now();
      const timeRemaining = Math.max(0, cooldownData.expiresAt - now);

      if (timeRemaining > 0) {
        setCooldownSeconds(Math.ceil(timeRemaining / 1000));
      } else {
        // Clear expired cooldown
        sessionStorage.removeItem(cooldownKey);
      }
    } else if (initialCooldown > 0) {
      // Use initial cooldown if there is no persistent cooldown
      setCooldownSeconds(initialCooldown);

      // Save initial cooldown in sessionStorage
      const cooldownData = {
        expiresAt: Date.now() + initialCooldown * 1000,
        email: email,
      };
      sessionStorage.setItem(cooldownKey, JSON.stringify(cooldownData));
    }
  }, [email, initialCooldown]);

  // Handle cooldown counter
  useEffect(() => {
    if (cooldownSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            // Clear cooldown from sessionStorage when it expires
            const cooldownKey = `otp_cooldown_${email}`;
            sessionStorage.removeItem(cooldownKey);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldownSeconds, email]);

  // Clear interval when unmounting the component
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      await onVerify(code);
    }
  };

  // Handle resend
  const handleResend = async () => {
    if (cooldownSeconds > 0 || isResending) return;

    setIsResending(true);
    try {
      const result = await onResend();
      if (result.cooldownSeconds && result.cooldownSeconds > 0) {
        setCooldownSeconds(result.cooldownSeconds);

        // Save cooldown in sessionStorage
        const cooldownKey = `otp_cooldown_${email}`;
        const cooldownData = {
          expiresAt: Date.now() + result.cooldownSeconds * 1000,
          email: email,
        };
        sessionStorage.setItem(cooldownKey, JSON.stringify(cooldownData));
      }
    } finally {
      setIsResending(false);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}s`;
  };

  return (
    <div className="w-full">
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

      {/* OTP Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-linear-to-r from-slate-900 to-slate-700 px-8 py-6">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-white/10" />
          <div className="relative text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Verificación OTP
            </h2>
            <p className="text-slate-300 text-sm mb-1">Código enviado a:</p>
            <p className="text-white font-semibold">{email}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp-code"
                className="block text-sm font-semibold text-slate-900 mb-3 text-center"
              >
                Ingresa el código de 6 dígitos
              </label>
              <Input
                id="otp-code"
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="text-center text-3xl tracking-[0.5em] font-bold h-16 border-2"
                maxLength={6}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={code.length !== 6 || loading}
            >
              {loading ? "Verificando..." : "Verificar Código"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center mb-3">
              ¿No recibiste el código?
            </p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending || cooldownSeconds > 0}
              className="w-full h-11"
            >
              {isResending
                ? "Reenviando..."
                : cooldownSeconds > 0
                ? `Reenviar en ${formatTime(cooldownSeconds)}`
                : "Reenviar Código"}
            </Button>
          </div>

          {error && (
            <div
              className={`mt-6 p-4 rounded-lg border-2 text-sm font-medium text-center ${
                messageType === "error"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : messageType === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
