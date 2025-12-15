export enum PlayerAction {
  Prev = "prev",
  Toggle = "toggle",
  Next = "next",
}

export interface ControlItem {
  action: PlayerAction;
  icon: string;
}