export const setPreCreatedUserEmail = (email?: string) => {
  !!email && localStorage.setItem('pre-created_user_email', email);
};

export const getPreCreatedUserEmail = (): string | null => {
  return localStorage.getItem('pre-created_user_email');
};
