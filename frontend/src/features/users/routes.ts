import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: "/users",
    name: "Users", // Unique name for the route
    component: () => import("./views/UsersView.vue"), // Lazy-loaded view
    meta: {
      // Example meta fields (optional)
      requiresAuth: true,
      title: "Users",
    },
  },
  // Add other product-related routes here if needed
  // e.g., /products/new, /products/:id/edit
];
