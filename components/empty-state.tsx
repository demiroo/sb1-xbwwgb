import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h3 className="mt-2 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action && (
          <div className="mt-6">
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}