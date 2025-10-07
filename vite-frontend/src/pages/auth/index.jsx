import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { toast } from "react-toastify";

const FAKE_DB = {
  /* otpToken -> { code, phone, expiresAt } */
};

function randomToken() {
  return Math.random().toString(36).slice(2, 12);
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function fakeSendOTP(email) {
  return new Promise((resolve) => {
    const otpToken = randomToken();
    const code = generateCode();
    const expiresIn = 3 * 60; // seconds
    const expiresAt = Date.now() + expiresIn * 1000;
    FAKE_DB[otpToken] = { code, email, expiresAt };

    console.info(
      `[fakeSendOTP] OTP for ${email}: ${code} (token: ${otpToken})`
    );

    // persist token in localStorage so verify page can recover on reload
    localStorage.setItem("latestOtpToken", otpToken);
    localStorage.setItem("latestOtpPhone", email);

    setTimeout(() => resolve({ otpToken, expiresIn }), 700);
  });
}

export function fakeVerifyOTP(otpToken, code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = FAKE_DB[otpToken];
      if (!item) return reject(new Error("Invalid or expired token"));
      if (Date.now() > item.expiresAt) return reject(new Error("OTP expired"));
      if (item.code !== String(code).trim())
        return reject(new Error("Incorrect code"));

      localStorage.setItem(
        "fakeUser",
        JSON.stringify({
          id: 1,
          name: "Demo User",
          email: item.email,
        })
      );
      // remove used otp
      delete FAKE_DB[otpToken];
      resolve({ ok: true });
    }, 700);
  });
}

/* -------------------------
   LoginPage
   ------------------------- */
export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: (vals) => login(vals),
    onMutate: () => {
      setError(null);
    },
    onSuccess: (data, vars) => {
      console.log("login success", data);
      navigate("/");
    },
  });

  const onSubmit = (vals) => {
    // console.log(vals, "<----VALUE");
    mutation.mutate(vals);
  };
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign in quickly with your email. We'll send a one-time code.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                minLength: { value: 3, message: "Please enter a valid value" },
              })}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="name@example.com"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              type="text"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 3, message: "Please enter a valid value" },
              })}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.password ? "border-red-300" : "border-gray-200"
              }`}
              placeholder=""
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              type="text"
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:opacity-95 transition disabled:opacity-50"
          >
            {mutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   VerifyOTPPage
   ------------------------- */
export const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { verifyOtp } = useAuth();
  const [email, setemail] = useState(
    state.email || localStorage.getItem("latestOtpPhone") || ""
  );
  const [otpToken, setOtpToken] = useState(
    state.otpToken || localStorage.getItem("latestOtpToken") || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(state.expiresIn || 180);
  const inputsRef = useRef([]);
  const [values, setValues] = useState(Array(6).fill(""));
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    // countdown timer
    let t;
    if (countdown > 0) {
      t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      setResendDisabled(true);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    // focus first input on mount
    setTimeout(() => inputsRef.current[0]?.focus?.(), 80);
  }, []);

  const handleChange = (idx, e) => {
    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...values];
    next[idx] = v;
    setValues(next);
    if (v && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .trim()
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (paste.length) {
      const next = Array(6).fill("");
      for (let i = 0; i < paste.length; i++) next[i] = paste[i];
      setValues(next);
      // focus after pasted length
      setTimeout(
        () => inputsRef.current[Math.min(paste.length, 5)]?.focus(),
        20
      );
    }
  };

  const otpString = values.join("");

  const onVerify = async () => {
    setError(null);
    if (otpString.length < 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyOtp(otpToken, otpString);
      // success -> navigate to app
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      const { otpToken: newToken, expiresIn } = await login(email);
      setOtpToken(newToken);
      setCountdown(expiresIn);
      setValues(Array(6).fill(""));
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  const masked = email
    ? email.replace(
        /(.{2})(.*)(.{2})/,
        (m, a, b, c) => `${a}${b.replace(/./g, "*")}${c}`
      )
    : "your contact";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Verify your code
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-700">{masked}</span>. It may
          take a minute.
        </p>

        <div onPaste={handlePaste} className="flex gap-2 justify-center mb-3">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={v}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 text-center rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-lg"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {error && (
          <div role="alert" className="text-sm text-red-600 mb-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onVerify}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify & Continue"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Back
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
          <div>
            {resendDisabled ? (
              <span>
                Resend available in <strong>{Math.max(0, countdown)}</strong>s
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="underline text-blue-600"
              >
                Resend code
              </button>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                // fallback: clear session and go back to login
                localStorage.removeItem("latestOtpToken");
                localStorage.removeItem("latestOtpPhone");
                navigate("/login");
              }}
              className="text-xs text-gray-400 hover:underline"
            >
              Use different number
            </button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          Tip: For local development the OTP is logged to the console by the
          fake API.
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   How to use
   -------------------------
   - Add routes in your app (example using react-router-dom v6):

     <Routes>
       <Route path="/login" element={<LoginPage />} />
       <Route path="/verify-otp" element={<VerifyOTPPage />} />
       <Route path="/dashboard" element={<Dashboard />} />
     </Routes>

   - The fake API prints the OTP to the browser console (dev convenience).
   - Replace fakeSendOTP/fakeVerifyOTP with your real backend calls.

*/
