"use client";

/** Delete button that asks for confirmation before running a server action. */
export function ConfirmButton({
  action,
  label = "Delete",
  message = "Delete this permanently?",
}: {
  action: () => Promise<void>;
  label?: string;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="inline-flex min-h-11 items-center rounded-full border border-ember/40 px-5 text-sm font-semibold text-ember hover:bg-ember hover:text-white"
      >
        {label}
      </button>
    </form>
  );
}
