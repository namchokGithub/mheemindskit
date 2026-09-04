import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Scale, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const GITHUB_PROFILE_URL = "https://github.com/namchokGithub/mheemindskit";
const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/namchok-singhachai/";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t border-border bg-background px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-medium text-foreground">MindsKit</p>
          <p className="text-xs text-muted-foreground">
            Simple tools for everyday development.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <FaGithub className="size-3.5" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={LINKEDIN_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <FaLinkedin
              className="size-3.5 text-[#0A66C2]"
              aria-hidden="true"
            />
            LinkedIn
          </a>
          <Link
            to="/privacy"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <ShieldCheck className="size-3.5" />
            Privacy
          </Link>
          <Link
            to="/license"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Scale className="size-3.5" />
            License
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">© {year} MindsKit</p>
      </div>
    </footer>
  );
}
