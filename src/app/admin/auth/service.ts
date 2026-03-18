
export const authService = {
  login: async (email: string, password: string) => {
    // In a real app, this would make a request to a server
    if (email === "admin@pegasus.com" && password === "password") {
      // Simulate a successful login
      const user = { name: "Admin User", email: "admin@pegasus.com" };
      const token = "fake-jwt-token";
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { user, token };
    } else {
      throw new Error("Invalid email or password");
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
};
