try {
  const concreteThemes = ["pearl-light", "midnight-violet", "aurora-blue", "cyber-rose", "mint-frost", "amber-dawn"];
  const darkThemes = ["midnight-violet", "aurora-blue", "cyber-rose"];
  const storedTheme = localStorage.getItem("mindskit:theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = concreteThemes.includes(storedTheme)
    ? storedTheme
    : systemDark
      ? "midnight-violet"
      : "pearl-light";

  document.documentElement.dataset.theme = theme;
  if (darkThemes.includes(theme)) document.documentElement.classList.add("dark");
} catch {
  // Storage or media-query APIs may be unavailable; CSS defaults remain usable.
}
