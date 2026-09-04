import { KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { CopyButton } from "@/components/tool/copy-button";
import { ToolPageHeader } from "@/components/tool/tool-page-header";
import { ToolStatus } from "@/components/tool/tool-status";
import { TextStats } from "@/components/tool/text-stats";
import { Button } from "@/components/ui/button";
import { decodeJwt, encodeJwt, type JwtHmacAlgorithm, verifyJwtSignature } from "@/features/jwt";
import { usePersistedInput } from "@/hooks/use-persisted-input";
import { useLargeInputConfirmation } from "@/hooks/use-large-input-confirmation";
import { useSaveLocally } from "@/hooks/use-save-locally";

const sampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1pbmRzS2l0IERlbW8iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjUzNDAyMzAwMH0.signature";

export function JwtDecoderPage() {
  const [mode, setMode] = useState<"decoder" | "encoder">("decoder");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ToolPageHeader
        title={mode === "decoder" ? "JWT Decoder" : "JWT Encoder"}
        description={mode === "decoder" ? "Decode a JSON Web Token to inspect its header and payload. Nothing leaves your browser." : "Create an HMAC-signed JSON Web Token locally in your browser."}
      />
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-muted p-1 text-sm font-medium">
          <button type="button" onClick={() => setMode("decoder")} className={`rounded-full px-4 py-1.5 transition-colors ${mode === "decoder" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>JWT Decoder</button>
          <button type="button" onClick={() => setMode("encoder")} className={`rounded-full px-4 py-1.5 transition-colors ${mode === "encoder" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>JWT Encoder</button>
        </div>
      </div>
      {mode === "decoder" ? <JwtDecoder /> : <JwtEncoder />}
    </div>
  );
}

function JwtDecoder() {
  const { enabled } = useSaveLocally();
  const [input, setInput] = usePersistedInput("jwt-decoder", enabled);
  const [submittedToken, setSubmittedToken] = useState("");
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [secretIsBase64Url, setSecretIsBase64Url] = useState(false);
  const [signatureVerified, setSignatureVerified] = useState(false);
  const { confirm, dialog } = useLargeInputConfirmation();

  const decoded = useMemo(() => {
    if (!submittedToken) return null;
    try {
      return decodeJwt(submittedToken);
    } catch {
      return null;
    }
  }, [submittedToken]);

  const decode = async () => {
    try {
      decodeJwt(input);
      if (secret.trim()) {
        await verifyJwtSignature(input, { secret, secretIsBase64Url });
      }
      setSubmittedToken(input);
      setError("");
      setSignatureVerified(Boolean(secret.trim()));
    } catch (decodeError) {
      setSubmittedToken("");
      setSignatureVerified(false);
      setError(
        decodeError instanceof Error
          ? decodeError.message
          : "Unable to decode this JWT.",
      );
    }
  };

  const useSample = () => {
    setInput(sampleToken);
    setSubmittedToken(sampleToken);
    setError("");
    setSignatureVerified(false);
  };

  const expiry = decoded?.expiresAt;
  const isExpired = decoded?.isExpired ?? false;
  const shouldVerifySignature = secret.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button onClick={() => confirm(input, () => void decode())}>
          <KeyRound />
          Decode token
        </Button>
        <Button variant="outline" onClick={useSample}>
          Use sample
        </Button>
      </div>

      <ToolStatus state={error ? "invalid" : decoded ? "valid" : "idle"} message={error} validLabel="JWT decoded successfully" />

      <div className="tool-workspace-grid grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <section className="flex min-h-72 flex-col gap-2 rounded-xl border border-border bg-editor/40 p-3 lg:min-h-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Encoded token
            </span>
            <TextStats value={input} />
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            placeholder="Paste a JSON Web Token here…"
            wrap
            ariaLabel="Encoded JWT"
            language="text"
          />
        </section>

        <section className="grid min-h-0 gap-4 rounded-xl border border-border bg-muted/20 p-3 lg:grid-rows-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <DecodedSection
            title="Header"
            value={decoded?.header ?? ""}
            placeholder="The decoded header will appear here."
          />
          <DecodedSection
            title="Payload"
            value={decoded?.payload ?? ""}
            placeholder="The decoded payload will appear here."
          />
        </section>
      </div>

      <section className="shrink-0 rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">JWT Signature Verification <span className="font-normal text-muted-foreground">(Optional)</span></h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Enter the secret used to sign the JWT below.</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>BASE64URL ENCODED</span>
            <input
              type="checkbox"
              checked={secretIsBase64Url}
              onChange={(event) => {
                setSecretIsBase64Url(event.target.checked);
                setSignatureVerified(false);
              }}
              className="size-4 accent-primary"
            />
          </label>
        </div>
        <label className="mt-4 grid gap-1.5 text-sm font-medium">
          Secret
          <input
            type="password"
            value={secret}
            onChange={(event) => {
              setSecret(event.target.value);
              setSignatureVerified(false);
            }}
            placeholder="Leave blank to decode without verification"
            autoComplete="off"
            className="h-9 rounded-lg border border-border bg-editor px-3 font-mono text-sm outline-none transition-shadow placeholder:font-sans placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50"
          />
        </label>
      </section>

      {decoded && (
        <div className="grid shrink-0 gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              Signature
            </span>
            <code className="block truncate font-mono text-xs text-foreground">
              {decoded.signature || "No signature value"}
            </code>
          </div>
          {shouldVerifySignature && (
            <div className={signatureVerified ? "text-foreground" : "text-destructive"}>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                {signatureVerified ? <ShieldCheck className="size-3.5 text-primary" /> : <ShieldAlert className="size-3.5" />}
                Signature verification
              </span>
              <span>{signatureVerified ? "Verified" : "Not verified"}</span>
            </div>
          )}
          {expiry ? (
            <div className={isExpired ? "text-destructive" : "text-foreground"}>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                {isExpired ? (
                  <ShieldAlert className="size-3.5" />
                ) : (
                  <ShieldCheck className="size-3.5 text-primary" />
                )}
                Token expiry
              </span>
              <span>
                {expiry.toLocaleString()}
                {isExpired ? " (expired)" : ""}
              </span>
            </div>
          ) : (
            <div>
              <span className="block text-xs font-medium text-muted-foreground">
                Token expiry
              </span>
              <span>No exp claim</span>
            </div>
          )}
        </div>
      )}
      {dialog}
    </div>
  );
}

const encoderSampleHeader = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);
const encoderSamplePayload = JSON.stringify(
  { sub: "1234567890", name: "Mindskit Demo", iat: 1704067200 },
  null,
  2,
);

