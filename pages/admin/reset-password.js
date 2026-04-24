import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

function baseInputClass() {
  return "rounded-xl border border-[#c9573c]/15 bg-[#fffaf7] px-4 py-3 text-sm outline-none transition focus:border-[#c9573c]";
}

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function bootstrapRecoverySession() {
      if (!router.isReady) {
        return;
      }

      const tokenHash = String(router.query.token_hash || "");
      const type = String(router.query.type || "");

      if (tokenHash && type === "recovery") {
        const { error: otpError } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        });

        if (!mounted) {
          return;
        }

        if (otpError) {
          setError(otpError.message || "Link di reset non valido o scaduto.");
        } else {
          setHasRecoverySession(true);
        }

        setCheckingSession(false);
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message || "Errore nel recupero sessione.");
      }

      setHasRecoverySession(Boolean(data?.session));
      setCheckingSession(false);
    }

    bootstrapRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || Boolean(session)) {
        setHasRecoverySession(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router.isReady, router.query.token_hash, router.query.type]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Inserisci e conferma la nuova password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La password deve avere almeno 6 caratteri.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Le due password non coincidono.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(
          updateError.message || "Aggiornamento password non riuscito.",
        );
      }

      setNotice(
        "Password aggiornata con successo. Tra pochi secondi torni al login admin.",
      );
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.assign("/admin");
        }
      }, 1800);
    } catch (updateError) {
      setError(updateError.message || "Aggiornamento password non riuscito.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Reset Password Admin</title>
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fef3ea_0%,#fff8f4_52%,#f6eee8_100%)] px-4 py-10">
        <section className="w-full max-w-xl rounded-[2rem] border border-[#c9573c]/10 bg-white/80 p-8 shadow-[0_24px_60px_rgba(35,47,55,0.08)] backdrop-blur-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
            Luisa Quaglia Tour Guide
          </p>
          <h1 className="mb-3 text-4xl font-bold leading-tight text-[#2c395b]">
            Nuova password admin
          </h1>

          {!hasRecoverySession ? (
            <div className="space-y-4">
              <p className="text-base leading-7 text-[#6d7b80]">
                Per aggiornare la password apri questa pagina dal link ricevuto
                via email.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9573c]/20 bg-[#fef3ea] px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
              >
                Torna al login admin
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#2c395b]">
                  Nuova password
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Inserisci nuova password"
                  className={baseInputClass()}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#2c395b]">
                  Conferma password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Conferma nuova password"
                  className={baseInputClass()}
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43] disabled:opacity-60"
              >
                Aggiorna password
              </button>
            </form>
          )}

          {error ? (
            <div className="mt-6 rounded-[1.5rem] border border-[#c9573c]/20 bg-[#fff1ec] px-5 py-4 text-sm font-medium text-[#b74d33]">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="mt-6 rounded-[1.5rem] border border-[#4b6b4e]/20 bg-[#edf7ee] px-5 py-4 text-sm font-medium text-[#4b6b4e]">
              {notice}
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
