export const capitalizeFirstLetter = (string) => {
  const stringLowercase = string.toLowerCase();
  const capitalized =
    stringLowercase.charAt(0).toUpperCase() + stringLowercase.slice(1);
  return capitalized;
};

export const avatarWithInitials = (string) => {
  const textSplit = string.split(" ");
  const initials =
    textSplit.length > 1
      ? textSplit.shift().charAt(0) + textSplit.pop().charAt(0)
      : string.substring(0, 2);
  return initials.toUpperCase();
};

export const formatSizeBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const uniqueIdentifier = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};
