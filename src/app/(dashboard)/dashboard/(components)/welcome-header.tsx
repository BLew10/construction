interface WelcomeHeaderProps {
  userName: string | undefined;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Welcome, {userName || "User"}
      </h1>
    </div>
  );
}
