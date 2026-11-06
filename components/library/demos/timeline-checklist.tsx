"use client";

import { TimelineChecklist } from "../timeline-checklist/timeline-checklist";

export default function TimelineChecklistDemo() {
  return (
    <div className="h-[400px] w-full max-w-lg rounded-2xl bg-white px-6 dark:bg-neutral-950">
      <TimelineChecklist
        className="h-full"
        days={[
          { date: "November 6", weekday: "Thursday", tasks: ["Ship the components library", "Record the receipt printer demo", "Reply to Jayash about merch", "Review contact submissions"] },
          { date: "7", weekday: "Friday", tasks: ["Write the npm README", "Pick a license", "Design the OG image", "Sleep 😴"] },
          { date: "8", weekday: "Saturday", tasks: ["Publish v0.1.0", "Tweet the launch thread", "Celebrate"] },
        ]}
      />
    </div>
  );
}
