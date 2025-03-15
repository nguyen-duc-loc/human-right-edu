import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarUserProps {
  user: {
    username: string;
    email: string;
    avatar: string | null;
  };
}

export default function SidebarUser({ user }: SidebarUserProps) {
  const { username, email, avatar } = user;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8">
        <AvatarImage src={avatar ?? undefined} alt={`${avatar} avatar`} />
        <AvatarFallback className="border">
          {username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 text-sm">
        <p className="truncate font-semibold">{`@${username}`}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