function JwtEncoder() {
  const [header, setHeader] = useState(encoderSampleHeader);
  const [payload, setPayload] = useState(encoderSamplePayload);
  const [secret, setSecret] = useState("");
  const [secretIsBase64Url, setSecretIsBase64Url] = useState(false);
  const [algorithm, setAlgorithm] = useState<JwtHmacAlgorithm>("HS256");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const result = await encodeJwt(header, payload, {
        algorithm,
        secret,
        secretIsBase64Url,
      });
      setToken(result);
      setError("");
    } catch (encodeError) {
      setToken("");
      setError(encodeError instanceof Error ? encodeError.message : "Unable to generate this JWT.");
    } finally {
      setIsGenerating(false);
    }
  };

  const setSelectedAlgorithm = (value: JwtHmacAlgorithm) => {
    setAlgorithm(value);
    try {
      const parsed: unknown = JSON.parse(header);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        setHeader(JSON.stringify({ ...parsed, alg: value }, null, 2));
      }
    } catch {
      // Leave invalid user input untouched; generation will explain the issue.
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Fill in the fields below to generate a signed JWT.</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            setHeader(encoderSampleHeader);
            setPayload(encoderSamplePayload);
            setToken("");
            setError("");
          }}>Generate example</Button>
          <select
            value={algorithm}
            onChange={(event) => setSelectedAlgorithm(event.target.value as JwtHmacAlgorithm)}
            className="h-8 rounded-lg border border-border bg-background px-2 text-sm outline-none focus:ring-3 focus:ring-ring/50"
            aria-label="JWT signing algorithm"
          >
            <option value="HS256">HS256</option>
            <option value="HS384">HS384</option>
            <option value="HS512">HS512</option>
          </select>
        </div>
      </div>

      <ToolStatus state={error ? "invalid" : token ? "valid" : "idle"} message={error} validLabel="JWT generated successfully" />

      <div className="tool-workspace-grid grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <div className="grid min-h-0 gap-4 lg:grid-rows-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]">
          <EncoderEditor title="Header" label="Algorithm & Token Type" value={header} onChange={setHeader} placeholder="Enter JWT header JSON" />
          <EncoderEditor title="Payload" label="Data" value={payload} onChange={setPayload} placeholder="Enter JWT payload JSON" />
          <section className="rounded-xl border border-border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">Sign JWT</span>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>BASE64URL ENCODED</span>
                <input type="checkbox" checked={secretIsBase64Url} onChange={(event) => setSecretIsBase64Url(event.target.checked)} className="size-4 accent-primary" />
              </label>
            </div>
            <label className="mt-3 grid gap-1.5 text-sm font-medium">
              Secret
              <input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="Enter signing secret" autoComplete="off" className="h-9 rounded-lg border border-border bg-editor px-3 font-mono text-sm outline-none transition-shadow placeholder:font-sans placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50" />
            </label>
            <Button className="mt-3" onClick={() => void generate()} disabled={isGenerating}>
              <KeyRound />
              {isGenerating ? "Generating…" : "Generate JWT"}
            </Button>
          </section>
        </div>

        <section className="flex min-h-72 flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3 lg:min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">JWT Signature</span>
            <CopyButton value={token} />
          </div>
          <CodeEditor value={token} readOnly placeholder="Your signed JWT will appear here." wrap ariaLabel="Encoded JWT" language="text" />
        </section>
      </div>
    </div>
  );
}

function EncoderEditor({ title, label, value, onChange, placeholder }: { title: string; label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <section className="flex min-h-52 flex-col gap-2 rounded-xl border border-border bg-editor/40 p-3 lg:min-h-0">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <CodeEditor value={value} onChange={onChange} placeholder={placeholder} wrap ariaLabel={`JWT ${title}`} language="json" />
      </div>
    </section>
  );
}

function DecodedSection({
  title,
  value,
  placeholder,
}: {
  title: string;
  value: string;
  placeholder: string;
}) {
  return (
    <div className="flex min-h-52 flex-col gap-2 lg:min-h-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <CopyButton value={value} />
      </div>
      <CodeEditor
        value={value}
        readOnly
        placeholder={placeholder}
        wrap
        ariaLabel={`Decoded JWT ${title.toLowerCase()}`}
      />
    </div>
  );
}
