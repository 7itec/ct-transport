export default (milliseconds: number): string => {
  // Convert milliseconds to seconds
  let totalSeconds: number = Math.floor(milliseconds / 1000);

  // Calculate minutes and remaining seconds
  let minutes: number = Math.floor(totalSeconds / 60);
  let seconds: number = totalSeconds % 60;

  // Format the result as "m:ss"
  let formattedTime: string = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
};
