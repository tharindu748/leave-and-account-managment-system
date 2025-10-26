// import { create } from "zustand";
// import { jwtDecode } from "jwt-decode";
// import api from "@/api/axios";

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   isAdmin: boolean;
//   employeeId: string | null;
// } | null;

// interface AuthState {
//   user: User;
//   accessToken: string | null;
//   isLoading: boolean;
//   login: (accessToken: string) => void;
//   logout: () => Promise<void>;
//   checkAuth: () => Promise<void>;
// }

// type JwtPayload = {
//   sub: number;
//   name: string;
//   email: string;
//   isAdmin: boolean;
//   employeeId: string | null;
// };

// export const useAuth = create<AuthState>((set, get) => ({
//   user: null,
//   accessToken: null,
//   isLoading: true,
//   login: (accessToken) => {
//     try {
//       const decoded = jwtDecode<JwtPayload>(accessToken);
//       set({
//         user: {
//           id: decoded.sub,
//           name: decoded.name,
//           email: decoded.email,
//           isAdmin: decoded.isAdmin,
//           employeeId: decoded.employeeId,
//         },
//         accessToken,
//       });
//     } catch {
//       set({ user: null, accessToken: null });
//     }
//   },

//   logout: async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout failed", error);
//     } finally {
//       set({ user: null, accessToken: null });
//     }
//   },
//   checkAuth: async () => {
//     try {
//       const { data } = await api.post("/auth/refresh");
//       get().login(data.accessToken);
//     } catch (error) {
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import api from "@/api/axios";

type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  employeeId: string | null;
} | null;

interface AuthState {
  user: User;
  accessToken: string | null;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type JwtPayload = {
  sub: number;
  name: string;
  email: string;
  isAdmin: boolean;
  employeeId: string | null;
};

// Helper functions for localStorage
const storage = {
  getToken: () => localStorage.getItem('accessToken'),
  setToken: (token: string) => localStorage.setItem('accessToken', token),
  clearToken: () => localStorage.removeItem('accessToken'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User) => localStorage.setItem('user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('user'),
};

export const useAuth = create<AuthState>((set, get) => ({
  user: storage.getUser(), // Initialize from localStorage
  accessToken: storage.getToken(), // Initialize from localStorage
  isLoading: true,
  
  login: (accessToken) => {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const user = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        employeeId: decoded.employeeId,
      };
      
      // Save to localStorage
      storage.setToken(accessToken);
      storage.setUser(user);
      
      // Update state
      set({
        user,
        accessToken,
      });
    } catch {
      storage.clearToken();
      storage.clearUser();
      set({ user: null, accessToken: null });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear localStorage
      storage.clearToken();
      storage.clearUser();
      // Clear state
      set({ user: null, accessToken: null });
    }
  },
  
  checkAuth: async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      get().login(data.accessToken);
    } catch (error) {
      // If refresh fails, clear stored auth
      storage.clearToken();
      storage.clearUser();
    } finally {
      set({ isLoading: false });
    }
  },
}));