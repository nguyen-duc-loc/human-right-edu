import { TablerIcon } from "@tabler/icons-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Spinner from "../Spinner";
import { Form } from "../ui/form";

interface ActionBtnProps {
  Icon: LucideIcon | TablerIcon;
  IconFilled?: LucideIcon | TablerIcon;
  filled?: boolean;
  number?: number;
  className?: string;
  filledClassName?: string;
  compact?: boolean;
  btnType: "LIKE" | "COMMENT" | "DELETE";
  actionDisabled?: boolean;
  onSubmit?: () => Promise<ActionResponse<unknown>>;
  successMessage?: string;
  redirect?: string;
}

const ActionBtn = ({
  Icon,
  IconFilled,
  filled,
  number,
  className,
  filledClassName,
  compact,
  btnType,
  actionDisabled,
  onSubmit,
  successMessage,
  redirect,
}: ActionBtnProps) => {
  const router = useRouter();
  const form = useForm();
  const isSubmitting = form.formState.isSubmitting;

  const Component = ({
    children,
    componentClassName,
  }: {
    children: React.ReactNode;
    componentClassName?: string;
  }) =>
    compact || actionDisabled ? (
      <div className={componentClassName}>
        {children}
        <span className="text-sm">{number}</span>
      </div>
    ) : btnType !== "COMMENT" && onSubmit ? (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async () => {
            const response = await onSubmit();
            if (!response.success) {
              toast.error(response.error?.message);
            } else {
              if (redirect) {
                router.push(redirect);
              }
              if (successMessage) {
                toast.success(successMessage);
              }
            }
          })}
          className={componentClassName}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="disabled:opacity-50"
          >
            {isSubmitting ? (
              <Spinner className={`size-5 ${btnType === "DELETE" && "mr-6"}`} />
            ) : (
              children
            )}
          </button>
          <span className="text-sm">{number}</span>
        </form>
      </Form>
    ) : (
      <Link
        href={`${btnType === "COMMENT" ? "#comments" : "#"}`}
        className={componentClassName}
      >
        {children}
        <span className="text-sm">{number}</span>
      </Link>
    );

  return (
    <Component componentClassName="flex items-center gap-2">
      {filled && IconFilled ? (
        <IconFilled className={`size-5 ${filledClassName}`} />
      ) : (
        <Icon className={`size-5 ${className}`} />
      )}
    </Component>
  );
};

export default ActionBtn;
