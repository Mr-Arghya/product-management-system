# TODO: Add Logout Functionality in Sidebar

- [ ] Update `src/hooks/useAuth.jsx`: Modify the `logout` function to clear both user and token from state and localStorage.
- [ ] Update `src/components/Sidebar.jsx`: Add a logout button in the footer div (above the copyright), with onClick handler that calls `logout()` and navigates to `/login`.
- [ ] Test the logout functionality to ensure it clears data and redirects properly.
