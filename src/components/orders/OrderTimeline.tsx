import { Order, OrderStage } from "@/types";
import { Check, Circle } from "lucide-react";
import clsx from "clsx";

interface OrderTimelineProps {
  order: Order;
}

const stages: { id: OrderStage; label: string }[] = [
  { id: "PICKUP", label: "Pickup from Warehouse" },
  { id: "WAREHOUSE", label: "In Warehouse / Processing" },
  { id: "SHIPPING", label: "Shipping to Destination" },
  { id: "DELIVERED", label: "Delivered" },
];

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const getCurrentStageIndex = (stage: OrderStage) => {
    return stages.findIndex((s) => s.id === stage);
  };

  const currentIndex = getCurrentStageIndex(order.currentStage);
  
  const isCompleted = order.status === "COMPLETED";
  
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {stages.map((stage, stageIdx) => {
          const isLast = stageIdx === stages.length - 1;
          const isPast = isCompleted || stageIdx < currentIndex;
          const isCurrent = !isCompleted && stageIdx === currentIndex;

          return (
            <li key={stage.id}>
              <div className="relative pb-8">
                
                {!isLast && (
                  <span
                    className={clsx(
                      "absolute top-4 left-4 -ml-px h-full w-0.5",
                       isPast ? "bg-primary" : "bg-gray-200"
                    )}
                    aria-hidden="true"
                  />
                )}
                
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={clsx(
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                        isPast ? "bg-primary" : isCurrent ? "bg-white border-2 border-primary" : "bg-gray-200"
                      )}
                    >
                      {isPast ? (
                        <Check className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : isCurrent ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-500" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className={clsx("text-sm font-medium", isPast || isCurrent ? "text-gray-900" : "text-gray-500")}>
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-primary">Currently in this stage</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
