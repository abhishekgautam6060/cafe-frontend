import { useState } from "react";

let listeners: any[] = [];
let toasts: any[] = [];

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function useToast() {
  const [state, setState] = useState(toasts);

  // subscribe
  if (!listeners.includes(setState)) {
    listeners.push(setState);
  }

  const toast = (message: any) => {
    const newToast = {
      id: Date.now(),
      ...message,
    };

    toasts = [newToast, ...toasts];
    notify();
  };

  return {
    toasts: state,
    toast,
  };
}
