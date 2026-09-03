import { KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { CopyButton } from "@/components/tool/copy-button";
import { ToolPageHeader } from "@/components/tool/tool-page-header";
import { ToolStatus } from "@/components/tool/tool-status";
import { TextStats } from "@/components/tool/text-stats";
import { Button } from "@/components/ui/button";
import { decodeJwt } from "@/features/jwt";
import { usePersistedInput } from "@/hooks/use-persisted-input";
import { useLargeInputConfirmation } from "@/hooks/use-large-input-confirmation";
import { useSaveLocally } from "@/hooks/use-save-locally";

const sampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1pbmRzS2l0IERlbW8iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjUzNDAyMzAwMH0.signature";

export function JwtDecoderPage() {
  const { enabled } = useSaveLocally();
  const [input, setInput] = usePersistedInput("jwt-decoder", enabled);
  const [submittedToken, setSubmittedToken] = useState("");
  const [error, setError] = useState("");
  const { confirm, dialog } = useLargeInputConfirmation();

  const decoded = useMemo(() => {
    if (!submittedToken) return null;
    try {
      return decodeJwt(submittedToken);
    } catch {
      return null;
    }
  }, [submittedToken]);

  const decode = () => {
    try {
      decodeJwt(input);
      setSubmittedToken(input);
      setError("");
    } catch (decodeError) {
      setSubmittedToken("");
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
  };

  const expiry = decoded?.expiresAt;
  const isExpired = decoded?.isExpired ?? false;

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-full">
      <ToolPageHeader
        title="JWT Decoder"
        description="Decode a JSON Web Token to inspect its header and payload. Nothing leaves your browser."
      />

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button onClick={() => confirm(input, decode)}>
          <KeyRound />
          Decode token
        </Button>
        <Button variant="outline" onClick={useSample}>
          Use sample
        </Button>
      </div>

      <ToolStatus state={error ? "invalid" : decoded ? "valid" : "idle"} message={error} validLabel="JWT decoded successfully" />

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
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
