'use client';

import { Trash2 } from 'lucide-react';

/**
 * Deleting is the one action here that cannot be undone, so it asks first —
 * and it is styled as the quietest control on the screen, not the loudest.
 * A red button sitting beside Save is an accident waiting to happen.
 */
export default function DeleteCarButton({
  action,
  name,
}: {
  action: () => void | Promise<void>;
  name: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Remove the ${name} completely?\n\nIf it has been sold, mark it as sold instead — that hides it from the website but keeps the record. Deleting cannot be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] text-stone-600 transition-colors duration-300 hover:bg-danger-wash hover:text-danger-ink"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
        Delete this car
      </button>
    </form>
  );
}
