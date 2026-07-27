import type { Access, Where } from "payload";

export const authenticated: Access = ({ req }) => Boolean(req.user);
export const adminOnly: Access = ({ req }) => req.user?.role === "admin";
export const publicRead: Access = () => true;
export const publicContentRead: Access = ({ req }): boolean | Where =>
  req.user ? true : { visible: { equals: true } };
