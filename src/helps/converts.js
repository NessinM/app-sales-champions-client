export const capitalizeFirstLetter = (string) => {
  const stringLowercase = string.toLowerCase();
  const capitalized =
    stringLowercase.charAt(0).toUpperCase() + stringLowercase.slice(1);
  return capitalized;
};

export const avatarWithInitials = (string) => {
  const textSplit = string.split(" ");
  const initials = textSplit.shift().charAt(0) + textSplit.pop().charAt(0);
  return initials.toUpperCase();;
};

export const formatSizeBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};