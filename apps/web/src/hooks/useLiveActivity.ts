"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSdk } from "@/lib/somniaClient";

export type Activity = {
  user: `0x${string}`;
  activityType: string;
  activityContext: string;
  activityValue: bigint;
  realm: number;
  timestamp: number;
  sourceId: `0x${string}`;
};

const SCHEMA_ID = process.env.NEXT_PUBLIC_SCHEMA_ID as `0x${string}`;
const PUBLISHER = process.env.NEXT_PUBLIC_PUBLISHER as `0x${string}`;

export function useLiveActivity() {
  const [items, setItems] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sdk = getSdk();

    const tick = async () => {
      try {
        setError(null);
        
        const allData = await sdk.streams.getAllPublisherDataForSchema(SCHEMA_ID, PUBLISHER);

        if (!allData || !Array.isArray(allData) || allData.length === 0) {
          return;
        }

        const activities: Activity[] = allData.map((item: any) => {
          const fieldMap: Record<string, any> = {};
          
          // Extract values from the nested field structure
          if (Array.isArray(item)) {
            for (const field of item) {
              if (field?.value?.value !== undefined) {
                fieldMap[field.name] = field.value.value;
              }
            }
          }

          return {
            user: fieldMap.user || '0x',
            activityType: fieldMap.activityType || '',
            activityContext: fieldMap.activityContext || '',
            activityValue: BigInt(fieldMap.activityValue || 0),
            realm: Number(fieldMap.realm || 0),
            timestamp: Number(fieldMap.timestamp || 0),
            sourceId: fieldMap.sourceId || '0x',
          };
        });

        activities.sort((a, b) => b.timestamp - a.timestamp);
        setItems(activities.slice(0, 200));
        
      } catch (err) {
        console.error("poll error", err);
        setError(`Failed to load activities: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    tick();
    timer.current = setInterval(tick, 10000);
    return () => timer.current && clearInterval(timer.current);
  }, []);

  const byRealm = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const it of items) counts[it.realm] = (counts[it.realm] ?? 0) + 1;
    return counts;
  }, [items]);

  const tpm = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    return items.filter((i) => now - i.timestamp <= 60).length;
  }, [items]);

  return { items, byRealm, tpm, error };
}