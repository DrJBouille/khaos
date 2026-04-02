export enum STATUS {
  NOT_STARTED = "NOT STARTED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface Color {
  textColor: string
  primaryColor: string
  secondaryColor: string
}

export const STATUS_COLORS: Record<STATUS, Color> = {
  [STATUS.NOT_STARTED]: {
    textColor: "text-gray-800",
    primaryColor: "bg-gray-100",
    secondaryColor: "border-gray-300",
  },
  [STATUS.PENDING]: {
    textColor: "text-yellow-800",
    primaryColor: "bg-yellow-100",
    secondaryColor: "border-yellow-300",
  },
  [STATUS.RUNNING]: {
    textColor: "text-blue-800",
    primaryColor: "bg-blue-100",
    secondaryColor: "border-blue-300",
  },
  [STATUS.FINISHED]: {
    textColor: "text-green-800",
    primaryColor: "bg-green-100",
    secondaryColor: "border-green-300",
  },
  [STATUS.FAILED]: {
    textColor: "text-red-800",
    primaryColor: "bg-red-100",
    secondaryColor: "border-red-300",
  },
  [STATUS.CANCELLED]: {
    textColor: "text-gray-600",
    primaryColor: "bg-gray-100",
    secondaryColor: "border-gray-300",
  },
}
